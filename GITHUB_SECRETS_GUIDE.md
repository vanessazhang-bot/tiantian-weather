# 🔐 GitHub Secrets 配置指南

本文档说明如何在GitHub仓库中配置Secrets，确保敏感信息安全存储。

## 📋 需要配置的Secrets

### 必需的Secrets

| Secret名称 | 说明 | 示例 |
|-----------|------|------|
| `OPENWEATHER_KEY` | OpenWeather API密钥 | `4b4c834682131ca25cce4759d44c46aa` |
| `USER1_PUSHKEY` | 第1个用户的PushDeer Key | `PDU39795TSijic5tat748Cv1sb0aGqi8sNbnoqxWm` |
| `USER2_PUSHKEY` | 第2个用户的PushDeer Key | `PDU39813TTmaIqHJB5wSpFJcnsWGhDny9EcEZFYCP` |

### 可选的Secrets（根据需要）

如果需要更多用户，继续添加：

- `USER3_PUSHKEY`
- `USER4_PUSHKEY`
- ...

## 🛠️ 配置步骤

### 1. 进入仓库设置页面

1. 打开你的GitHub仓库：https://github.com/vanessazhang-bot/tiantian-weather
2. 点击 **Settings**（设置）标签
3. 在左侧菜单找到 **Secrets and variables** → **Actions**

### 2. 添加第一个Secret

1. 点击 **New repository secret** 按钮
2. 填写信息：
   - **Name**: `OPENWEATHER_KEY`
   - **Secret**: `4b4c834682131ca25cce4759d44c46aa`
3. 点击 **Add secret** 按钮

### 3. 添加用户Secrets

重复上述步骤，为每个用户添加：

**Secret 2:**
- **Name**: `USER1_PUSHKEY`
- **Secret**: `PDU39795TSijic5tat748Cv1sb0aGqi8sNbnoqxWm`

**Secret 3:**
- **Name**: `USER2_PUSHKEY`
- **Secret**: `PDU39813TTmaIqHJB5wSpFJcnsWGhDny9EcEZFYCP`

### 4. 确认配置

配置完成后，Secrets列表应该显示：

```
OPENWEATHER_KEY     Updated just now
USER1_PUSHKEY       Updated just now
USER2_PUSHKEY       Updated just now
```

## 🔍 验证配置

### 方法一：查看workflow文件

打开 `.github/workflows/weather-push.yml`，确认Secrets引用正确：

```yaml
"pushkey": "${{ secrets.USER1_PUSHKEY }}"
```

### 方法二：手动触发测试

1. 进入仓库的 **Actions** 标签
2. 选择 **Daily Weather Push**
3. 点击 **Run workflow** → **Run workflow**
4. 查看运行日志，确认推送成功

## ⚠️ 安全注意事项

### ✅ 应该做的
- ✅ 所有API密钥都存储在GitHub Secrets中
- ✅ Secrets在workflow中通过 `${{ secrets.XXX }}` 引用
- ✅ 定期更换密钥，更新Secrets
- ✅ 只给需要的人推送权限

### ❌ 不应该做的
- ❌ 不要将密钥写入代码文件
- ❌ 不要将 `config.json` 或 `users.json` 提交到GitHub
- ❌ 不要在公开场合分享密钥
- ❌ 不要使用已泄露的密钥

## 📝 添加更多用户

### 1. 添加新的Secret

假设要添加第3个用户：

- **Name**: `USER3_PUSHKEY`
- **Secret**: 第3个用户的PushDeer Key

### 2. 更新workflow文件

编辑 `.github/workflows/weather-push.yml`，在 `users` 数组中添加：

```yaml
{
  "id": "user_003",
  "name": "新用户名",
  "pushkey": "${{ secrets.USER3_PUSHKEY }}",
  "messageStyle": {
    "quoteType": "inspirational"
  },
  "enabled": true
}
```

### 3. 提交更改

```bash
git add .github/workflows/weather-push.yml
git commit -m "添加第3个用户"
git push
```

## 🔄 更新现有Secret

如果密钥发生变化：

1. 进入 Settings → Secrets and variables → Actions
2. 找到要更新的Secret
3. 点击 **Update** 按钮
4. 输入新的值
5. 点击 **Update secret** 按钮

## ❓ 常见问题

### Q: Secrets会过期吗？
**A:** 不会。除非你手动删除或更新，Secrets会一直保存。

### Q: 可以看到已配置的Secret值吗？
**A:** 不能。GitHub只显示Secret的名称和更新时间，不显示值。这是安全设计。

### Q: 忘记了某个Secret的值怎么办？
**A:** 只能重新获取密钥并更新Secret。例如：
- OpenWeather Key：去 openweathermap.org 重新查看
- PushDeer Key：去 PushDeer App 重新查看

### Q: workflow执行失败，提示找不到Secret？
**A:** 检查：
1. Secret名称是否拼写正确（区分大小写）
2. Secret是否已添加
3. workflow文件中引用是否正确：`${{ secrets.XXX }}`

### Q: 如何删除不再使用的Secret？
**A:** 在Secrets列表中点击对应的Secret，然后点击 **Remove** 按钮。

## 📊 Secrets使用示例

### 示例1：引用OpenWeather Key

```yaml
"key": "${{ secrets.OPENWEATHER_KEY }}"
```

### 示例2：引用用户PushKey

```yaml
"pushkey": "${{ secrets.USER1_PUSHKEY }}"
```

### 示例3：在环境变量中使用

```yaml
- name: Run script
  env:
    API_KEY: ${{ secrets.OPENWEATHER_KEY }}
  run: node script.js
```

## 🎯 完整配置检查清单

- [ ] 已创建GitHub仓库
- [ ] 已添加 `OPENWEATHER_KEY`
- [ ] 已添加 `USER1_PUSHKEY`
- [ ] 已添加 `USER2_PUSHKEY`（如需要）
- [ ] 已验证workflow文件引用正确
- [ ] 已手动触发测试成功

---

**配置完成后，每天早上8:30会自动推送天气！** 🎉
