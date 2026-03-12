# 天天助手 - 测试指南

## 测试明天天气推送

### 方法1：使用批处理文件（推荐）

双击运行 `run-tomorrow-test.bat`，它会：
1. 检查 Node.js 是否安装
2. 检查并安装依赖
3. 运行测试脚本

### 方法2：使用命令行

```bash
cd c:\Users\Zhang Jiayan\WorkBuddy\Claw\workspace-live
npm install
node test-tomorrow.js
```

## 测试脚本说明

### test-tomorrow.js
- 获取明天的天气预报
- 显示温度范围（最高/最低）
- 生成穿衣建议
- 尝试发送微信推送（如已配置）

### test.js
- 获取当前天气
- 测试基本的天气查询功能

## 输出示例

成功运行后，会显示类似以下信息：

```
====================================
   天天助手 - 明天天气测试
====================================

🌅 明天天气预报

📅 日期：2026-03-11
🌤️ 城市：深圳
🌡️ 温度范围：18°C ~ 25°C
📊 平均温度：22°C
☁️ 天气状况：Partly cloudy
💧 湿度：65%
💨 最大风速：15 km/h

👕 明天穿衣建议：
   • 天气舒适，建议穿长袖或薄外套

💪 预祝明天一切顺利！

====================================

✅ 微信推送发送成功
测试完成！
```

## 配置微信推送

如需启用微信推送，编辑 `config.json`：

```json
{
  "wechat": {
    "enabled": true,
    "webhook_url": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY"
  }
}
```

### 获取企业微信 Webhook

1. 在企业微信群中添加机器人
2. 获取 Webhook 地址
3. 将地址填入 `config.json` 的 `webhook_url` 字段

## 其他测试

### 测试当前天气
```bash
node test.js
```

### 启动完整服务
```bash
node index.js
```

### 添加测试任务
```bash
# 在 index.js 运行后输入
add 明天开会 high
add 完成报告 medium
```

## 故障排查

### 提示 "node 不是内部或外部命令"
→ 需要安装 Node.js：https://nodejs.org/

### 提示 "Cannot find module 'axios'"
→ 运行 `npm install` 安装依赖

### 天气查询失败
→ 检查网络连接，wttr.in 需要联网

### 微信推送失败
→ 检查 webhook_url 是否正确配置
