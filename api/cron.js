const MultiWeatherService = require('../multi-weather.js');
const UserManager = require('../userManager.js');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    console.log(`🕰️ ${new Date().toLocaleString()} - 开始执行定时推送...`);
    
    // 从环境变量生成临时配置文件
    const configPath = path.join(__dirname, '..', 'config.json');
    const config = {
      city: '深圳',
      reminder_time: '08:30',
      notification: { service: 'pushdeer' },
      openweather: {
        enabled: true,
        key: process.env.OPENWEATHER_KEY || ''
      },
      pushdeer: {
        enabled: true
      }
    };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    // 生成用户配置文件
    const usersPath = path.join(__dirname, '..', 'users.json');
    const usersConfig = {
      users: [
        {
          id: 'user_001',
          name: '宝宝',
          pushkey: process.env.MY_PUSHKEY || '',
          useIP: true,
          messageStyle: {
            titleTemplate: '🌤️ 宝，今天天气来啦～',
            quoteType: 'inspirational',
            quoteTitle: '🍵 喝点毒鸡汤',
            tone: 'playful',
            showWeatherDetails: true,
            showClothingAdvice: true,
            showTravelTips: true
          },
          enabled: true
        },
        {
          id: 'user_002',
          name: process.env.PARTNER_NAME || '亲爱的',
          pushkey: process.env.PARTNER_PUSHKEY || '',
          useIP: true,
          messageStyle: {
            titleTemplate: '🌤️ 早安呀，{name}～',
            quoteType: 'love',
            quoteTitle: '💕 悄悄话',
            tone: 'sweet',
            showWeatherDetails: true,
            showClothingAdvice: true,
            showTravelTips: true
          },
          enabled: true
        }
      ],
      quotes: {
        inspirational: [
          '今天的努力，是幸运的伏笔。',
          '你比你想象的更强大。',
          '每一个不曾起舞的日子，都是对生命的辜负。',
          '星光不问赶路人，时光不负有心人。',
          '愿你成为自己的太阳，无需凭借谁的光。',
          '保持热爱，奔赴山海。',
          '愿你眼里有光，心中有爱。',
          '心怀希望，万物可爱。',
          '做最好的自己，遇见最好的生活。',
          '今天的你，比昨天更优秀。'
        ],
        love: [
          '今天也想见到你，谁也别想拦着。',
          '你是我所有的少女情怀和心之所向。',
          '我想和你一起看日出日落，数星星月亮。',
          '遇见你之后，我的伟大抱负都变成了黄昏与你归家。',
          '你是我温暖的手套，冰冷的啤酒，带着阳光味道的衬衫。',
          '我想和你虚度时光，比如低头看鱼。',
          '你是我这一生等了半世未拆的礼物。',
          '我想和你一起生活，在某个小镇，共享无尽的黄昏。',
          '你是我心上的月亮，也是我心里的太阳。',
          '今天的风很温柔，就像我想你的心情。',
          '你是我所有的怦然心动。',
          '我想和你一起变老，看遍世间所有的美好。',
          '你是我最想留住的幸运。',
          '今天也要记得想我哦~',
          '你是我所有的温柔和浪漫。'
        ],
        funny: [
          '今天不想上班，只想被你念叨。',
          '我在努力变强，为了给你买好吃的。',
          '生活不止眼前的苟且，还有诗和远方，还有你。',
          '今天也要元气满满地浪费光阴！',
          '我这么可爱，你忍心不来看我吗？'
        ],
        custom: []
      },
      globalSettings: {
        defaultCity: '深圳',
        timezone: 'Asia/Shanghai',
        pushService: 'pushdeer',
        weatherService: 'openweather'
      }
    };
    fs.writeFileSync(usersPath, JSON.stringify(usersConfig, null, 2));
    
    // 使用多用户推送服务
    const service = new MultiWeatherService();
    await service.pushAllUsers();
    
    console.log('✅ 定时推送完成');
    res.status(200).json({ success: true, message: '推送成功' });
  } catch (error) {
    console.error('❌ 执行错误:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
