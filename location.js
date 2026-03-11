const axios = require('axios');

// 城市坐标映射（用于OpenWeather）
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
  '天津': { lat: 39.1252, lon: 117.1904 },
  '苏州': { lat: 31.2989, lon: 120.5853 },
  '长沙': { lat: 28.2280, lon: 112.9388 },
  '郑州': { lat: 34.7466, lon: 113.6253 },
  '青岛': { lat: 36.0671, lon: 120.3826 }
};

// 英文城市名映射到中文
const CITY_NAME_MAP = {
  'Beijing': '北京',
  'Shanghai': '上海',
  'Guangzhou': '广州',
  'Shenzhen': '深圳',
  'Hangzhou': '杭州',
  'Chengdu': '成都',
  'Wuhan': '武汉',
  'Xi\'an': '西安',
  'Chongqing': '重庆',
  'Nanjing': '南京',
  'Tianjin': '天津',
  'Suzhou': '苏州',
  'Changsha': '长沙',
  'Zhengzhou': '郑州',
  'Qingdao': '青岛'
};

/**
 * 通过IP获取当前城市
 */
async function getCityByIP() {
  try {
    const response = await axios.get('https://ipapi.co/json/', { timeout: 10000 });
    const cityEn = response.data.city;
    console.log(`📍 IP定位城市(英文): ${cityEn}`);
    
    // 转换为中文城市名
    const cityCn = CITY_NAME_MAP[cityEn] || cityEn;
    console.log(`📍 IP定位城市(中文): ${cityCn}`);
    
    return cityCn;
  } catch (error) {
    console.error('IP定位失败:', error.message);
    return null;
  }
}

/**
 * 获取城市坐标
 */
function getCityCoords(city) {
  // 尝试匹配城市名
  for (const [name, coords] of Object.entries(CITY_COORDS)) {
    if (city.includes(name)) {
      return coords;
    }
  }
  // 默认深圳
  return { lat: 22.5431, lon: 114.0579 };
}

/**
 * 检查城市是否在支持列表中
 */
function isCitySupported(city) {
  for (const name of Object.keys(CITY_COORDS)) {
    if (city.includes(name)) {
      return true;
    }
  }
  return false;
}

module.exports = {
  getCityByIP,
  getCityCoords,
  isCitySupported,
  CITY_COORDS
};
