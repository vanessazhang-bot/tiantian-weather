# 🚀 部署指南

## 方式一：Vercel云端部署（推荐）

### 步骤1：准备工作

1. 注册账号：
   - [Vercel](https://vercel.com) - 用于托管和定时任务
   - [OpenWeather](https://openweathermap.org) - 获取天气API Key
   - [PushDeer](https://www.pushdeer.com) - 下载App获取推送Key

2. Fork本仓库到你的GitHub

### 步骤2：配置Vercel

1. 登录Vercel，点击 "Add New Project"
2. 导入你Fork的仓库
3. 配置环境变量：
   ```
   OPENWEATHER_KEY=你的OpenWeather API key
   MY_PUSHKEY=你的PushDeer key
   PARTNER_PUSHKEY=另一半的PushDeer key
   PARTNER_NAME=另一半的称呼
   ```

4. 点击 Deploy

### 步骤3：设置定时任务

1. 在Vercel控制台，进入项目设置
2. 找到 "Cron Jobs"
3. 添加定时任务：
   - URL: `/api/cron`
   - Schedule: `30 8 * * *` (每天8:30)

### 步骤4：完成！

每天8:30会自动推送天气给你们俩～

---

## 方式二：本地运行

适合测试或不想用云服务的用户。

### 安装

```bash
# 克隆仓库
git clone https://github.com/你的用户名/couple-weather.git
cd couple-weather

# 安装依赖
npm install

# 复制配置模板
cp config.example.json config.json

# 编辑配置
# 填入你的API key和推送key
```

### 启动

```bash
# 启动定时任务
node local-scheduler.js
```

保持窗口运行，每天8:30自动推送。

---

## 🔧 常见问题

### Q: 推送失败了怎么办？
A: 检查：
1. PushDeer key是否正确
2. OpenWeather API key是否激活
3. 查看Vercel日志排查错误

### Q: 可以修改推送时间吗？
A: 可以！修改 `vercel.json` 中的 `schedule` 字段：
```json
"schedule": "30 8 * * *"  // 每天8:30
"schedule": "0 9 * * *"   // 每天9:00
```

### Q: 支持其他城市吗？
A: 支持！目前支持15个主要城市自动定位：
北京、上海、广州、深圳、杭州、成都、武汉、西安、重庆、南京、天津、苏州、长沙、郑州、青岛

---

有问题请提Issue！💕
