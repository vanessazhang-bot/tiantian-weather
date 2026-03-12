# 🌤️ 天天天气助手

一个灵活、可定制的天气推送助手，支持多用户管理、个性化消息定制。

## ✨ 功能特点

- 🎯 **多用户管理** - 支持动态添加、删除、编辑推送对象
- 🎨 **个性化定制** - 每个用户可以定制专属的消息风格、语录类型
- 📍 **智能定位** - 支持IP自动定位，出差旅行也能精准推送
- 💬 **丰富语录库** - 励志语录、情话、搞笑、自定义四种类型
- ⏰ **定时推送** - 支持GitHub Actions云端定时推送，电脑关机也能工作
- 🔧 **命令行工具** - 友好的交互式管理界面

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置API密钥

复制配置模板：
```bash
cp config.example.json config.json
```

编辑 `config.json`，填入你的OpenWeather API Key：
```json
{
  "openweather": {
    "enabled": true,
    "key": "YOUR_OPENWEATHER_API_KEY"
  }
}
```

**获取OpenWeather API Key:**
1. 访问 https://openweathermap.org/api
2. 注册账号
3. 在API Keys页面获取密钥
4. 免费版支持每日1000次调用

### 3. 添加推送用户

运行命令行管理工具：
```bash
node cli.js
```

或者使用快速命令：
```bash
# 查看所有用户
node userManager.js list

# 交互式添加用户
node userManager.js add

# 删除用户
node userManager.js remove <用户ID>
```

### 4. 测试推送

```bash
# 推送给所有用户
node multi-weather.js

# 推送给指定用户
node multi-weather.js user_001
```

## 📖 使用指南

### 添加新用户

#### 方法一：使用交互式CLI（推荐）

```bash
node cli.js
```

选择"添加新用户"，按照提示输入：
- 用户名称
- PushDeer Key
- 城市（或使用IP自动定位）
- 语录类型
- 消息风格

#### 方法二：直接编辑配置文件

编辑 `users.json`：

```json
{
  "users": [
    {
      "id": "user_001",
      "name": "宝宝",
      "pushkey": "PDU39795T...",
      "city": "深圳",
      "useIP": true,
      "messageStyle": {
        "titleTemplate": "🌤️ 宝，今天天气来啦～",
        "quoteType": "inspirational",
        "quoteTitle": "🍵 喝点毒鸡汤",
        "tone": "playful"
      },
      "enabled": true
    }
  ]
}
```

### 个性化定制选项

#### 📝 消息风格 (messageStyle)

| 参数 | 说明 | 可选值 |
|------|------|--------|
| titleTemplate | 消息标题模板，支持 `{name}` 占位符 | 自定义文本 |
| quoteType | 语录类型 | `inspirational`, `love`, `funny`, `custom` |
| quoteTitle | 语录标题 | 自定义文本 |
| tone | 语气风格 | `friendly`, `sweet`, `playful`, `professional` |
| showWeatherDetails | 显示天气详情 | `true` / `false` |
| showClothingAdvice | 显示穿衣建议 | `true` / `false` |
| showTravelTips | 显示出行建议 | `true` / `false` |

#### 💬 语录类型 (quoteType)

1. **inspirational** - 励志语录
   - "今天的努力，是幸运的伏笔。"
   - "你比你想象的更强大。"
   
2. **love** - 情话
   - "今天也想见到你，谁也别想拦着。"
   - "你是我所有的少女情怀和心之所向。"
   
3. **funny** - 搞笑
   - "今天不想上班，只想被你念叨。"
   
4. **custom** - 自定义语录
   - 在 `users.json` 的 `quotes.custom` 数组中添加

#### 🎭 语气风格 (tone)

- **friendly** - 友好亲切："💕 加油哦～"
- **sweet** - 甜蜜温柔："💕 爱你哟～"
- **playful** - 活泼俏皮："🎉 今天也要元气满满！"
- **professional** - 专业正式："祝工作顺利！"

### 城市定位

#### 固定城市
```json
{
  "city": "深圳",
  "useIP": false
}
```

#### IP自动定位
```json
{
  "useIP": true
}
```

支持的城市：深圳、北京、上海、广州、杭州、成都、武汉、西安、南京、重庆、天津、苏州、厦门、青岛、大连等。

## 🌐 云端部署（GitHub Actions）

### 1. 创建GitHub仓库

访问 https://github.com/new 创建新仓库

### 2. 推送代码

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 3. 配置GitHub Secrets

进入仓库 Settings → Secrets and variables → Actions，添加：

- `OPENWEATHER_KEY` - OpenWeather API Key
- `MY_PUSHKEY` - 你的PushDeer Key（示例）
- 其他用户的key按需添加

**注意：** 为了安全，建议为每个用户创建单独的Secret，然后在workflow中引用。

### 4. 自定义Workflow

编辑 `.github/workflows/weather-push.yml`：

```yaml
- name: Create users config
  run: |
    cat > users.json << 'EOF'
    {
      "users": [
        {
          "id": "user_001",
          "name": "宝宝",
          "pushkey": "${{ secrets.USER1_PUSHKEY }}",
          "messageStyle": {
            "quoteType": "inspirational"
          }
        },
        {
          "id": "user_002", 
          "name": "黄sir",
          "pushkey": "${{ secrets.USER2_PUSHKEY }}",
          "messageStyle": {
            "quoteType": "love"
          }
        }
      ],
      "quotes": { ... }
    }
    EOF
```

### 5. 定时推送时间

修改workflow中的cron表达式：
```yaml
on:
  schedule:
    - cron: '30 0 * * *'  # UTC 0:30 = 北京时间 8:30
```

常用时间对照表：
- `0 1 * * *` - 北京时间 9:00
- `30 1 * * *` - 北京时间 9:30
- `0 2 * * *` - 北京时间 10:00

### 6. 手动测试

进入 Actions → Daily Weather Push → Run workflow

## 📱 获取PushDeer Key

### iOS用户
1. App Store下载 PushDeer
2. 注册登录
3. 在"设备"页面获取PushKey

### Android用户
1. 访问 https://www.pushdeer.com
2. 下载安装包
3. 注册登录获取PushKey

### 微信小程序
1. 微信搜索"PushDeer"
2. 登录获取PushKey

## 🛠️ 常用命令

```bash
# 启动交互式管理
node cli.js

# 查看用户列表
node userManager.js list

# 添加用户
node userManager.js add

# 删除用户
node userManager.js remove user_xxx

# 推送所有用户
node multi-weather.js

# 推送指定用户
node multi-weather.js user_xxx

# 本地定时任务
node local-scheduler.js
```

## 📁 项目结构

```
workspace-live/
├── cli.js                  # 命令行交互工具
├── userManager.js          # 用户管理器
├── multi-weather.js        # 多用户推送服务
├── messageBuilder.js       # 消息构建器
├── weather.js              # 天气API封装
├── location.js             # IP定位服务
├── notification.js         # 推送服务
├── users.json              # 用户配置（需要创建）
├── users.example.json      # 用户配置模板
├── config.json             # API配置
├── config.example.json     # API配置模板
├── local-scheduler.js      # 本地定时任务
└── .github/workflows/      # GitHub Actions配置
    └── weather-push.yml
```

## ❓ 常见问题

### 1. 为什么收不到推送？
- 检查PushDeer Key是否正确
- 确认用户状态是否启用 (`enabled: true`)
- 查看GitHub Actions日志确认执行状态

### 2. IP定位不准确？
- 使用固定城市配置
- 或在 `location.js` 中扩展城市映射

### 3. GitHub Actions失败？
- 检查GitHub Secrets是否正确配置
- 确认workflow文件格式正确
- 查看Actions日志排查错误

### 4. 如何添加更多语录？
编辑 `users.json`，在对应语录类型数组中添加：
```json
{
  "quotes": {
    "love": [
      "你的新情话",
      "另一句情话"
    ]
  }
}
```

### 5. 如何修改推送时间？
修改 `.github/workflows/weather-push.yml` 中的cron表达式。

## 📝 更新日志

### v2.0.0 (2026-03-12)
- ✨ 全新多用户管理系统
- ✨ 个性化消息定制功能
- ✨ 交互式命令行工具
- ✨ 四种语录类型支持
- 🎨 全新的消息模板系统
- 📖 完善的使用文档

### v1.0.0
- 基础天气推送功能
- PushDeer推送支持
- GitHub Actions定时任务

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

---

**🌤️ 天天天气助手 - 让每一天都充满温暖与关怀！**
