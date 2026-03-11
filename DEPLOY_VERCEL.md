# 部署到 Vercel 指南

## 步骤1：安装 Vercel CLI

打开命令行，运行：
```bash
npm i -g vercel
```

## 步骤2：登录 Vercel

```bash
vercel login
```
按提示完成登录（需要邮箱验证）。

## 步骤3：进入项目目录

```bash
cd c:\Users\Zhang Jiayan\WorkBuddy\Claw\workspace-live
```

## 步骤4：部署

```bash
vercel
```

按提示操作：
- Set up and deploy? **Y**
- Which scope? 选择您的账号
- Link to existing project? **N**
- What's your project name? **tiantian-assistant**
- In which directory is your code located? **./** (直接回车)

## 步骤5：等待部署完成

部署成功后，会显示：
```
🔍  Inspect: https://vercel.com/xxx/tiantian-assistant/xxx
✅  Production: https://tiantian-assistant-xxx.vercel.app
```

复制 **Production** 的URL，这就是您的天天助手地址！

## 步骤6：配置环境变量（重要）

1. 访问 https://vercel.com/dashboard
2. 找到 **tiantian-assistant** 项目
3. 点击 **Settings** → **Environment Variables**
4. 添加以下变量：

| 名称 | 值 |
|-----|---|
| QWEATHER_KEY | 1a68ba0e5e6f4c3a8bbd97cdbf357e10 |
| PUSHDEER_KEY | PDU39795TSijic5tat748Cv1sb0aGqi8sNbnoqxWm |

5. 点击 **Save**
6. 重新部署：
```bash
vercel --prod
```

## 步骤7：测试

访问您的URL：
```
https://tiantian-assistant-xxx.vercel.app/weather/tomorrow
```

如果看到JSON格式的天气数据，说明部署成功！

## 步骤8：接入飞书（可选）

1. 在飞书开放平台创建应用
2. 配置事件订阅，URL填写：
   ```
   https://tiantian-assistant-xxx.vercel.app/webhook
   ```
3. 现在可以在飞书@天天查询天气了！

## 更新部署

代码修改后，重新部署：
```bash
vercel --prod
```

## 故障排查

### 部署失败
- 检查网络连接
- 确认已登录Vercel

### 天气查询失败
- 检查环境变量是否配置正确
- 查看Vercel日志

### PushDeer推送失败
- 检查PushDeer Key是否正确
- 确认PushDeer App已安装

## 免费额度

Vercel免费版：
- 无限部署次数
- 100GB带宽/月
- 足够个人使用

## 需要帮助？

如果遇到问题，请告诉我错误信息，我会帮您解决！
