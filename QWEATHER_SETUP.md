# 和风天气配置指南

## 配置步骤

### 1. 注册和风天气账号

访问：https://dev.qweather.com/

点击右上角"注册"，使用邮箱或手机号注册。

### 2. 创建应用获取API Key

1. 登录后进入控制台
2. 点击"创建应用"
3. 选择"免费订阅"（Free Subscription）
4. 填写应用名称（如：天天助手）
5. 创建成功后，复制 **API Key**

### 3. 编辑配置文件

打开 `config.json` 文件，添加和风天气配置：

```json
{
  "city": "深圳",
  "reminder_time": "09:00",
  "qweather": {
    "enabled": true,
    "key": "这里填写你的API Key"
  },
  "pushdeer": {
    "enabled": false,
    "pushkey": ""
  },
  "bark": {
    "enabled": false,
    "deviceKey": ""
  },
  "serverchan": {
    "enabled": false,
    "sendkey": ""
  },
  "telegram": {
    "enabled": false,
    "botToken": "",
    "chatId": ""
  }
}
```

### 4. 测试配置

运行测试脚本：

```bash
node test-qweather.js
```

或双击：`run-qweather-test.bat`

## 完整配置示例

假设你的API Key是：`a1b2c3d4e5f6789012345678`

```json
{
  "city": "深圳",
  "reminder_time": "09:00",
  "qweather": {
    "enabled": true,
    "key": "a1b2c3d4e5f6789012345678"
  },
  "pushdeer": {
    "enabled": false,
    "pushkey": ""
  },
  "bark": {
    "enabled": false,
    "deviceKey": ""
  },
  "serverchan": {
    "enabled": false,
    "sendkey": ""
  },
  "telegram": {
    "enabled": false,
    "botToken": "",
    "chatId": ""
  }
}
```

## 免费额度说明

- **每日限额**：1000次/天
- **每次查询**：获取实时天气 + 3天预报 = 2次请求
- **每日可查询**：约500次（完全够用）

## 支持的城市

默认支持以下城市（使用城市名称）：
- 深圳、北京、上海、广州
- 杭州、南京、成都、武汉
- 西安、重庆、天津、苏州
- 厦门

如需其他城市，请告诉我，我可以添加对应的城市ID。

## 故障排查

### 提示 "API Key 不正确"
- 检查config.json中的key是否正确复制
- 确认没有多余的空格

### 提示 "网络连接问题"
- 检查网络连接
- 确认可以访问 devapi.qweather.com

### 提示 "免费额度已用完"
- 等待第二天额度重置
- 或考虑升级付费套餐

## 下一步

配置完成后：
1. 运行 `node test-qweather.js` 测试天气功能
2. 配置推送服务（查看 NOTIFICATION_GUIDE.md）
3. 运行 `node index.js` 启动完整服务
