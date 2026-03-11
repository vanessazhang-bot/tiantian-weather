const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');

/**
 * 加载配置
 */
function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (error) {
    return {};
  }
}

/**
 * 获取城市ID（和风天气使用城市ID）
 */
function getCityId(city) {
  const cityIds = {
    '深圳': '101280601',
    '北京': '101010100',
    '上海': '101020100',
    '广州': '101280101',
    '杭州': '101210101',
    '南京': '101190101',
    '成都': '101270101',
    '武汉': '101200101',
    '西安': '101110101',
    '重庆': '101040100',
    '天津': '101030100',
    '苏州': '101190401',
    '厦门': '101230201'
  };
  return cityIds[city] || '101280601'; // 默认深圳
}

/**
 * 获取天气信息 - 使用和风天气API
 */
async function getWeather(city = '深圳') {
  const config = loadConfig();

  if (!config.qweather?.enabled || !config.qweather?.key) {
    throw new Error('和风天气API未配置，请在config.json中添加qweather.key');
  }

  const cityId = getCityId(city);
  const apiKey = config.qweather.key;

  try {
    // 获取实时天气
    const currentResponse = await axios.get(
      `https://devapi.qweather.com/v7/weather/now?location=${cityId}&key=${apiKey}`,
      { timeout: 10000 }
    );

    // 获取3天预报
    const forecastResponse = await axios.get(
      `https://devapi.qweather.com/v7/weather/3d?location=${cityId}&key=${apiKey}`,
      { timeout: 10000 }
    );

    if (currentResponse.data.code !== '200' || forecastResponse.data.code !== '200') {
      throw new Error('API返回错误: ' + currentResponse.data.code);
    }

    const current = currentResponse.data.now;
    const tomorrow = forecastResponse.data.daily[1]; // 明天是索引1

    return {
      success: true,
      city: city,
      today: {
        temp: parseInt(current.temp),
        condition: current.text,
        humidity: current.humidity + '%',
        windSpeed: current.windScale + '级',
        feelsLike: current.feelsLike
      },
      tomorrow: {
        date: tomorrow.fxDate,
        tempMax: parseInt(tomorrow.tempMax),
        tempMin: parseInt(tomorrow.tempMin),
        condition: tomorrow.textDay,
        humidity: tomorrow.humidity + '%',
        windSpeed: tomorrow.windScaleDay + '级'
      }
    };

  } catch (error) {
    console.error('获取天气失败:', error.message);
    throw error;
  }
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

  if (!weather || !weather.success) {
    return {
      success: false,
      message: '无法获取天气信息'
    };
  }

  const t = weather.tomorrow;
  const avgTemp = Math.round((t.tempMax + t.tempMin) / 2);

  return {
    success: true,
    city: city,
    date: t.date,
    source: '和风天气',
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

module.exports = {
  getWeather,
  getTomorrowWeather,
  getClothingAdvice,
  getCityId
};
