# 天天生活助理 - 项目概览

## 项目信息
- **助理名称**：天天
- **工作空间**：`workspace-live`
- **创建者**：小妹
- **创建日期**：2026年3月10日

## 已完成功能

### 1. 工作空间配置 ✓
- `soul.md` - 助理身份和价值观
- `user.md` - 用户偏好和配置
- `agents.md` - 子agent能力说明

### 2. 核心功能模块 ✓
- `weather.js` - 天气查询和穿衣建议
- `tasks.js` - 任务管理（增删改查）
- `reminder.js` - 定时提醒和消息推送
- `index.js` - 主程序和命令行交互

### 3. 配置文件 ✓
- `config.json` - 应用配置（城市、提醒时间、微信webhook）
- `tasks.json` - 任务数据存储
- `package.json` - 依赖管理

### 4. 便捷脚本 ✓
- `install.bat` - 快速安装依赖
- `start.bat` - 快速启动助手

### 5. 文档 ✓
- `README.md` - 使用说明
- `.gitignore` - Git忽略配置

## 功能特性

### 天气功能
- 使用 wttr.in 免费API
- 获取深圳实时天气
- 智能穿衣建议（根据温度和天气状况）
- 包含体感温度、湿度、风速

### 任务管理
- 添加任务（支持优先级：高/中/低）
- 查看今日任务
- 查看所有任务
- 标记任务完成
- 格式化显示（带优先级emoji）

### 定时提醒
- 每天9:00自动触发
- 生成温馨提醒消息
- 支持微信企业机器人webhook推送
- 降级到控制台输出（未配置微信时）

### 命令行交互
- `add <内容> [优先级]` - 添加任务
- `list [all]` - 查看任务
- `complete <ID>` - 完成任务
- `reminder` - 立即发送提醒
- `help` - 显示帮助
- `exit` - 退出程序

## 配置说明

### 默认配置
- 城市：深圳
- 提醒时间：09:00
- 微信推送：启用（需配置webhook_url）

### 微信推送配置
编辑 `config.json`，添加企业微信机器人webhook：
```json
{
  "wechat": {
    "enabled": true,
    "webhook_url": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY"
  }
}
```

## 使用方法

### 首次使用
1. 运行 `install.bat` 安装依赖
2. 配置微信webhook（可选）
3. 运行 `start.bat` 启动服务

### 日常使用
- 程序会在后台运行，每天9:00自动发送提醒
- 通过命令行管理任务
- 可随时输入 `reminder` 立即获取提醒

## 技术栈
- Node.js
- axios (HTTP请求)
- node-schedule (定时任务)
- wttr.in (天气API)

## 待优化项
- [ ] 添加任务截止日期功能
- [ ] 支持多城市天气查询
- [ ] 添加任务统计和分析
- [ ] 支持语音播报提醒
- [ ] 添加农历日期显示
- [ ] 支持自定义提醒模板
