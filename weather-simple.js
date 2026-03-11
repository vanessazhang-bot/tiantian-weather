const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');

/**
 * 获取天气信息（使用和风天气API，需要申请key）
 * 或者使用备用API
 */
async function getWeather(city = '深圳') {
  try {
    // 方法1：使用中国天气网API（无需key，但可能不稳定）
    // 方法2：使用备用API
    // 方法3：使用模拟数据（用于测试）

    // 先尝试备用API
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)},cn&appid=demo&units=metric&lang=zh_cn`, {
        timeout: 5000
      });
      return response.data;
    } catch (e) {
      console.log('备用API连接失败，使用模拟数据...');
    }

    // 如果都失败，返回模拟数据
    return getMockWeather(city);
  } catch (error) {
    console.error('获取天气失败:', error.message);
    return getMockWeather(city);
  }
}

/**
 * 模拟天气数据（用于测试）
 */
function getMockWeather(city) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 根据季节生成合理的温度
  const month = today.getMonth() + 1;
  let baseTemp = 25;

  if (month >= 3 && month <= 5) baseTemp = 22; // 春季
  else if (month >= 6 && month <= 8) baseTemp = 30; // 夏季
  else if (month >= 9 && month <= 11) baseTemp = 25; // 秋季
  else baseTemp = 15; // 冬季

  const conditions = ['晴', '多云', '阴', '小雨', '雷阵雨'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];

  return {
    city: city,
    today: {
      date: today.toISOString().split('T')[0],
      temp: baseTemp,
      condition: condition,
      humidity: 60 + Math.floor(Math.random() * 20),
      windSpeed: 5 + Math.floor(Math.random() * 10)
    },
    tomorrow: {
      date: tomorrow.toISOString().split('T')[0],
      tempMax: baseTemp + 3,
      tempMin: baseTemp - 3,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: 60 + Math.floor(Math.random() * 20),
      windSpeed: 5 + Math.floor(Math.random() * 10)
    }
  };
}

/**
 * 获取穿衣建议
 */
function getClothingAdvice(temp, condition) {
  let advice = [];

  if (temp >= 30) {
    advice.push('天气炎热，建议穿短袖、短裤或薄裙');
    advice.push('注意防暑降温，多喝水');
  } else if (temp >= 25) {
    advice.push('天气温暖，建议穿短袖或薄长袖');
    advice.push('适合户外活动');
  } else if (temp >= 18) {
    advice.push('天气舒适，建议穿长袖或薄外套');
  } else if (temp >= 10) {
    advice.push('天气较凉，建议穿毛衣或厚外套');
    advice.push('注意保暖');
  } else {
    advice.push('天气寒冷，建议穿羽绒服或厚棉服');
    advice.push('一定要保暖，戴好围巾和手套');
  }

  if (condition.includes('雨') || condition.includes('雷')) {
    advice.push('有降雨，记得带伞');
    advice.push('穿防水鞋子');
  } else if (condition.includes('雪')) {
    advice.push('有降雪，注意防滑');
  } else if (condition.includes('晴')) {
    advice.push('阳光充足，可戴墨镜和帽子');
    advice.push('注意防晒');
  }

  return advice;
}

/**
 * 获取明天天气信息
 */
async function getTomorrowWeather(city = '深圳') {
  const weather = await getWeather(city);

  if (!weather) {
    return {
      success: false,
      message: '无法获取天气信息'
    };
  }

  // 如果是模拟数据
  if (weather.tomorrow) {
    const t = weather.tomorrow;
    const avgTemp = Math.round((t.tempMax + t.tempMin) / 2);

    return {
      success: true,
      city: city,
      date: t.date,
      isMock: true,
      weather: {
        temperatureMax: t.tempMax,
        temperatureMin: t.tempMin,
        avgTemp: avgTemp,
        condition: t.condition,
        humidity: t.humidity,
        windSpeed: t.windSpeed
      },
      clothingAdvice: getClothingAdvice(avgTemp, t.condition)
    };
  }

  return {
    success: false,
    message: '数据格式错误'
  };
}

module.exports = {
  getWeather,
  getTomorrowWeather,
  getClothingAdvice,
  getMockWeather
};
