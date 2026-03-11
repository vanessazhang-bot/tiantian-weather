const schedule = require('node-schedule');
const CoupleWeatherService = require('./couple-weather.js');

console.log('⏰ 定时任务已启动...');
console.log('📅 每天早上 8:30 自动推送情侣天气\n');

// 每天早上 8:30 执行
const job = schedule.scheduleJob('30 8 * * *', async function() {
  console.log(`\n🕰️ ${new Date().toLocaleString()} - 开始执行定时推送...`);
  
  const service = new CoupleWeatherService();
  await service.sendCoupleWeather();
  
  console.log('✅ 定时推送完成\n');
});

console.log('✅ 定时任务设置成功！');
console.log('💡 提示：保持此窗口运行，不要关闭');
console.log('💡 按 Ctrl+C 可以停止\n');

// 立即执行一次测试
console.log('🧪 是否立即测试一次推送？(y/n)');

// 导出供外部使用
module.exports = { job };
