# 📦 项目更新说明

## v2.0.0 全新升级！ (2026-03-12)

### 🎉 重磅新功能

#### 1. 多用户管理系统
- ✨ 支持动态添加、删除、编辑推送对象
- ✨ 每个用户独立配置，互不影响
- ✨ 用户状态管理（启用/禁用）

#### 2. 个性化消息定制
- ✨ 自定义消息标题（支持 `{name}` 占位符）
- ✨ 四种语录类型：励志、情话、搞笑、自定义
- ✨ 四种语气风格：友好、甜蜜、俏皮、专业
- ✨ 灵活控制显示内容（天气、穿衣、出行建议）

#### 3. 交互式管理工具
- ✨ 友好的命令行界面（CLI）
- ✨ 菜单式操作，无需手动编辑配置文件
- ✨ 实时预览和测试

#### 4. 语录库系统
- ✨ 内置励志语录、情话、搞笑语录
- ✨ 支持自定义语录扩展
- ✨ 随机抽取，每天不同内容

### 📁 新增文件

```
workspace-live/
├── userManager.js          # 用户管理器（新增）
├── messageBuilder.js       # 消息构建器（新增）
├── multi-weather.js        # 多用户推送服务（新增）
├── cli.js                  # 命令行交互工具（新增）
├── users.json              # 用户配置文件（新增）
├── users.example.json      # 用户配置模板（新增）
├── manage.bat              # Windows快速启动脚本（新增）
├── README.md               # 项目文档（更新）
├── USER_GUIDE.md           # 用户配置完全指南（新增）
├── QUICK_START.md          # 快速开始指南（新增）
└── GITHUB_SECRETS_GUIDE.md # GitHub Secrets配置指南（新增）
```

### 🔄 配置文件变化

#### 旧版本（v1.x）
- 使用 `config.json` 存储所有配置
- 固定的双人推送配置
- 无法动态添加用户

#### 新版本（v2.0）
- `config.json` - 仅存储API密钥
- `users.json` - 用户配置和语录库
- 支持无限用户
- 每个用户独立配置

### 📖 迁移指南

如果你从 v1.x 升级到 v2.0：

#### 1. 备份旧配置
```bash
cp config.json config.json.backup
```

#### 2. 安装新版本
```bash
npm install
```

#### 3. 迁移用户配置

将旧的 `couple` 配置迁移到 `users.json`：

**旧配置（config.json）：**
```json
{
  "couple": {
    "my_pushkey": "PDU...",
    "partner_name": "黄sir",
    "partner_pushkey": "PDU..."
  }
}
```

**新配置（users.json）：**
```json
{
  "users": [
    {
      "name": "宝宝",
      "pushkey": "PDU...",
      "messageStyle": {
        "quoteType": "inspirational"
      }
    },
    {
      "name": "黄sir",
      "pushkey": "PDU...",
      "messageStyle": {
        "quoteType": "love"
      }
    }
  ]
}
```

#### 4. 测试新系统
```bash
node multi-weather.js
```

### 🛠️ 命令变化

| 旧命令 | 新命令 | 说明 |
|--------|--------|------|
| `node couple-weather.js` | `node multi-weather.js` | 推送天气 |
| - | `node cli.js` | 启动管理面板 |
| - | `node userManager.js list` | 查看用户列表 |
| - | `node userManager.js add` | 添加用户 |

### 🌐 GitHub Actions 更新

workflow 文件已更新，使用新的多用户系统：

**旧版本：**
```yaml
- name: Push weather
  run: node couple-weather.js
```

**新版本：**
```yaml
- name: Push weather to all users
  run: node multi-weather.js
```

### 📚 文档更新

- ✅ README.md - 更新为完整项目文档
- ✅ USER_GUIDE.md - 新增用户配置完全指南
- ✅ QUICK_START.md - 新增快速开始指南
- ✅ GITHUB_SECRETS_GUIDE.md - 新增GitHub Secrets配置指南

### 🎯 主要改进

#### 更灵活的配置
- 从固定双人模式升级到多用户模式
- 每个用户独立配置，互不干扰
- 支持无限添加推送对象

#### 更友好的界面
- 交互式命令行工具
- 菜单式操作，降低学习成本
- 实时反馈和错误提示

#### 更强大的定制
- 消息标题、语录类型、语气风格全面可定制
- 支持自定义语录库
- 内容板块灵活控制

#### 更完善的文档
- 从快速开始到完全指南，满足不同需求
- 详细的配置说明和实战案例
- 常见问题解答

### 🔮 未来计划

- [ ] 支持更多推送服务（Telegram、企业微信、钉钉）
- [ ] Web管理界面
- [ ] 天气预警推送
- [ ] 多城市天气对比
- [ ] 生日、纪念日提醒

### 💬 反馈建议

如有问题或建议，欢迎：
- 提交 Issue
- 发送反馈

---

**感谢使用天天天气助手！** 🌤️
