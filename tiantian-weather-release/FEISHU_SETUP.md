# 飞书推送配置指南

## 配置步骤

### 1. 创建飞书群机器人

1. 打开飞书，进入任意群聊
2. 点击群设置 → 群机器人 → 添加机器人
3. 选择"自定义机器人"
4. 设置机器人名称（如：天天助手）
5. 复制 **Webhook 地址**

### 2. 编辑配置文件

打开 `config.json`，添加飞书配置：

```json
{
  "feishu": {
    "enabled": true,
    "webhookUrl": "https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  }
}
```

### 3. 测试推送

运行测试脚本：
```bash
node test-feishu.js
```

## 完整配置示例

```json
{
  "city": "深圳",
  "reminder_time": "09:00",
  "notification": {
    "service": "feishu"
  },
  "qweather": {
    "enabled": true,
    "key": "你的和风天气API Key"
  },
  "feishu": {
    "enabled": true,
    "webhookUrl": "https://open.feishu.cn/open-apis/bot/v2/hook/abc123-def456-ghi789"
  },
  "pushdeer": {
    "enabled": false,
    "pushkey": ""
  }
}
```

## 获取 Webhook 地址

Webhook 地址格式：
```
https://open.feishu.cn/open-apis/bot/v2/hook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

复制完整的地址填入 `webhookUrl` 字段。

## 安全设置（可选）

如果启用了安全设置：
- **自定义关键词**：消息中必须包含关键词（如：天气、提醒）
- **IP白名单**：添加你的服务器IP
- **签名校验**：需要额外配置签名

## 测试消息

配置完成后，运行：
```bash
node test-feishu.js
```

会在飞书群中收到测试消息。

## 故障排查

### 提示 "飞书推送未配置"
- 检查 `enabled` 是否为 `true`
- 检查 `webhookUrl` 是否正确

### 提示 "token is invalid"
- Webhook 地址错误，重新复制
- 机器人被删除或禁用

### 提示 "request frequency limit"
- 触发频率限制，稍后再试
- 飞书限制：每个机器人每分钟最多20条

### 提示 "ip not in whitelist"
- 需要添加IP白名单
- 或关闭IP白名单限制

## 特点

- ✅ 免费使用
- ✅ 支持富文本卡片
- ✅ 支持@用户
- ✅ 稳定可靠
- ✅ 支持多种消息格式
