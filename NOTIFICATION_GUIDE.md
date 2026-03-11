# 天天助手 - 推送服务配置指南

## 🎯 推荐的推送服务

### 1. PushDeer（最推荐）⭐⭐⭐⭐⭐

**适用平台**：iOS、Android、Mac

**优点**：
- 完全免费
- 无需企业账号
- iOS扫码即用（无需下载APP）
- 支持多设备
- 自建版开源可控

**配置步骤**：

1. **iOS 用户**：
   - 用相机扫描官方二维码或访问：https://www.pushdeer.com
   - 在App Store搜索"PushDeer"并安装
   - 登录后进入"Key"标签页，创建一个Key
   - 复制PushKey

2. **Android 用户**：
   - 下载 PushDeer 客户端（GitHub或Gitee）
   - 登录后创建Key

3. **配置天天助手**：
   编辑 `config.json`：
   ```json
   {
     "pushdeer": {
       "enabled": true,
       "pushkey": "你的PushKey"
     }
   }
   ```

---

### 2. Server酱 ⭐⭐⭐⭐

**适用平台**：微信公众号

**优点**：
- 通过微信公众号接收
- 配置简单
- 免费版本够用

**配置步骤**：

1. 访问官网：https://sct.ftqq.com
2. 微信扫码登录
3. 点击"发送Key"获取SendKey
4. 编辑 `config.json`：
   ```json
   {
     "serverchan": {
       "enabled": true,
       "sendkey": "你的SendKey"
     }
   }
   ```

---

### 3. Bark ⭐⭐⭐⭐

**适用平台**：iOS 专用

**优点**：
- iOS原生体验
- 速度快
- 可自定义声音

**配置步骤**：

1. 在App Store下载"Bark"
2. 打开应用会自动生成设备Key
3. 编辑 `config.json`：
   ```json
   {
     "bark": {
       "enabled": true,
       "deviceKey": "你的设备Key"
     }
   }
   ```

---

### 4. Telegram ⭐⭐⭐

**适用平台**：全球通用

**优点**：
- 国际通用
- 无限制
- 支持富文本

**配置步骤**：

1. 在Telegram中搜索 @BotFather
2. 发送 `/newbot` 创建机器人
3. 获取Bot Token
4. 搜索你的机器人并发送一条消息
5. 访问 `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates` 获取chat_id
6. 编辑 `config.json`：
   ```json
   {
     "telegram": {
       "enabled": true,
       "botToken": "你的Bot Token",
       "chatId": "你的Chat ID"
     }
   }
   ```

---

## 🎨 多服务配置

您可以同时配置多个推送服务，系统会按优先级依次尝试：

```json
{
  "pushdeer": {
    "enabled": true,
    "pushkey": "你的PushKey"
  },
  "serverchan": {
    "enabled": true,
    "sendkey": "你的SendKey"
  },
  "telegram": {
    "enabled": true,
    "botToken": "你的Bot Token",
    "chatId": "你的Chat ID"
  }
}
```

优先级顺序：PushDeer → Bark → Server酱 → Telegram → 控制台

---

## 📝 完整配置示例

```json
{
  "city": "深圳",
  "reminder_time": "09:00",
  "notification": {
    "service": "pushdeer"
  },
  "pushdeer": {
    "enabled": true,
    "pushkey": "PDU1234567890abcdefghijklmnopqrstuvwxyz"
  },
  "bark": {
    "enabled": false,
    "deviceKey": ""
  },
  "serverchan": {
    "enabled": false,
    "sendkey": "SCT1234567890abcdefghijklmnopqrstuvwxyz"
  },
  "telegram": {
    "enabled": false,
    "botToken": "",
    "chatId": ""
  }
}
```

---

## ✅ 测试推送配置

配置完成后，运行测试：

```bash
node test-tomorrow.js
```

如果配置正确，会在手机上收到推送通知！

---

## ❓ 常见问题

### Q: 哪个推送服务最简单？
A: PushDeer 最简单，iOS扫码即可，Android下载APP即可，无需注册企业账号。

### Q: 哪个推送服务最稳定？
A: PushDeer 和 Server酱 都很稳定，推荐优先使用 PushDeer。

### Q: 可以同时配置多个服务吗？
A: 可以，系统会按优先级依次尝试，第一个成功的就不会继续尝试。

### Q: 推送失败怎么办？
A: 系统会降级到控制台输出，您可以在命令行查看消息。

### Q: 如何关闭推送？
A: 将对应服务的 `enabled` 设为 `false` 即可。

---

## 🔧 高级选项

### 自建 PushDeer 服务

如果不想使用官方在线版，可以自建：

```bash
git clone https://github.com/easychen/pushdeer.git
cd pushdeer
docker-compose up -d
```

然后将 API 地址改为您的自建地址。

需要帮助？查看完整文档：`README.md`
