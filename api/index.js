const { getTomorrowWeather } = require('../weather-qweather');
const { NotificationManager } = require('../notification');

/**
 * Vercel Serverless Function
 * 天天助手 - API入口
 */

module.exports = async (req, res) => {
  // 设置CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = req.url.split('?')[0];

  try {
    // 路由处理
    if (path === '/weather/tomorrow' || path === '/') {
      await handleGetTomorrowWeather(req, res);
    } else if (path === '/webhook') {
      await handleWebhook(req, res);
    } else if (path === '/health') {
      handleHealth(req, res);
    } else {
      handleNotFound(req, res);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

/**
 * 获取明天天气
 */
async function handleGetTomorrowWeather(req, res) {
  console.log('📨 收到天气查询请求');

  try {
    const result = await getTomorrowWeather('深圳');

    if (result.success) {
      const w = result.weather;

      // 生成消息
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

      // 推送到PushDeer
      const notification = new NotificationManager();
      await notification.send(message, '明天天气预报');

      res.status(200).json({
        success: true,
        message: '天气查询并推送成功',
        data: result,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message || '获取天气失败'
      });
    }
  } catch (error) {
    console.error('获取天气失败:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

/**
 * 处理Webhook
 */
async function handleWebhook(req, res) {
  const { message, text, type } = req.body || {};
  const content = message || text || '';

  console.log('📨 收到Webhook消息:', content);

  if (content.includes('天气') || content.includes('明天')) {
    // 转发到天气查询
    req.url = '/weather/tomorrow';
    await handleGetTomorrowWeather(req, res);
  } else if (content.includes('任务') || content.includes('todo')) {
    res.status(200).json({
      success: true,
      message: '任务功能开发中...'
    });
  } else {
    res.status(200).json({
      success: true,
      message: '天天收到您的消息：' + content,
      reply: '我可以帮您查询天气或管理任务，请告诉我需要什么帮助~'
    });
  }
}

/**
 * 健康检查
 */
function handleHealth(req, res) {
  res.status(200).json({
    status: 'ok',
    service: '天天助手',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}

/**
 * 404
 */
function handleNotFound(req, res) {
  res.status(404).json({
    error: 'Not Found',
    availableEndpoints: [
      'GET /weather/tomorrow - 查询明天天气',
      'POST /webhook - 接收聊天指令',
      'GET /health - 健康检查'
    ]
  });
}
