# 🌤️ 天天天气助手

你的专属天气生活小助手，每天自动推送天气+贴心提醒～

## ✨ 功能特点

- 🌤️ **智能天气** - 自动定位城市，推送实时天气
- 💕 **个性化内容** - 支持多人推送，内容可定制
- ⏰ **定时推送** - 每天早上8:30准时送达
- 📱 **多平台支持** - PushDeer推送，支持iOS/Android/Mac
- 🌍 **永远在线** - 云端部署，无需保持电脑开机
- 🎯 **多场景适用** - 情侣、家人、朋友，想推给谁就推给谁

## 🚀 快速开始

### 方式一：Vercel云端部署（推荐）

1. Fork本仓库
2. 注册 [Vercel](https://vercel.com) 账号
3. 导入项目并部署
4. 配置环境变量（见下方）
5. 完成！每天自动推送

### 方式二：本地运行

```bash
# 安装依赖
npm install

# 配置config.json
# 填写你的PushDeer key和另一半的信息

# 启动定时任务
node local-scheduler.js
```

## ⚙️ 配置说明

编辑 `config.json`：

```json
{
  "couple": {
    "enabled": true,
    "my_pushkey": "你的PushDeer key",
    "partner_name": "另一半的称呼",
    "partner_pushkey": "另一半的PushDeer key"
  },
  "openweather": {
    "enabled": true,
    "key": "你的OpenWeather API key"
  }
}
```

## 🔑 获取API Key

### PushDeer（推送服务）
1. 下载 [PushDeer App](https://www.pushdeer.com)
2. 注册并获取 PushKey
3. 填入配置文件

### OpenWeather（天气服务）
1. 访问 [OpenWeather](https://openweathermap.org)
2. 注册免费账号
3. 获取 API Key
4. 填入配置文件

## 📁 项目结构

```
.
├── api/
│   └── cron.js          # Vercel定时任务入口
├── couple-weather.js    # 情侣天气推送核心
├── weather.js           # 天气获取服务
├── location.js          # IP定位服务
├── notification.js      # 推送服务
├── config.json          # 配置文件
├── local-scheduler.js   # 本地定时任务
├── vercel.json          # Vercel配置
└── README.md            # 本文件
```

## 💡 使用提示

- 支持15个国内主要城市自动定位
- 天气信息包含穿衣建议、出行提醒
- 情话和激励语录每天随机轮换
- 推送时间可自定义修改

## 📝 License

MIT License

---

🌤️ 愿你的每一天都阳光明媚
