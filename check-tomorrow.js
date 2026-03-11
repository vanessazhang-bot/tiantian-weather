#!/usr/bin/env node

const { getTomorrowWeather } = require('./weather-qweather');

async function checkTomorrowWeather() {
  console.log('====================================');
  console.log('   天天助手 - 明天天气查询');
  console.log('====================================\n');

  try {
    console.log('正在获取深圳明天天气...\n');

    const result = await getTomorrowWeather('深圳');

    if (result.success) {
      console.log('✅ 天气获取成功！\n');

      const w = result.weather;

      console.log('📅 明天天气预报');
      console.log('='.repeat(40));
      console.log(`🌤️ 城市：${result.city}`);
      console.log(`📆 日期：${result.date}`);
      console.log(`🌡️ 温度范围：${w.temperatureMin}°C ~ ${w.temperatureMax}°C`);
      console.log(`📊 平均温度：${w.avgTemp}°C`);
      console.log(`☁️ 天气状况：${w.condition}`);
      console.log(`💧 湿度：${w.humidity}`);
      console.log(`💨 风速：${w.windSpeed}`);
      console.log('='.repeat(40));

      console.log('\n👕 穿衣建议：');
      result.clothingAdvice.forEach(advice => {
        console.log(`   • ${advice}`);
      });

      console.log('\n💪 祝您明天一切顺利！');
      console.log('====================================\n');

      return result;
    } else {
      console.error('❌ 获取天气失败:', result.message);
      return null;
    }

  } catch (error) {
    console.error('❌ 查询失败:', error.message);
    console.log('\n可能的原因：');
    console.log('1. 和风天气API Key未配置或错误');
    console.log('2. 网络连接问题');
    console.log('3. API额度已用完');
    return null;
  }
}

checkTomorrowWeather();
