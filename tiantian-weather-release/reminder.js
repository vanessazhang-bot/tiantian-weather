const { getFormattedWeatherInfo } = require('./weather');
const { getTodayTasks, formatTasks } = require('./tasks');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

/**
 * 生成每日提醒消息
 */
async function generateDailyReminder() {
  try {
    // 获取天气信息
    const weatherInfo = await getFormattedWeatherInfo(config.city);
    
    // 获取今日任务
    const todayTasks = getTodayTasks();
    const tasksText = formatTasks(todayTasks);
    
    // 生成提醒消息
    let message = `☀️ 早上好！我是天天，为您播报今日晨间提醒\n\n`;
    
    // 天气部分
    if (weatherInfo.success) {
      const w = weatherInfo.weather;
      message += `🌤️ ${config.city}天气\n`;
      message += `📅 ${weatherInfo.date}\n`;
      message += `🌡️ 温度：${w.temperature}°C（体感 ${w.feelsLike}°C）\n`;
      message += `☁️ 天气：${w.condition}\n`;
      message += `💧 湿度：${w.humidity}%\n`;
      message += `💨 风速：${w.windSpeed} km/h\n\n`;
      
      // 穿衣建议
      message += `👕 穿衣建议：\n`;
      weatherInfo.clothingAdvice.forEach(advice => {
        message += `   • ${advice}\n`;
      });
      message += `\n`;
    } else {
      message += `❌ 暂时无法获取天气信息\n\n`;
    }
    
    // 任务部分
    message += tasksText;
    
    message += `\n💪 今天也要加油呀！有需要随时叫我~`;
    
    return message;
  } catch (error) {
    console.error('生成提醒消息失败:', error);
    return '早上好！今天也要加油呀！💪';
  }
}

/**
 * 发送通知（支持多种推送服务）
 */
async function sendNotification(message, title = '天天提醒') {
  const { NotificationManager } = require('./notification');
  const manager = new NotificationManager();

  const success = await manager.send(message, title);

  if (!success) {
    console.log('⚠️  所有推送服务均未配置或失败，消息已显示在控制台');
  }

  return success;
}

/**
 * 执行每日提醒
 */
async function executeDailyReminder() {
  console.log(`[${new Date().toLocaleString('zh-CN')}] 开始执行每日提醒...`);
  
  const message = await generateDailyReminder();
  await sendNotification(message);
  
  console.log('每日提醒完成');
}

/**
 * 启动定时提醒服务
 */
function startReminderService() {
  const schedule = require('node-schedule');
  
  // 解析提醒时间
  const [hours, minutes] = config.reminder_time.split(':').map(Number);
  
  // 创建定时任务
  schedule.scheduleJob({ hour: hours, minute: minutes }, async () => {
    await executeDailyReminder();
  });
  
  console.log(`✅ 定时提醒服务已启动，每天 ${config.reminder_time} 发送提醒`);
  console.log('按 Ctrl+C 停止服务');
}

// 如果直接运行此文件，启动定时服务
if (require.main === module) {
  startReminderService();
}

module.exports = {
  generateDailyReminder,
  sendNotification,
  executeDailyReminder,
  startReminderService
};
