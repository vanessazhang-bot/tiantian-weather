const axios = require('axios');
const fs = require('fs');
const path = require('path');
const weather = require('./weather.js');
const { NotificationManager } = require('./notification.js');
const { getCityByIP, isCitySupported } = require('./location.js');

const CONFIG_PATH = path.join(__dirname, 'config.json');

/**
 * 情侣天气推送服务
 */
class CoupleWeatherService {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch (error) {
      return {};
    }
  }

  /**
   * 获取带周几的日期
   */
  getDateWithWeekday() {
    const date = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    const dateStr = date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
    return `${dateStr} ${weekday}`;
  }

  /**
   * 获取随机情话
   */
  getRandomLoveQuote() {
    const quotes = this.config.couple?.love_quotes || [
      '今天也想见到你~',
      '记得想我哦~',
      '爱你每一天~'
    ];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }

  /**
   * 获取随机激励语录（标题叫毒鸡汤，内容是正能量）
   */
  getRandomSoupQuote() {
    const soups = [
      '今天的努力，是幸运的伏笔。',
      '你比你想象的更强大。',
      '每一个不曾起舞的日子，都是对生命的辜负。',
      '星光不问赶路人，时光不负有心人。',
      '愿你成为自己的太阳，无需凭借谁的光。',
      '最好的时光，是你在我身边。',
      '保持热爱，奔赴山海。',
      '愿你眼里有光，心中有爱。',
      '心怀希望，万物可爱。',
      '做最好的自己，遇见最好的生活。',
      '愿你所求皆如愿，所行化坦途。',
      '生活明朗，万物可爱。',
      '人间值得，未来可期。',
      '愿你被这个世界温柔以待。',
      '今天的你，比昨天更优秀。'
    ];
    const randomIndex = Math.floor(Math.random() * soups.length);
    return soups[randomIndex];
  }

  /**
   * 构建给对象的天气消息（俏皮可爱版）
   */
  buildPartnerMessage(weatherData, partnerName, city = '深圳') {
    const loveQuote = this.getRandomLoveQuote();
    const title = `🌤️ 早安呀，${partnerName}～`;
    const dateWithWeekday = this.getDateWithWeekday();
    
    const content = [
      `📍 ${city} · ${dateWithWeekday}`,
      ``,
      `🌡️ 今天${weatherData.weather.temperature}°C，${weatherData.weather.condition}哦～`,
      ``,
      `─────────────────`,
      ``,
      `👔 穿衣指南：`,
      ...weatherData.clothingAdvice.map(a => `  ${a}`),
      ``,
      `🚗 出行提醒：`,
      `  今天天气不错，记得想我！`,
      ``,
      `─────────────────`,
      ``,
      `💕 悄悄话：`,
      `「${loveQuote}」`,
      ``,
      `😘 么么哒～`
    ].join('\n');

    return { title, content };
  }

  /**
   * 构建给自己的天气消息（俏皮可爱版）
   */
  buildMyMessage(weatherData, city = '深圳') {
    const soupQuote = this.getRandomSoupQuote();
    const title = `🌤️ 宝，今天天气来啦～`;
    const dateWithWeekday = this.getDateWithWeekday();
    
    const content = [
      `📍 ${city} · ${dateWithWeekday}`,
      ``,
      `🌡️ 气温 ${weatherData.weather.temperature}°C，${weatherData.weather.condition}～`,
      ``,
      `─────────────────`,
      ``,
      `👗 今天穿啥：`,
      ...weatherData.clothingAdvice.map(a => `  ${a}`),
      ``,
      `🚗 出行小贴士：`,
      `  今天适合出门溜达，记得带好心情！`,
      ``,
      `─────────────────`,
      ``,
      `🍵 喝点毒鸡汤：`,
      `「${soupQuote}」`,
      ``,
      `💕 爱你哟～`
    ].join('\n');

    return { title, content };
  }

  /**
   * 发送情侣天气推送（分别发送不同内容）
   */
  async sendCoupleWeather() {
    if (!this.config.couple?.enabled) {
      console.log('❌ 情侣天气推送未启用');
      return false;
    }

    const partnerName = this.config.couple.partner_name || '亲爱的';
    
    // 获取我的当前城市（通过IP定位）
    let myCity = await getCityByIP();
    if (!myCity || !isCitySupported(myCity)) {
      console.log(`⚠️ 我的IP定位失败或不支持该城市，使用默认城市: 深圳`);
      myCity = '深圳';
    }
    
    // 获取伴侣的城市（也通过IP定位）
    let partnerCity = await getCityByIP();
    if (!partnerCity || !isCitySupported(partnerCity)) {
      console.log(`⚠️ 伴侣IP定位失败或不支持该城市，使用默认城市: 深圳`);
      partnerCity = '深圳';
    }
    
    console.log(`\n📍 我的位置: ${myCity}`);
    console.log(`📍 ${partnerName}的位置: ${partnerCity}\n`);
    
    // 获取两个城市的天气
    console.log(`正在获取 ${myCity} 天气信息...`);
    const myWeatherResult = await weather.getTodayWeather(myCity);
    
    console.log(`正在获取 ${partnerCity} 天气信息...`);
    const partnerWeatherResult = await weather.getTodayWeather(partnerCity);
    
    if (!myWeatherResult.success) {
      console.log(`获取 ${myCity} 天气失败:`, myWeatherResult.message);
      return false;
    }
    
    if (!partnerWeatherResult.success) {
      console.log(`获取 ${partnerCity} 天气失败:`, partnerWeatherResult.message);
      return false;
    }

    // 获取 pushkeys（从 couple 配置中读取）
    const myPushkey = this.config.couple?.my_pushkey;
    const partnerPushkey = this.config.couple?.partner_pushkey;
    
    if (!myPushkey && !partnerPushkey) {
      console.log('❌ 未配置 PushDeer key');
      return false;
    }

    let successCount = 0;

    // 发给自己（我的城市天气+毒鸡汤）
    if (myPushkey) {
      const { title, content } = this.buildMyMessage(myWeatherResult, myCity);
      console.log(`正在推送给自己 (${myCity})...`);
      const success = await this.sendToPushkey(myPushkey, title, content);
      if (success) successCount++;
    }

    // 发给对象（他的城市天气+情话）
    if (partnerPushkey) {
      const { title, content } = this.buildPartnerMessage(partnerWeatherResult, partnerName, partnerCity);
      console.log(`正在推送给 ${partnerName} (${partnerCity})...`);
      const success = await this.sendToPushkey(partnerPushkey, title, content);
      if (success) successCount++;
    }

    const totalKeys = (myPushkey ? 1 : 0) + (partnerPushkey ? 1 : 0);
    console.log(`📊 推送结果: ${successCount}/${totalKeys} 成功`);
    return successCount > 0;
  }

  /**
   * 发送给指定 pushkey
   */
  async sendToPushkey(pushkey, title, content) {
    const axios = require('axios');
    const baseUrl = 'https://api2.pushdeer.com/message/push';
    
    try {
      const response = await axios.post(baseUrl, {
        pushkey: pushkey,
        text: title,
        desp: content,
        type: 'text'
      });

      if (response.data.code === 0) {
        console.log(`✅ 推送成功 (${pushkey.substring(0, 8)}...)`);
        return true;
      } else {
        console.error(`❌ 推送失败 (${pushkey.substring(0, 8)}...):`, response.data.error || '未知错误');
        return false;
      }
    } catch (error) {
      console.error(`❌ 推送失败 (${pushkey.substring(0, 8)}...):`, error.message);
      return false;
    }
  }
}

module.exports = CoupleWeatherService;

// 如果直接运行此文件
if (require.main === module) {
  const service = new CoupleWeatherService();
  service.sendCoupleWeather();
}
