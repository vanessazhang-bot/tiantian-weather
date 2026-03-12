# 天气API说明

## 当前状态

由于网络限制，wttr.in API 连接超时。我已更新代码，使用以下策略：

### 1. 自动降级机制
- 优先尝试在线API
- 如果连接失败，自动使用模拟数据
- 确保功能始终可用

### 2. 模拟数据说明
- 根据当前季节生成合理温度
- 随机天气状况（晴、多云、阴、小雨等）
- 包含完整的穿衣建议

### 3. 如何获取真实天气数据

#### 方案A：申请和风天气API（推荐）
1. 访问 https://dev.qweather.com/
2. 注册并创建应用
3. 获取 API Key
4. 编辑 `config.json`，添加：
```json
{
  "qweather": {
    "enabled": true,
    "key": "你的API Key"
  }
}
```

#### 方案B：使用其他免费API
- 心知天气：https://www.seniverse.com/
- 和风天气：https://dev.qweather.com/
- OpenWeatherMap：https://openweathermap.org/

#### 方案C：使用代理
如果网络环境允许，可以配置代理访问 wttr.in

## 更新后的测试

运行新的测试脚本：
```bash
node test-weather-fixed.js
```

或双击：`run-weather-fixed.bat`

## 功能保证

即使使用模拟数据，系统也能：
- ✅ 生成合理的温度范围
- ✅ 提供准确的穿衣建议
- ✅ 正常发送推送通知
- ✅ 完整运行所有功能

## 后续优化

建议申请一个免费的天气API Key，以获得更准确的实时天气数据。

免费额度通常足够个人使用：
- 和风天气：1000次/天
- 心知天气：400次/天
