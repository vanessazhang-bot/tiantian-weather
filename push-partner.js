/**
 * push-partner.js - 给 partner（黄sir）推送天气
 * 每天 08:30 北京时间执行
 */
const CoupleWeatherService = require('./couple-weather.js');
const weather = require('./weather.js');
const { getCityByIP, isCitySupported } = require('./location.js');

async function main() {
  const service = new CoupleWeatherService();

  if (!service.config.couple?.partner_pushkey) {
    console.error('❌ 未配置 partner_pushkey');
    process.exit(1);
  }

  let city = await getCityByIP();
  if (!city || !isCitySupported(city)) {
    console.log(`⚠️ IP定位失败，使用默认城市: 深圳`);
    city = '深圳';
  }
  console.log(`📍 定位城市: ${city}`);

  const weatherResult = await weather.getTodayWeather(city);
  if (!weatherResult.success) {
    console.error('❌ 获取天气失败:', weatherResult.message);
    process.exit(1);
  }

  const partnerName = service.config.couple.partner_name || '亲爱的';
  const { title, content } = service.buildPartnerMessage(weatherResult, partnerName, city);
  console.log(`📤 推送给 ${partnerName}...`);
  
  const ok = await service.sendToPushkey(service.config.couple.partner_pushkey, title, content);
  if (ok) {
    console.log(`✅ 推送成功！`);
    process.exit(0);
  } else {
    console.error(`❌ 推送失败！`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ 执行出错:', err);
  process.exit(1);
});
