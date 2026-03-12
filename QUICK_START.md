# 🚀 快速开始指南

5分钟快速上手天天天气助手！

## 📋 准备工作

### 1. 获取必要的密钥

#### OpenWeather API Key
1. 访问 https://openweathermap.org/api
2. 注册账号（免费）
3. 在 API Keys 页面复制密钥

#### PushDeer Key
1. **iOS**: App Store 下载 PushDeer
2. **Android**: 访问 https://www.pushdeer.com 下载
3. **微信小程序**: 搜索"PushDeer"
4. 注册登录后，在"设备"页面获取 PushKey

### 2. 安装项目

```bash
# 克隆或下载项目
cd workspace-live

# 安装依赖
npm install
```

## ⚙️ 配置

### 第一步：配置API密钥

复制配置模板：
```bash
cp config.example.json config.json
```

编辑 `config.json`，填入你的 OpenWeather API Key：
```json
{
  "openweather": {
    "enabled": true,
    "key": "你的API_KEY"
  }
}
```

### 第二步：添加推送用户

**方法一：交互式工具（推荐）**
```bash
node cli.js
```
选择"2. 添加新用户"，按提示操作。

**方法二：直接编辑配置文件**
编辑 `users.json`：
```json
{
  "users": [
    {
      "name": "你的名字",
      "pushkey": "你的PushDeer Key",
      "messageStyle": {
        "quoteType": "inspirational"
      }
    }
  ]
}
```

### 第三步：测试推送

```bash
node multi-weather.js
```

打开你的 PushDeer App，应该能收到天气推送！

## 📱 添加更多用户

### 交互式添加
```bash
node cli.js
# 选择 "2. 添加新用户"
```

### 查看用户列表
```bash
node userManager.js list
```

### 删除用户
```bash
node userManager.js remove user_xxx
```

## 🌐 云端部署（可选）

如果想要每天自动推送（不需要电脑开机），可以部署到GitHub。

### 1. 创建GitHub仓库
访问 https://github.com/new

### 2. 推送代码
```bash
git init
git add .
git commit -m "初始化天气助手"
git remote add origin https://github.com/你的用户名/你的仓库.git
git push -u origin main
```

### 3. 配置Secrets
进入仓库 Settings → Secrets → Actions，添加：

- `OPENWEATHER_KEY` - API密钥
- `USER1_PUSHKEY` - 第1个用户的PushKey
- `USER2_PUSHKEY` - 第2个用户的PushKey（如需要）

### 4. 测试
进入 Actions → Daily Weather Push → Run workflow

详细步骤请查看 [GITHUB_SECRETS_GUIDE.md](GITHUB_SECRETS_GUIDE.md)

## 🎨 个性化定制

### 修改消息风格
编辑 `users.json`：

```json
{
  "messageStyle": {
    "titleTemplate": "🌤️ 早安，{name}～",
    "quoteType": "love",
    "quoteTitle": "💕 悄悄话",
    "tone": "sweet"
  }
}
```

### 语录类型
- `inspirational` - 励志语录
- `love` - 情话
- `funny` - 搞笑
- `custom` - 自定义

### 语气风格
- `friendly` - 友好亲切
- `sweet` - 甜蜜温柔
- `playful` - 活泼俏皮
- `professional` - 专业正式

详细配置请查看 [USER_GUIDE.md](USER_GUIDE.md)

## 🎯 常用命令

```bash
# 启动管理面板
node cli.js

# 查看用户列表
node userManager.js list

# 测试推送
node multi-weather.js

# 推送给指定用户
node multi-weather.js user_001
```

## 📚 进阶文档

- [README.md](README.md) - 完整项目文档
- [USER_GUIDE.md](USER_GUIDE.md) - 用户配置完全指南
- [GITHUB_SECRETS_GUIDE.md](GITHUB_SECRETS_GUIDE.md) - GitHub Secrets配置指南

## ❓ 常见问题

### Q: 收不到推送？
1. 检查 PushDeer Key 是否正确
2. 确认用户状态为启用（`enabled: true`）
3. 运行 `node multi-weather.js` 查看日志

### Q: IP定位不准？
设置固定城市：
```json
{
  "useIP": false,
  "city": "深圳"
}
```

### Q: 如何修改推送时间？
编辑 `.github/workflows/weather-push.yml` 中的 cron：
```yaml
- cron: '30 0 * * *'  # 北京时间 8:30
```

## 🎉 完成！

现在你可以：
- ✅ 接收每日天气推送
- ✅ 管理多个推送对象
- ✅ 个性化定制消息内容
- ✅ 云端自动推送

**享受你的智能天气助手吧！** 🌤️
