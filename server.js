#!/usr/bin/env node

/**
 * 天天 - 服务器端运行
 * 提供HTTP API和定时任务
 */

const http = require('http');
const url = require('url');
const { Tiantian } = require('./tiantian');
const schedule = require('node-schedule');

const PORT = process.env.PORT || 3000;

class TiantianServer {
  constructor() {
    this.tiantian = new Tiantian();
    this.server = null;
  }

  /**
   * 启动服务器
   */
  start() {
    // 启动定时任务
    this.startScheduler();

    // 启动HTTP服务器
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    this.server.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════╗
║                                      ║
║     ☀️ 天天服务器已启动              ║
║                                      ║
║  地址: http://localhost:${PORT}        ║
║                                      ║
╚══════════════════════════════════════╝
`);
      console.log('📡 API 端点:');
      console.log(`  GET  /weather/tomorrow  - 查询明天天气`);
      console.log(`  POST /webhook          - 接收聊天指令`);
      console.log(`  GET  /health           - 健康检查`);
      console.log(`\n⏰ 定时任务:`);
      console.log(`  每天 09:00 自动推送天气\n`);
    });
  }

  /**
   * 处理HTTP请求
   */
  async handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // 设置CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // 路由处理
    try {
      if (path === '/weather/tomorrow' && method === 'GET') {
        await this.handleGetTomorrowWeather(req, res);
      } else if (path === '/webhook' && method === 'POST') {
        await this.handleWebhook(req, res);
      } else if (path === '/health' && method === 'GET') {
        this.handleHealth(req, res);
      } else {
        this.handleNotFound(req, res);
      }
    } catch (error) {
      console.error('请求处理错误:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }

  /**
   * 获取明天天气
   */
  async handleGetTomorrowWeather(req, res) {
    console.log('📨 收到天气查询请求');

    const result = await this.tiantian.getTomorrowWeatherAndPush();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: result,
      message: result ? '天气查询并推送成功' : '查询失败',
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * 处理Webhook（接收聊天指令）
   */
  async handleWebhook(req, res) {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        console.log('📨 收到Webhook消息:', data);

        const message = data.message || data.text || '';

        // 处理指令
        if (message.includes('天气') || message.includes('明天')) {
          await this.tiantian.getTomorrowWeatherAndPush();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: '已查询明天天气并推送'
          }));
        } else if (message.includes('任务') || message.includes('todo')) {
          await this.tiantian.listTasks();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: '已显示任务列表'
          }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: '天天收到您的消息：' + message
          }));
        }
      } catch (error) {
        console.error('Webhook处理错误:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  }

  /**
   * 健康检查
   */
  handleHealth(req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: '天天助手',
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * 404处理
   */
  handleNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      error: 'Not Found',
      availableEndpoints: [
        'GET /weather/tomorrow',
        'POST /webhook',
        'GET /health'
      ]
    }));
  }

  /**
   * 启动定时任务
   */
  startScheduler() {
    // 每天早上9:00推送
    schedule.scheduleJob('0 9 * * *', async () => {
      console.log(`\n[${new Date().toLocaleString()}] ⏰ 执行定时任务...`);
      await this.tiantian.getTomorrowWeatherAndPush();
    });

    console.log('✅ 定时任务已启动（每天09:00）');
  }
}

// 启动服务器
const server = new TiantianServer();
server.start();
