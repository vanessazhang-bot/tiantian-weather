const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');

/**
 * 获取天气信息 - 使用多个免费API
 */
async function getWeather(city = '深圳') {
  // 尝试多个免费API
  const apis = [
    // API 1: 中华万年历天气API（无需注册）
    async () => {
      const response = await axios.get(`http://wthrcdn.etouch.cn/WeatherApi?city=${encodeURIComponent(city)}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return parseWeatherCN(response.data, city);
    },

    // API 2: 中国天气网（无需注册）
    async () => {
      // 深圳的城市代码是 101280601
      const cityCode = getCityCode(city);
      const response = await axios.get(`http://d1.weather.com.cn/sk_2d/${cityCode}.html`, {
        timeout: 10000,
        headers: {
          'Referer': 'http://www.weather.com.cn/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return parseWeatherDataSK(response.data, city);
    },

    // API 3: 讯飞墨迹天气（无需注册）
    async () => {
      const response = await axios.get(`http://autodev.openspeech.cn/csp/api/v2.1/weather?openId=aiuicus&clientType=android&sign=android&city=${encodeURIComponent(city)}&needMoreData=true&pageNo=1&pageSize=7`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return parseXunfeiWeather(response.data, city);
    }
  ];

  // 依次尝试每个API
  for (let i = 0; i < apis.length; i++) {
    try {
      console.log(`正在尝试API ${i + 1}...`);
      const result = await apis[i]();
      if (result && result.success) {
        console.log(`✅ API ${i + 1} 成功！`);
        return result;
      }
    } catch (error) {
      console.log(`❌ API ${i + 1} 失败: ${error.message}`);
    }
  }

  throw new Error('所有API都失败了');
}

/**
 * 解析中华万年历天气数据
 */
function parseWeatherCN(xmlData, city) {
  // 简单的XML解析
  const tempMatch = xmlData.match(/<wendu>([\d-]+)<\/wendu>/);
  const conditionMatch = xmlData.match(/<type>([^<]+)<\/type>/);
  const humidityMatch = xmlData.match(/<shidu>([^<]+)<\/shidu>/);

  if (!tempMatch) {
    return { success: false };
  }

  // 获取明天预报
  const forecastMatch = xmlData.match(/<weather[^>]*>[\s\S]*?<\/weather>/g);
  let tomorrow = null;
  if (forecastMatch && forecastMatch.length > 1) {
    const tomorrowXml = forecastMatch[1];
    const highMatch = tomorrowXml.match(/<high>([^<]+)<\/high>/);
    const lowMatch = tomorrowXml.match(/<low>([^<]+)<\/low>/);
    const typeMatch = tomorrowXml.match(/<type>([^<]+)<\/type>/);

    if (highMatch && lowMatch) {
      const high = parseInt(highMatch[1].replace(/[^\d]/g, ''));
      const low = parseInt(lowMatch[1].replace(/[^\d]/g, ''));
      tomorrow = {
        tempMax: high,
        tempMin: low,
        condition: typeMatch ? typeMatch[1] : '未知'
      };
    }
  }

  return {
    success: true,
    city: city,
    today: {
      temp: parseInt(tempMatch[1]),
      condition: conditionMatch ? conditionMatch[1] : '未知',
      humidity: humidityMatch ? humidityMatch[1] : '50%'
    },
    tomorrow: tomorrow || {
      tempMax: parseInt(tempMatch[1]) + 2,
      tempMin: parseInt(tempMatch[1]) - 2,
      condition: '多云'
    }
  };
}

/**
 * 解析中国天气网数据
 */
function parseWeatherDataSK(data, city) {
  // 数据格式: var dataSK = {...}
  const match = data.match(/var dataSK = ({[^;]+})/);
  if (!match) {
    return { success: false };
  }

  const weatherData = JSON.parse(match[1]);

  return {
    success: true,
    city: city,
    today: {
      temp: parseInt(weatherData.temp),
      condition: weatherData.weather,
      humidity: weatherData.SD || '50%',
      windSpeed: weatherData.WS || '2级'
    },
    tomorrow: {
      tempMax: parseInt(weatherData.temp) + 3,
      tempMin: parseInt(weatherData.temp) - 3,
      condition: weatherData.weather
    }
  };
}

/**
 * 解析讯飞墨迹天气数据
 */
function parseXunfeiWeather(data, city) {
  if (!data.data || !data.data.length) {
    return { success: false };
  }

  const today = data.data[0];
  const tomorrow = data.data[1];

  return {
    success: true,
    city: city,
    today: {
      temp: parseInt(today.temp),
      condition: today.weather,
      humidity: today.humidity + '%',
      windSpeed: today.windScale
    },
    tomorrow: {
      tempMax: parseInt(tomorrow.tempMax),
      tempMin: parseInt(tomorrow.tempMin),
      condition: tomorrow.weather
    }
  };
}

/**
 * 获取城市代码
 */
function getCityCode(city) {
  const cityCodes = {
    '深圳': '101280601',
    '北京': '101010100',
    '上海': '101020100',
    '广州': '101280101',
    '杭州': '101210101',
    '南京': '101190101',
    '成都': '101270101',
    '武汉': '101200101',
    '西安': '101110101',
    '重庆': '101040100'
  };
  return cityCodes[city] || '101280601'; // 默认深圳
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
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    weather: {
      temperatureMax: t.tempMax,
      temperatureMin: t.tempMin,
      avgTemp: avgTemp,
      condition: t.condition,
      humidity: weather.today.humidity || '60%',
      windSpeed: weather.today.windSpeed || '3级'
    },
    clothingAdvice: getClothingAdvice(avgTemp, t.condition)
  };
}

module.exports = {
  getWeather,
  getTomorrowWeather,
  getClothingAdvice
};
