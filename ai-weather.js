const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'simple-config.json');

/**
 * AI天气推送服务
 * 使用LLM生成个性化消息内容
 */
class AIWeatherService {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ 配置文件读取失败:', error.message);
      console.log('请复制 simple-config.example.json 为 simple-config.json 并填写配置');
      process.exit(1);
    }
  }

  /**
   * 获取天气数据
   */
  async getWeather(city = '深圳') {
    try {
      const cityMap = {
        '深圳': { lat: 22.5431, lon: 114.0579 },
        '北京': { lat: 39.9042, lon: 116.4074 },
        '上海': { lat: 31.2304, lon: 121.4737 },
        '广州': { lat: 23.1291, lon: 113.2644 },
        '杭州': { lat: 30.2741, lon: 120.1551 },
        '成都': { lat: 30.5728, lon: 104.0668 }
      };

      const coords = cityMap[city] || cityMap['深圳'];
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${this.config.openweather_key}&units=metric&lang=zh_cn`;
      
      const response = await axios.get(url);
      const data = response.data;
      
      return {
        city: city,
        temp: Math.round(data.main.temp),
        feels_like: Math.round(data.main.feels_like),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        wind: data.wind.speed
      };
    } catch (error) {
      console.error('获取天气失败:', error.message);
      return null;
    }
  }

  /**
   * 使用AI生成消息
   */
  async generateMessage(weather, user) {
    const date = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dateStr = `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;

    const prompt = `今天是${dateStr}，${weather.city}的天气：${weather.condition}，气温${weather.temp}°C。

请为"${user.name}"写一条天气推送消息，要求：
1. 标题要吸引人，带emoji
2. 语气要${user.style}
3. ${user.extra || ''}
4. 包含：天气情况、穿衣建议、出行提醒
5. 最后加一句温馨的结束语

格式：
标题：[标题]
内容：[内容，用横线分隔不同板块]`;

    try {
      const aiConfig = this.config.ai;
      const response = await axios.post(
        `${aiConfig.base_url}/chat/completions`,
        {
          model: aiConfig.model,
          messages: [
            { role: 'system', content: '你是一个贴心的天气助手，擅长写温暖有趣的天气推送消息。' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8
        },
        {
          headers: {
            'Authorization': `Bearer ${aiConfig.api_key}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      
      // 解析标题和内容
      const titleMatch = content.match(/标题[:：]\s*(.+)/);
      const contentMatch = content.match(/内容[:：]\s*([\s\S]+)/);
      
      return {
        title: titleMatch ? titleMatch[1].trim() : `🌤️ 早安，${user.name}～`,
        content: contentMatch ? contentMatch[1].trim() : content
      };
    } catch (error) {
      console.error('AI生成消息失败:', error.message);
      // 降级为默认消息
      return this.generateDefaultMessage(weather, user);
    }
  }

  /**
   * 生成默认消息（AI失败时使用）
   */
  generateDefaultMessage(weather, user) {
    const date = new Date();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const dateStr = `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;

    return {
      title: `🌤️ 早安，${user.name}～`,
      content: `📍 ${weather.city} · ${dateStr}

🌡️ 今天${weather.condition}，气温${weather.temp}°C

─────────────────

👗 穿衣建议：
  ${weather.temp < 15 ? '建议穿厚外套，注意保暖' : weather.temp < 25 ? '建议穿长袖或薄外套' : '建议穿短袖，注意防晒'}

🚗 出行提醒：
  今天天气不错，记得带好心情出门！

─────────────────

💕 祝你今天愉快～`
    };
  }

  /**
   * 发送推送
   */
  async sendPush(user, message) {
    try {
      const response = await axios.post('https://api2.pushdeer.com/message/push', {
        pushkey: user.pushkey,
        text: message.title,
        desp: message.content,
        type: 'text'
      });

      if (response.data.code === 0) {
        console.log(`✅ ${user.name} 推送成功`);
        return true;
      } else {
        console.error(`❌ ${user.name} 推送失败:`, response.data.error);
        return false;
      }
    } catch (error) {
      console.error(`❌ ${user.name} 推送失败:`, error.message);
      return false;
    }
  }

  /**
   * 推送所有用户
   */
  async pushAll() {
    console.log('\n🌤️ 开始生成AI天气推送...\n');

    const weather = await this.getWeather();
    if (!weather) {
      console.error('❌ 无法获取天气信息');
      return;
    }

    console.log(`📍 当前天气: ${weather.city} ${weather.condition} ${weather.temp}°C\n`);

    for (const user of this.config.users) {
      console.log(`📝 正在为 ${user.name} 生成消息...`);
      const message = await this.generateMessage(weather, user);
      await this.sendPush(user, message);
      console.log('');
    }

    console.log('✅ 全部推送完成！');
  }
}

// 运行
if (require.main === module) {
  const service = new AIWeatherService();
  service.pushAll();
}

module.exports = AIWeatherService;
