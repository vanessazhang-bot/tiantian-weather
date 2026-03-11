const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');

/**
 * 飞书推送服务
 */
class FeishuService {
  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    try {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch (error) {
      return {};
    }
  }

  /**
   * 发送飞书消息
   * @param {string} message - 消息内容
   * @param {string} title - 消息标题
   */
  async send(message, title = '天天提醒') {
    if (!this.config.feishu?.enabled || !this.config.feishu?.webhookUrl) {
      console.log('❌ 飞书推送未配置');
      return false;
    }

    try {
      const response = await axios.post(
        this.config.feishu.webhookUrl,
        {
          msg_type: 'text',
          content: {
            text: `${title}\n\n${message}`
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data.code === 0) {
        console.log('✅ 飞书推送成功');
        return true;
      } else {
        console.error('❌ 飞书推送失败:', response.data.msg);
        return false;
      }
    } catch (error) {
      console.error('❌ 飞书推送失败:', error.message);
      return false;
    }
  }

  /**
   * 发送富文本消息
   */
  async sendRichText(title, content, weatherInfo = null) {
    if (!this.config.feishu?.enabled || !this.config.feishu?.webhookUrl) {
      console.log('❌ 飞书推送未配置');
      return false;
    }

    try {
      const card = {
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
        elements: [
          {
            tag: 'div',
            text: {
              tag: 'lark_md',
              content: content
            }
          }
        ]
      };

      // 如果有天气信息，添加天气卡片
      if (weatherInfo) {
        card.elements.unshift({
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
        this.config.feishu.webhookUrl,
        {
          msg_type: 'interactive',
          card: card
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data.code === 0) {
        console.log('✅ 飞书推送成功');
        return true;
      } else {
        console.error('❌ 飞书推送失败:', response.data.msg);
        return false;
      }
    } catch (error) {
      console.error('❌ 飞书推送失败:', error.message);
      return false;
    }
  }
}

module.exports = {
  FeishuService
};
