const MultiWeatherService = require('./multi-weather.js');
const UserManager = require('./userManager.js');

/**
 * 定时推送服务
 * 根据用户设置的推送时间进行推送
 */
async function scheduledPush() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
  
  console.log(`\n🕰️ 当前时间: ${currentTime}`);
  console.log('═'.repeat(60));
  
  // 重新加载用户配置
  const userManager = new UserManager();
  const allUsers = userManager.getAllUsers();
  
  // 筛选出当前时间需要推送的用户
  const usersToPush = allUsers.filter(user => {
    if (!user.schedule || !user.schedule.enabled) return false;
    return user.schedule.time === currentTime;
  });
  
  if (usersToPush.length === 0) {
    console.log('⏭️  当前时间没有需要推送的用户');
    console.log(`📋 已启用用户及推送时间:`);
    allUsers.forEach(user => {
      console.log(`   - ${user.name}: ${user.schedule?.time || '未设置'}`);
    });
    return;
  }
  
  console.log(`📤 当前时间 ${currentTime} 需要推送的用户: ${usersToPush.map(u => u.name).join(', ')}\n`);
  
  // 创建推送服务并推送
  const service = new MultiWeatherService();
  
  for (const user of usersToPush) {
    console.log(`🎯 推送给: ${user.name}`);
    await service.pushWeatherForUser(user);
    console.log('');
  }
  
  console.log('═'.repeat(60));
  console.log('✅ 定时推送完成！');
}

// 如果直接运行此文件
if (require.main === module) {
  scheduledPush().catch(error => {
    console.error('❌ 执行错误:', error.message);
    process.exit(1);
  });
}

module.exports = scheduledPush;
