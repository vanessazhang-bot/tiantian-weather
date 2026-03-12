const axios = require('axios');
const UserManager = require('./userManager.js');
const MessageBuilder = require('./messageBuilder.js');
const weather = require('./weather.js');
const { getCityByIP, isCitySupported } = require('./location.js');

/**
 * 多用户天气推送服务
 */
class MultiWeatherService {
  constructor() {
    this.userManager = new UserManager();
  }

  /**
   * 获取用户城市（支持IP定位）
   */
  async getUserCity(user) {
    if (user.useIP) {
      const city = await getCityByIP();
      if (city && isCitySupported(city)) {
        return city;
      }
      console.log(`⚠️  ${user.name} IP定位失败，使用默认城市`);
    }
    return user.city || '深圳';
  }

  /**
   * 发送消息到指定pushkey
   */
  async sendToPushkey(pushkey, title, content) {
    const baseUrl = 'https://api2.pushdeer.com/message/push';
    
    try {
      const response = await axios.post(baseUrl, {
        pushkey: pushkey,
        text: title,
        desp: content,
        type: 'text'
      });

      if (response.data.code === 0) {
        console.log(`  ✅ 推送成功`);
        return true;
      } else {
        console.error(`  ❌ 推送失败:`, response.data.error || '未知错误');
        return false;
      }
    } catch (error) {
      console.error(`  ❌ 推送失败:`, error.message);
      return false;
    }
  }

  /**
   * 为单个用户推送天气
   */
  async pushWeatherForUser(user) {
    if (!user.enabled) {
      console.log(`⏭️  跳过已禁用用户: ${user.name}`);
      return false;
    }

    console.log(`\n📤 推送给: ${user.name}`);
    
    // 获取城市
    const city = await this.getUserCity(user);
    console.log(`  📍 城市: ${city}`);

    // 获取天气
    const weatherResult = await weather.getTodayWeather(city);
    if (!weatherResult.success) {
      console.error(`  ❌ 获取天气失败:`, weatherResult.message);
      return false;
    }

    // 构建个性化消息
    const builder = new MessageBuilder(user, this.userManager.users.quotes);
    const { title, content } = builder.buildMessage(weatherResult, city);

    // 发送推送
    const success = await this.sendToPushkey(user.pushkey, title, content);
    return success;
  }

  /**
   * 推送所有用户天气
   */
  async pushAllUsers() {
    const users = this.userManager.getAllUsers();
    
    if (users.length === 0) {
      console.log('⚠️  没有启用的用户');
      return;
    }

    console.log(`\n🌤️  开始推送天气给 ${users.length} 位用户`);
    console.log('═'.repeat(60));

    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      const success = await this.pushWeatherForUser(user);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`📊 推送完成: ✅ ${successCount} 成功, ❌ ${failCount} 失败`);
  }

  /**
   * 推送给指定用户
   */
  async pushToUser(userId) {
    const user = this.userManager.getUser(userId);
    if (!user) {
      console.log('❌ 未找到该用户');
      return false;
    }
    return await this.pushWeatherForUser(user);
  }
}

module.exports = MultiWeatherService;

// 如果直接运行此文件
if (require.main === module) {
  const service = new MultiWeatherService();
  
  const args = process.argv.slice(2);
  const userId = args[0];
  
  if (userId) {
    service.pushToUser(userId);
  } else {
    service.pushAllUsers();
  }
}
