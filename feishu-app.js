const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');

/**
 * 飞书企业自建应用推送服务
 */
class FeishuAppService {
  constructor() {
    this.config = this.loadConfig();
    this.baseUrl = 'https://open.feishu.cn/open-apis';
    this.tenantToken = null;
    this.tokenExpireTime = 0;
  }

  loadConfig() {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch (error) {
      return {};
    }
  }

  /**
   * 获取 tenant_access_token
   */
  async getTenantAccessToken() {
    // 检查token是否过期（提前5分钟刷新）
    if (this.tenantToken && Date.now() < this.tokenExpireTime - 300000) {
      return this.tenantToken;
    }

    if (!this.config.feishu?.appId || !this.config.feishu?.appSecret) {
      throw new Error('飞书应用配置不完整');
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/auth/v3/tenant_access_token/internal`,
        {
          app_id: this.config.feishu.appId,
          app_secret: this.config.feishu.appSecret
        },
        { timeout: 10000 }
      );

      if (response.data.code === 0) {
        this.tenantToken = response.data.tenant_access_token;
        // token有效期2小时，这里设置为1小时50分钟后过期
        this.tokenExpireTime = Date.now() + (response.data.expire - 600) * 1000;
        return this.tenantToken;
      } else {
        throw new Error(response.data.msg);
      }
    } catch (error) {
      console.error('获取飞书token失败:', error.message);
      throw error;
    }
  }

  /**
   * 发送消息到用户
   */
  async sendToUser(message, title = '天天提醒') {
    if (!this.config.feishu?.enabled) {
      console.log('❌ 飞书应用未启用');
      return false;
    }

    if (!this.config.feishu?.userId) {
      console.log('❌ 飞书用户ID未配置');
      return false;
    }

    try {
      const token = await this.getTenantAccessToken();
      const userId = this.config.feishu.userId;

      const fullMessage = title ? `${title}\n\n${message}` : message;

      const response = await axios.post(
        `${this.baseUrl}/im/v1/messages`,
        {
          receive_id: userId,
          content: JSON.stringify({
            text: fullMessage
          }),
          msg_type: 'text'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            receive_id_type: 'open_id'
          },
          timeout: 10000
        }
      );

      if (response.data.code === 0) {
        console.log('✅ 飞书消息发送成功');
        return true;
      } else {
        console.error('❌ 飞书消息发送失败:', response.data.msg);
        return false;
      }
    } catch (error) {
      console.error('❌ 飞书消息发送失败:', error.message);
      return false;
    }
  }

  /**
   * 发送富文本消息（卡片）
   */
  async sendCard(title, content, weatherInfo = null) {
    if (!this.config.feishu?.enabled || !this.config.feishu?.userId) {
      console.log('❌ 飞书应用未配置');
      return false;
    }

    try {
      const token = await this.getTenantAccessToken();
      const userId = this.config.feishu.userId;

      // 构建卡片内容
      let cardContent = [
        {
          tag: 'div',
          text: {
            tag: 'lark_md',
            content: content
          }
        }
      ];

      // 如果有天气信息，添加天气模块
      if (weatherInfo) {
        cardContent.unshift({
          tag: 'div',
          fields: [
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**🌡️ 温度**\n${weatherInfo.temp}°C`
              }
            },
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**☁️ 天气**\n${weatherInfo.condition}`
              }
            },
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**💧 湿度**\n${weatherInfo.humidity}`
              }
            },
            {
              is_short: true,
              text: {
                tag: 'lark_md',
                content: `**💨 风速**\n${weatherInfo.windSpeed}`
              }
            }
          ]
        });
      }

      const response = await axios.post(
        `${this.baseUrl}/im/v1/messages`,
        {
          receive_id: userId,
          content: JSON.stringify({
            config: {
              wide_screen_mode: true
            },
            header: {
              title: {
                tag: 'plain_text',
                content: title
              },
              template: 'blue'
            },
            elements: cardContent
          }),
          msg_type: 'interactive'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            receive_id_type: 'open_id'
          },
          timeout: 10000
        }
      );

      if (response.data.code === 0) {
        console.log('✅ 飞书卡片发送成功');
        return true;
      } else {
        console.error('❌ 飞书卡片发送失败:', response.data.msg);
        return false;
      }
    } catch (error) {
      console.error('❌ 飞书卡片发送失败:', error.message);
      return false;
    }
  }
}

module.exports = {
  FeishuAppService
};
