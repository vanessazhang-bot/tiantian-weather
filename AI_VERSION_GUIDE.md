# 🤖 AI智能天气推送版

使用LLM（大语言模型）自动生成个性化天气推送内容，无需手动配置语录库！

## ✨ 特点

- 🤖 **AI自动生成内容** - 根据天气和用户风格自动写消息
- 📝 **极简配置** - 只需配置4个参数
- 🎨 **风格自由描述** - 用自然语言描述想要的语气
- 🔄 **每天不重样** - AI每天生成不同的内容

## 📋 配置说明

### 1. 配置文件

复制模板文件：
```bash
cp simple-config.example.json simple-config.json
```

### 2. 填写配置

编辑 `simple-config.json`：

```json
{
  "openweather_key": "你的OpenWeather_API_Key",
  "ai": {
    "provider": "openai",
    "api_key": "你的AI_API_Key",
    "model": "gpt-3.5-turbo",
    "base_url": "https://api.openai.com/v1"
  },
  "users": [
    {
      "name": "宝宝",
      "pushkey": "你的PushDeer_Key",
      "style": "俏皮可爱的语气，带点毒鸡汤式的正能量",
      "extra": "加上今天的工作提醒"
    },
    {
      "name": "黄sir",
      "pushkey": "黄sir的PushDeer_Key",
      "style": "温柔甜蜜的情话风格",
      "extra": "适合情侣间的早安问候"
    }
  ]
}
```

### 3. 配置参数说明

| 参数 | 说明 | 示例 |
|------|------|------|
| `openweather_key` | OpenWeather API密钥 | `4b4c8346...` |
| `ai.api_key` | AI服务API密钥 | `sk-...` |
| `ai.model` | AI模型名称 | `gpt-3.5-turbo` |
| `ai.base_url` | AI服务地址 | `https://api.openai.com/v1` |
| `users[].name` | 用户名称 | `宝宝` |
| `users[].pushkey` | PushDeer Key | `PDU39795T...` |
| `users[].style` | 语气风格描述 | `俏皮可爱、温柔甜蜜` |
| `users[].extra` | 额外要求 | `加上情话、工作提醒` |

## 🤖 AI服务选择

### 选项1：OpenAI（官方）
```json
{
  "api_key": "sk-你的key",
  "model": "gpt-3.5-turbo",
  "base_url": "https://api.openai.com/v1"
}
```

### 选项2：国内代理（推荐）
```json
{
  "api_key": "你的key",
  "model": "gpt-3.5-turbo",
  "base_url": "https://api.xxx.com/v1"
}
```

### 选项3：其他AI服务
支持任何OpenAI兼容的API：
- Claude API
- 文心一言
- 通义千问
- 等等

## 🎨 Style风格示例

### 俏皮可爱风
```json
"style": "俏皮可爱的语气，像闺蜜聊天一样，偶尔带点吐槽但充满正能量"
```

### 温柔甜蜜风
```json
"style": "温柔甜蜜的情话风格，像恋人间的早安问候，充满爱意和关心"
```

### 幽默搞笑风
```json
"style": "幽默搞笑的风格，像段子手一样，让人看了会心一笑"
```

### 专业正式风
```json
"style": "专业正式的语气，像私人助理一样，简洁明了提供信息"
```

### 古风诗意风
```json
"style": "古风诗意的语气，引用古诗词，文艺优雅"
```

## 📝 Extra额外要求示例

```json
"extra": "加上穿衣建议、出行提醒，最后来一句激励的话"
```

```json
"extra": "加上一句情话，表达思念和关心"
```

```json
"extra": "提醒带伞、注意防晒、多喝水等实用建议"
```

```json
"extra": "加上今天的星座运势"
```

## 🚀 使用方法

### 本地测试
```bash
node ai-weather.js
```

### GitHub Actions自动推送

1. **配置Secrets**
   - `OPENWEATHER_KEY` - 天气API密钥
   - `AI_API_KEY` - AI服务密钥
   - `MY_PUSHKEY` - 你的PushKey
   - `PARTNER_PUSHKEY` - 伴侣的PushKey
   - `PARTNER_NAME` - 伴侣名字

2. **启用Workflow**
   - 进入 Actions → AI Weather Push
   - 点击 "Enable workflow"

3. **手动测试**
   - 点击 "Run workflow"

## 🔄 与原版对比

| 功能 | 原版 (v2.0) | AI版 |
|------|-------------|------|
| 配置复杂度 | 需要配置语录库、消息模板 | 只需描述风格 |
| 内容多样性 | 有限的语录池 | AI每天生成不同内容 |
| 个性化程度 | 预设模板 | 完全自定义描述 |
| 灵活性 | 需要修改配置文件 | 自然语言描述 |
| 依赖 | 无外部AI依赖 | 需要AI API |

## 💡 使用建议

### 适合AI版的场景
- ✅ 想要每天不同的内容
- ✅ 不想维护语录库
- ✅ 有AI API访问
- ✅ 喜欢尝试新鲜内容

### 适合原版的场景
- ✅ 想要完全控制内容
- ✅ 没有AI API
- ✅ 内容需要审核
- ✅ 追求稳定性

## ❓ 常见问题

### Q: AI生成失败怎么办？
A: 系统会自动降级为默认消息模板，确保推送不会中断。

### Q: 可以混合使用两个版本吗？
A: 可以！两个版本独立运行，互不影响。

### Q: AI版费用高吗？
A: GPT-3.5-turbo 很便宜，每天推送2个用户，一个月约几毛钱。

### Q: 如何切换回原版？
A: 在GitHub Actions中禁用 "AI Weather Push"，启用 "Daily Weather Push"。

## 🎉 快速开始

1. 复制 `simple-config.example.json` → `simple-config.json`
2. 填入你的API密钥
3. 描述你想要的风格
4. 运行 `node ai-weather.js` 测试
5. 推送到GitHub启用自动推送

**享受AI为你写的专属天气推送吧！** 🤖🌤️
