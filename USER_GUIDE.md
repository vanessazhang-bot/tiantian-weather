# 📖 用户配置完全指南

本文档详细介绍如何添加、管理推送用户，以及如何个性化定制推送内容。

## 🎯 目标读者

- 想要添加新推送对象的用户
- 想要个性化定制推送内容的用户
- 想要深入了解配置选项的用户

## 📋 目录

1. [快速添加用户](#快速添加用户)
2. [用户配置详解](#用户配置详解)
3. [个性化定制](#个性化定制)
4. [语录库管理](#语录库管理)
5. [实战案例](#实战案例)

---

## 快速添加用户

### 方法一：交互式CLI（推荐新手）

运行命令：
```bash
node cli.js
```

选择"2. 添加新用户"，按照提示依次输入：

```
👤 用户名称: 宝宝
🔑 PushDeer Key: PDU39795TSijic5tat748Cv1sb0aGqi8sNbnoqxWm
🏙️  城市: 深圳
📝 语录类型: 2 (情话)
📝 标题模板: 🌤️ 早安呀，{name}～
💬 语录标题: 💕 悄悄话
🎭 语气风格: 2 (甜蜜温柔)
```

### 方法二：命令行快速添加

```bash
node userManager.js add
```

### 方法三：直接编辑配置文件

编辑 `users.json`：

```json
{
  "users": [
    {
      "id": "user_001",
      "name": "宝宝",
      "pushkey": "PDU39795TSijic5tat748Cv1sb0aGqi8sNbnoqxWm",
      "city": "深圳",
      "useIP": false,
      "messageStyle": {
        "titleTemplate": "🌤️ 早安呀，{name}～",
        "quoteType": "love",
        "quoteTitle": "💕 悄悄话",
        "tone": "sweet"
      },
      "enabled": true
    }
  ]
}
```

---

## 用户配置详解

### 基础信息

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 自动 | 用户唯一标识，自动生成 |
| `name` | string | ✅ | 用户名称，会显示在消息中 |
| `pushkey` | string | ✅ | PushDeer推送密钥 |
| `city` | string | ❌ | 固定城市，如"深圳" |
| `useIP` | boolean | ❌ | 是否使用IP定位，默认true |
| `enabled` | boolean | ❌ | 是否启用推送，默认true |

### 定位方式

#### 1. 固定城市
```json
{
  "city": "深圳",
  "useIP": false
}
```

#### 2. IP自动定位
```json
{
  "useIP": true
}
```

**支持的城市：**
深圳、北京、上海、广州、杭州、成都、武汉、西安、南京、重庆、天津、苏州、厦门、青岛、大连、长沙、郑州、宁波、东莞、沈阳

**IP定位原理：**
- 调用 ipapi.co 获取公网IP的地理位置
- 将英文城市名映射为中文
- 如果定位失败或不支持该城市，自动回退到默认城市

---

## 个性化定制

### messageStyle 配置项

#### 1. titleTemplate - 消息标题模板

**作用：** 自定义推送消息的标题

**支持占位符：**
- `{name}` - 自动替换为用户名称

**示例：**
```json
{
  "titleTemplate": "🌤️ 早安呀，{name}～"
}
```

**效果：**
```
🌤️ 早安呀，宝宝～
```

**常用模板：**
```
🌤️ 宝，今天天气来啦～
🌤️ {name}，新的一天开始啦！
☀️ 早安，{name}～
```

#### 2. quoteType - 语录类型

**作用：** 决定推送什么类型的语录

**可选值：**

| 值 | 说明 | 示例 |
|----|----|------|
| `inspirational` | 励志语录 | "今天的努力，是幸运的伏笔。" |
| `love` | 情话 | "你是我所有的少女情怀和心之所向。" |
| `funny` | 搞笑 | "今天不想上班，只想被你念叨。" |
| `custom` | 自定义 | 你自己添加的语录 |

**配置示例：**
```json
{
  "quoteType": "love"
}
```

#### 3. quoteTitle - 语录标题

**作用：** 语录部分的标题

**示例：**
```json
{
  "quoteTitle": "🍵 喝点毒鸡汤"
}
```

**效果：**
```
🍵 喝点毒鸡汤
「今天的努力，是幸运的伏笔。」
```

**常用标题：**
```
🍵 今日寄语
💕 悄悄话
💫 今日心语
🎯 今日目标
☕ 早安心语
```

#### 4. tone - 语气风格

**作用：** 决定消息结尾的语气

**可选值：**

| 值 | 风格 | 示例结尾 |
|----|------|---------|
| `friendly` | 友好亲切 | 💕 加油哦～ |
| `sweet` | 甜蜜温柔 | 😘 么么哒～ |
| `playful` | 活泼俏皮 | 🎉 今天也要元气满满！ |
| `professional` | 专业正式 | 祝工作顺利！ |

**配置示例：**
```json
{
  "tone": "sweet"
}
```

#### 5. 内容显示控制

```json
{
  "showWeatherDetails": true,   // 显示天气详情
  "showClothingAdvice": true,   // 显示穿衣建议
  "showTravelTips": true        // 显示出行建议
}
```

设置为 `false` 可以隐藏对应板块。

---

## 语录库管理

### 查看现有语录

**方法一：CLI工具**
```bash
node cli.js
# 选择 "6. 管理语录库" → "1. 查看所有语录"
```

**方法二：查看配置文件**
打开 `users.json`，查看 `quotes` 部分。

### 添加自定义语录

**方法一：CLI添加**
```bash
node cli.js
# 选择 "6. 管理语录库" → "2. 添加语录"
```

**方法二：直接编辑配置文件**
```json
{
  "quotes": {
    "custom": [
      "这是我自定义的第一句话",
      "这是我自定义的第二句话",
      "继续添加更多..."
    ]
  }
}
```

### 扩展内置语录

```json
{
  "quotes": {
    "inspirational": [
      "今天的努力，是幸运的伏笔。",
      "你比你想象的更强大。",
      "添加你喜欢的励志语录..."
    ],
    "love": [
      "今天也想见到你，谁也别想拦着。",
      "添加你喜欢的情话..."
    ],
    "funny": [
      "今天不想上班，只想被你念叨。",
      "添加搞笑语录..."
    ]
  }
}
```

---

## 实战案例

### 案例1：给伴侣推送情话

**需求：**
- 名称：黄sir
- 城市：深圳（固定）
- 语录：情话
- 语气：甜蜜

**配置：**
```json
{
  "id": "user_002",
  "name": "黄sir",
  "pushkey": "PDU39813TTmaIqHJB5wSpFJcnsWGhDny9EcEZFYCP",
  "city": "深圳",
  "useIP": false,
  "messageStyle": {
    "titleTemplate": "🌤️ 早安呀，{name}～",
    "quoteType": "love",
    "quoteTitle": "💕 悄悄话",
    "tone": "sweet",
    "showWeatherDetails": true,
    "showClothingAdvice": true,
    "showTravelTips": true
  },
  "enabled": true
}
```

**推送效果：**
```
🌤️ 早安呀，黄sir～

📍 深圳 · 3月12日 周三

🌡️ 气温 22°C，多云～

─────────────────

👗 今天穿啥：
  建议穿长袖衬衫或薄外套
  早晚温差大，注意保暖

🚗 出行小贴士：
  今天适合出门溜达，记得带好心情！

─────────────────

💕 悄悄话
「你是我所有的少女情怀和心之所向。」

😘 么么哒～
```

### 案例2：给自己推送励志语录

**需求：**
- 名称：宝宝
- 城市：自动定位（经常出差）
- 语录：励志
- 语气：活泼
- 标题：喝点毒鸡汤（但内容是正能量）

**配置：**
```json
{
  "id": "user_001",
  "name": "宝宝",
  "pushkey": "PDU39795TSijic5tat748Cv1sb0aGqi8sNbnoqxWm",
  "useIP": true,
  "messageStyle": {
    "titleTemplate": "🌤️ 宝，今天天气来啦～",
    "quoteType": "inspirational",
    "quoteTitle": "🍵 喝点毒鸡汤",
    "tone": "playful"
  },
  "enabled": true
}
```

### 案例3：给同事推送工作日提醒

**需求：**
- 名称：同事小王
- 城市：北京
- 语录：自定义（工作相关）
- 语气：专业
- 只显示天气和语录

**配置：**
```json
{
  "name": "同事小王",
  "pushkey": "PDU...",
  "city": "北京",
  "messageStyle": {
    "titleTemplate": "☀️ 早安，{name}",
    "quoteType": "custom",
    "quoteTitle": "🎯 今日提醒",
    "tone": "professional",
    "showWeatherDetails": true,
    "showClothingAdvice": false,
    "showTravelTips": false
  },
  "quotes": {
    "custom": [
      "今天有3个会议，记得准备材料。",
      "下午4点提交周报。",
      "本周目标：完成项目原型设计。"
    ]
  }
}
```

### 案例4：给朋友推送搞笑内容

**需求：**
- 名称：闺蜜
- 城市：广州
- 语录：搞笑
- 语气：俏皮

**配置：**
```json
{
  "name": "闺蜜",
  "pushkey": "PDU...",
  "city": "广州",
  "messageStyle": {
    "titleTemplate": "🎉 {name}，新的一天！",
    "quoteType": "funny",
    "quoteTitle": "😄 今日快乐源泉",
    "tone": "playful"
  }
}
```

---

## 高级技巧

### 1. 使用占位符

在标题模板中使用 `{name}` 会自动替换：

```json
{
  "name": "黄sir",
  "messageStyle": {
    "titleTemplate": "🌤️ 早安呀，{name}～"
  }
}
```

效果：`🌤️ 早安呀，黄sir～`

### 2. 动态语录

结合多种语录类型，每天不同内容：

```json
{
  "messageStyle": {
    "quoteType": "love"
  },
  "quotes": {
    "love": [
      "周一：新的一周，想你开始。",
      "周二：今天是表白日。",
      "周三：周中想念加倍。",
      "周四：期待周末和你见面。",
      "周五：明天就可以见到你了！",
      "周六：周末快乐，我的宝贝。",
      "周日：明天又是新的一周，继续爱你。"
    ]
  }
}
```

### 3. 临时禁用用户

不想删除，只是暂时停用：

```json
{
  "enabled": false
}
```

### 4. 差异化推送时间

虽然GitHub Actions是统一触发，但可以在代码中控制：

```javascript
// 在 multi-weather.js 中添加
const hour = new Date().getHours();
if (user.schedule.time === '09:00' && hour !== 9) {
  console.log(`跳过用户 ${user.name}，推送时间为 ${user.schedule.time}`);
  return;
}
```

---

## 常见问题

### Q: 修改配置后需要重启吗？
**A:** 本地运行时需要重新运行脚本。GitHub Actions会自动读取最新配置。

### Q: 可以给同一个人设置多个推送时间吗？
**A:** 可以添加多个用户配置，使用相同的pushkey，不同的推送内容。

### Q: IP定位不准怎么办？
**A:** 设置 `"useIP": false`，使用固定城市。

### Q: 如何批量导入用户？
**A:** 直接编辑 `users.json`，复制粘贴用户配置块。

### Q: 语录可以添加多少条？
**A:** 没有限制，建议每种类型10-20条，避免重复。

---

## 小结

1. **添加用户** - 使用 `node cli.js` 或直接编辑配置文件
2. **个性化定制** - 通过 `messageStyle` 控制消息风格
3. **语录管理** - 四种类型 + 自定义语录库
4. **城市定位** - 固定城市或IP自动定位
5. **测试推送** - 使用 `node multi-weather.js` 立即测试

**祝你使用愉快！如有问题，欢迎查看 README.md 或提交 Issue。** 🎉
