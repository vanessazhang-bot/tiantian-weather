/**
 * 本地定时任务版本
 * 使用方式: node local-scheduler.js
 * 适合本地电脑运行，需要保持电脑开机
 */

const schedule = require('node-schedule');
const CoupleWeatherService = require('./couple-weather.js');

console.log('⏰ 本地定时任务已启动...');
console.log('📅 每天早上 8:30 自动推送情侣天气');
console.log('💡 提示：需要保持电脑开机运行\n');

// 每天早上 8:30 执行
const job = schedule.scheduleJob('30 8 * * *', async function() {
  console.log(`\n🕰️ ${new Date().toLocaleString()} - 开始执行定时推送...`);
  
  const service = new CoupleWeatherService();
  await service.sendCoupleWeather();
  
  console.log('✅ 定时推送完成\n');
});

console.log('✅ 定时任务设置成功！');
console.log('💡 按 Ctrl+C 可以停止\n');

// 立即执行一次测试
console.log('🧪 立即执行一次测试推送...\n');
const testService = new CoupleWeatherService();
testService.sendCoupleWeather().then(() => {
  console.log('\n✅ 测试完成，等待明天8:30自动推送...\n');
});

module.exports = { job };
