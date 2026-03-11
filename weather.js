const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

// 城市名称到和风天气城市ID的映射（常用城市）
const CITY_ID_MAP = {
  '北京': '101010100',
  '上海': '101020100',
  '广州': '101280101',
  '深圳': '101280601',
  '杭州': '101210101',
  '成都': '101270101',
  '武汉': '101200101',
  '西安': '101110101',
  '重庆': '101040100',
  '南京': '101190101',
  '天津': '101030100'
};

// 城市名称到坐标映射（用于OpenWeather）
const CITY_COORDS = {
  '北京': { lat: 39.9042, lon: 116.4074 },
  '上海': { lat: 31.2304, lon: 121.4737 },
  '广州': { lat: 23.1291, lon: 113.2644 },
  '深圳': { lat: 22.5431, lon: 114.0579 },
  '杭州': { lat: 30.2741, lon: 120.1551 },
  '成都': { lat: 30.5728, lon: 104.0668 },
  '武汉': { lat: 30.5928, lon: 114.3055 },
  '西安': { lat: 34.3416, lon: 108.9398 },
  '重庆': { lat: 29.5630, lon: 106.5516 },
  '南京': { lat: 32.0603, lon: 118.7969 },
  '天津': { lat: 39.1252, lon: 117.1904 }
};

/**
 * 获取城市ID
 */
function getCityId(city) {
  return CITY_ID_MAP[city] || '101280601'; // 默认深圳
}

/**
 * 获取城市坐标
 */
function getCityCoords(city) {
  return CITY_COORDS[city] || { lat: 22.5431, lon: 114.0579 }; // 默认深圳
}

/**
 * 获取天气信息（优先使用OpenWeather API）
 */
async function getWeather(city = '深圳') {
  try {
    // 优先使用OpenWeather API (Current Weather API 2.5 - 免费订阅包含)
    if (config.openweather && config.openweather.enabled && config.openweather.key) {
      try {
        const coords = getCityCoords(city);
        // 使用 Current Weather API 2.5（免费订阅已包含）
        // 注意：One Call API 3.0 需要单独订阅
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&lang=zh_cn&appid=${config.openweather.key}`;
        const response = await axios.get(url, { timeout: 15000 });
        
        if (response.data && response.data.main) {
          return {
            source: 'openweather',
            data: response.data,
            city: city
          };
        }
      } catch (owError) {
        console.log('OpenWeather API 失败:', owError.message);
      }
    }
    
    // 备用：使用和风天气API
    if (config.qweather && config.qweather.enabled && config.qweather.key) {
      const cityId = getCityId(city);
      const url = `https://devapi.qweather.com/v7/weather/now?location=${cityId}&key=${config.qweather.key}`;
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data && response.data.code === '200') {
        return {
          source: 'qweather',
          data: response.data.now,
          city: city
        };
      }
    }
    
    // 最后备用：使用wttr.in
    const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { timeout: 10000 });
    return {
      source: 'wttr',
      data: response.data
    };
  } catch (error) {
    console.error('获取天气失败:', error.message);
    return null;
  }
}

/**
 * 获取未来3天天气预报
 */
async function getWeatherForecast(city = '深圳') {
  try {
    if (config.qweather && config.qweather.enabled && config.qweather.key) {
      const cityId = getCityId(city);
      const url = `https://devapi.qweather.com/v7/weather/3d?location=${cityId}&key=${config.qweather.key}`;
      const response = await axios.get(url, { timeout: 10000 });
      
      if (response.data && response.data.code === '200') {
        return {
          source: 'qweather',
          daily: response.data.daily,
          city: city
        };
      }
    }
    return null;
  } catch (error) {
    console.error('获取天气预报失败:', error.message);
    return null;
  }
}

/**
 * 获取穿衣建议
 */
function getClothingAdvice(temp, condition) {
  let advice = [];
  
  // 根据温度建议
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
  
  // 根据天气状况建议
  if (condition.includes('雨') || condition.includes('雷')) {
    advice.push('有降雨，记得带伞');
    advice.push('穿防水鞋子');
  } else if (condition.includes('雪')) {
    advice.push('有降雪，注意防滑');
    advice.push('穿防水防滑的鞋子');
  } else if (condition.includes('阴') || condition.includes('云')) {
    advice.push('多云天气，温度适中');
  } else if (condition.includes('晴') || condition.includes('Clear')) {
    advice.push('阳光充足，可戴墨镜和帽子');
    advice.push('注意防晒');
  }
  
  return advice;
}

/**
 * 格式化天气信息
 */
async function getFormattedWeatherInfo(city = '深圳') {
  const weather = await getWeather(city);
  
  if (!weather) {
    return {
      success: false,
      message: '无法获取天气信息'
    };
  }
  
  let temp, condition, humidity, windSpeed, feelsLike;
  
  if (weather.source === 'openweather') {
    // OpenWeather 数据格式
    const data = weather.data;
    if (data.current) {
      // One Call API 3.0 格式
      const current = data.current;
      temp = Math.round(current.temp);
      condition = current.weather[0] ? current.weather[0].description : '未知';
      humidity = current.humidity;
      windSpeed = current.wind_speed ? Math.round(current.wind_speed) : 0;
      feelsLike = Math.round(current.feels_like);
    } else {
      // Current Weather API 2.5 格式
      temp = Math.round(data.main.temp);
      condition = data.weather[0] ? data.weather[0].description : '未知';
      humidity = data.main.humidity;
      windSpeed = data.wind ? Math.round(data.wind.speed) : 0;
      feelsLike = Math.round(data.main.feels_like);
    }
  } else if (weather.source === 'qweather') {
    // 和风天气数据格式
    const data = weather.data;
    temp = parseInt(data.temp);
    condition = data.text;
    humidity = data.humidity;
    windSpeed = data.windScale;
    feelsLike = parseInt(data.feelsLike);
  } else {
    // wttr.in 数据格式
    const current = weather.data.current_condition[0];
    temp = parseInt(current.temp_C);
    condition = current.weatherDesc[0].value;
    humidity = current.humidity;
    windSpeed = current.windspeedKmph;
    feelsLike = parseInt(current.FeelsLikeC);
  }
  
  const clothingAdvice = getClothingAdvice(temp, condition);
  
  return {
    success: true,
    city: city,
    date: new Date().toLocaleDateString('zh-CN'),
    source: weather.source,
    weather: {
      temperature: temp,
      condition: condition,
      humidity: humidity,
      windSpeed: windSpeed,
      feelsLike: feelsLike
    },
    clothingAdvice: clothingAdvice
  };
}

/**
 * 获取今日天气（供外部调用）
 */
async function getTodayWeather(city = '深圳') {
  return await getFormattedWeatherInfo(city);
}

module.exports = {
  getWeather,
  getClothingAdvice,
  getFormattedWeatherInfo,
  getTodayWeather,
  getWeatherForecast
};
