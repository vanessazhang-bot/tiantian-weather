const CoupleWeatherService = require('../couple-weather.js');
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
      couple: {
        enabled: true,
        service: 'pushdeer',
        my_pushkey: process.env.MY_PUSHKEY || '',
        partner_name: process.env.PARTNER_NAME || '亲爱的',
        partner_pushkey: process.env.PARTNER_PUSHKEY || '',
        partner_city: '深圳'
      },
      pushdeer: {
        enabled: true,
        pushkey: `${process.env.MY_PUSHKEY || ''},${process.env.PARTNER_PUSHKEY || ''}`
      }
    };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    
    const service = new CoupleWeatherService();
    const success = await service.sendCoupleWeather();
    
    if (success) {
      console.log('✅ 定时推送完成');
      res.status(200).json({ success: true, message: '推送成功' });
    } else {
      console.log('❌ 定时推送失败');
      res.status(500).json({ success: false, message: '推送失败' });
    }
  } catch (error) {
    console.error('❌ 执行错误:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
