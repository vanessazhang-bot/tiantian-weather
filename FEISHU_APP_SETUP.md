# 飞书企业自建应用配置指南

## 您需要填写的信息

打开 `config.json`，填写以下3个字段：

```json
{
  "feishu": {
    "enabled": true,
    "appId": "cli_xxxxxxxxxxxxxxxx",
    "appSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "userId": "ou_xxxxxxxxxxxxxxxx"
  }
}
```

## 如何获取这些信息

### 1. App ID 和 App Secret

1. 登录 [飞书开放平台](https://open.feishu.cn/)
2. 进入 **开发者后台**
3. 找到您的应用，点击进入
4. 在 **"凭证与基础信息"** 页面可以看到：
   - **App ID**（应用ID）
   - **App Secret**（应用密钥）

### 2. User ID（您的飞书用户ID）

#### 方法A：通过飞书开放平台获取

1. 在开发者后台，点击 **"成员管理"**
2. 找到您的账号
3. 复制 **Open ID**

#### 方法B：通过接口获取（需要管理员权限）

#### 方法C：让我帮您获取

运行以下命令，我会帮您获取：
```bash
node get-feishu-userid.js
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
    "key": "1a68ba0e5e6f4c3a8bbd97cdbf357e10"
  },
  "feishu": {
    "enabled": true,
    "appId": "cli_a5d8b2d5b7b9500c",
    "appSecret": "your_secret_here",
    "userId": "ou_3c11e7c2b7c7c7c7c7c7c7c7c7c7c7c"
  },
  "pushdeer": {
    "enabled": false,
    "pushkey": ""
  }
}
```

## 权限配置

确保您的应用有以下权限：

1. 进入应用详情 → **权限管理**
2. 添加以下权限：
   - `im:chat:readonly`（获取群组信息）
   - `im:message:send_as_bot`（以机器人身份发送消息）
   - `contact:user.department:readonly`（获取用户部门信息）

3. 点击 **"申请发布"** → **"创建版本"**
4. 发布应用（或先测试，选择"仅自己可见"）

## 测试

配置完成后，运行：
```bash
node test-feishu-app.js
```

## 故障排查

### 提示 "appId 或 appSecret 错误"
- 检查是否复制正确
- 确认没有多余的空格

### 提示 "userId 错误"
- 确认使用的是 Open ID，不是 User ID
- 确认用户已安装应用

### 提示 "权限不足"
- 检查应用是否有发送消息权限
- 确认应用已发布或已测试

### 提示 "token 过期"
- 这是正常的，系统会自动刷新

## 特点

- ✅ 更稳定（企业级API）
- ✅ 支持富文本卡片
- ✅ 可以@用户
- ✅ 支持群聊和私聊
- ✅ 免费额度充足
