#!/usr/bin/env node

/**
 * 天天 - 您的生活/工作助理
 * 负责：天气查询、任务管理、定时提醒
 */

const { getTomorrowWeather } = require('./weather-qweather');
const { NotificationManager } = require('./notification');
const { FeishuAppService } = require('./feishu-app');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');

class Tiantian {
  constructor() {
    this.config = this.loadConfig();
    this.notification = new NotificationManager();
    this.feishu = new FeishuAppService();
  }

  loadConfig() {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch (error) {
      return {};
    }
  }

  /**
   * 获取明天天气并推送
   */
  async getTomorrowWeatherAndPush() {
    console.log('☀️ 天天正在为您查询明天天气...\n');

    try {
      const result = await getTomorrowWeather('深圳');

      if (!result.success) {
        console.log('❌ 获取天气失败:', result.message);
        return false;
      }

      const w = result.weather;

      // 生成消息
      const message = this.formatWeatherMessage(result);

      console.log('📤 正在推送消息...');

      // 推送到所有启用的服务
      const pushResult = await this.pushMessage(message, '明天天气预报');

      if (pushResult) {
        console.log('✅ 推送成功！');
      } else {
        console.log('⚠️ 推送失败，但消息已显示');
      }

      // 显示在控制台
      console.log('\n' + message);

      return true;

    } catch (error) {
      console.error('❌ 查询失败:', error.message);
      return false;
    }
  }

  /**
   * 格式化天气消息
   */
  formatWeatherMessage(result) {
    const w = result.weather;

    let message = `🌅 明天天气预报\n\n`;
    message += `📅 日期：${result.date}\n`;
    message += `🌤️ 城市：${result.city}\n`;
    message += `🌡️ 温度：${w.temperatureMin}°C ~ ${w.temperatureMax}°C\n`;
    message += `📊 平均：${w.avgTemp}°C\n`;
    message += `☁️ 天气：${w.condition}\n`;
    message += `💧 湿度：${w.humidity}\n`;
    message += `💨 风速：${w.windSpeed}\n\n`;
    message += `👕 穿衣建议：\n`;
    result.clothingAdvice.forEach(advice => {
      message += `• ${advice}\n`;
    });
    message += `\n💪 祝您明天一切顺利！`;

    return message;
  }

  /**
   * 推送消息到所有启用的服务
   */
  async pushMessage(message, title) {
    let success = false;

    // 1. 尝试飞书
    if (this.config.feishu?.enabled) {
      const feishuResult = await this.feishu.sendToUser(message, title);
      if (feishuResult) success = true;
    }

    // 2. 尝试PushDeer
    if (this.config.pushdeer?.enabled) {
      const pushdeerResult = await this.notification.send(message, title);
      if (pushdeerResult) success = true;
    }

    // 3. 尝试其他服务
    if (!success) {
      const otherResult = await this.notification.send(message, title);
      if (otherResult) success = true;
    }

    return success;
  }

  /**
   * 处理用户查询
   */
  async handleQuery(query) {
    if (query.includes('明天') && query.includes('天气')) {
      return await this.getTomorrowWeatherAndPush();
    }

    if (query.includes('任务') || query.includes('todo')) {
      return await this.listTasks();
    }

    // 默认回复
    console.log('💬 天天：您好！我可以帮您：');
    console.log('   • 查询明天天气');
    console.log('   • 管理任务清单');
    console.log('   • 每日定时提醒');
    console.log('\n请告诉我您需要什么帮助~');
    return true;
  }

  /**
   * 列出任务
   */
  async listTasks() {
    const tasks = require('./tasks');
    const todayTasks = tasks.getTodayTasks();
    const formatted = tasks.formatTasks(todayTasks);
    console.log(formatted);
    return true;
  }

  /**
   * 打招呼
   */
  sayHello() {
    console.log(`
╔══════════════════════════════════════╗
║                                      ║
║     ☀️ 天天 - 您的生活助理          ║
║                                      ║
║  每天早上9:00为您推送天气和任务      ║
║                                      ║
╚══════════════════════════════════════╝
`);
  }
}

// 如果直接运行
if (require.main === module) {
  const tiantian = new Tiantian();

  // 获取命令行参数
  const query = process.argv.slice(2).join(' ');

  if (query) {
    // 处理用户查询
    tiantian.handleQuery(query);
  } else {
    // 默认查询明天天气
    tiantian.sayHello();
    tiantian.getTomorrowWeatherAndPush();
  }
}

module.exports = {
  Tiantian
};
