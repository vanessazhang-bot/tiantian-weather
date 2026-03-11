# GitHub Secrets 配置指南

## 步骤

1. 打开GitHub仓库: https://github.com/vanessazhang95/tiantian-weather

2. 点击 **Settings** → **Secrets and variables** → **Actions**

3. 点击 **New repository secret**，添加以下4个密钥：

| Secret名称 | 值 |
|-----------|-----|
| `OPENWEATHER_KEY` | 4b4c834682131ca25cce4759d44c46aa |
| `MY_PUSHKEY` | PDU39795TSijic5tat748Cv1sb0aGqi8sNbnoqxWm |
| `PARTNER_PUSHKEY` | PDU39813TTmaIqHJB5wSpFJcnsWGhDny9EcEZFYCP |
| `PARTNER_NAME` | 黄sir |

4. 添加完成后，GitHub Actions会自动运行

## 测试

添加完Secrets后，可以手动触发测试：
1. 进入 **Actions** 标签
2. 点击 **Daily Weather Push**
3. 点击 **Run workflow**

## 定时执行

配置完成后，每天北京时间08:30会自动推送天气。
