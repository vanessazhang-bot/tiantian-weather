# 天天助手 - 快速开始指南

## 前置要求

- 已安装 Node.js (v14 或更高版本)

## 安装步骤

### 方法1：使用 PowerShell（推荐）

1. 右键点击 `install.ps1`，选择"使用 PowerShell 运行"
2. 等待依赖安装完成

### 方法2：手动安装

打开命令行（CMD 或 PowerShell），执行：

```bash
cd c:\Users\Zhang Jiayan\WorkBuddy\Claw\workspace-live
npm install
```

## 运行测试

安装完成后，运行测试脚本验证功能：

```bash
node test.js
```

这会测试天气查询功能是否正常工作。

## 启动助手

### 方法1：使用 PowerShell

右键点击 `start.ps1`，选择"使用 PowerShell 运行"

### 方法2：使用命令行

```bash
node index.js
```

### 方法3：使用批处理文件

双击 `start.bat`

## 添加测试任务

启动后，在命令行输入：

```
add 完成项目报告 high
add 回复邮件 medium
add 散步 low
```

## 查看任务

```
list
```

## 发送即时提醒

```
reminder
```

## 配置微信推送（可选）

编辑 `config.json` 文件，添加企业微信机器人webhook：

```json
{
  "wechat": {
    "enabled": true,
    "webhook_url": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=YOUR_KEY"
  }
}
```

## 常见问题

### Q: 提示 "node 不是内部或外部命令"
A: 需要先安装 Node.js，访问 https://nodejs.org/ 下载并安装

### Q: npm install 失败
A: 检查网络连接，或者尝试使用国内镜像：
```bash
npm install --registry=https://registry.npmmirror.com
```

### Q: 天气查询失败
A: 检查网络连接，wttr.in API 需要联网访问

## 故障排查

如果遇到问题，请按以下步骤检查：

1. 确认 Node.js 已安装：
```bash
node --version
npm --version
```

2. 确认在工作目录：
```bash
cd c:\Users\Zhang Jiayan\WorkBuddy\Claw\workspace-live
```

3. 测试 Node.js 环境：
```bash
node -e "console.log('Hello World')"
```

4. 重新安装依赖：
```bash
npm cache clean --force
npm install
```

需要帮助？查看完整文档：`README.md`
