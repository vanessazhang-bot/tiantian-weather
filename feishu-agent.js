const axios = require('axios');

/**
 * 飞书 Agent 连接服务
 * 用于连接飞书开放平台
 */
class FeishuAgent {
  constructor() {
    // 飞书开放平台配置
    this.appId = 'cli_a5d8b2d5b7b9500c';
    this.appSecret = 'your_app_secret_here';
    this.baseUrl = 'https://open.feishu.cn/open-apis';
  }

  /**
   * 获取 tenant_access_token
   */
  async getTenantAccessToken() {
    try {
      const response = await axios.post(`${this.baseUrl}/auth/v3/tenant_access_token/internal`, {
        app_id: this.appId,
        app_secret: this.appSecret
      });

      if (response.data.code === 0) {
        return response.data.tenant_access_token;
      }
      throw new Error(response.data.msg);
    } catch (error) {
      console.error('获取 token 失败:', error.message);
      throw error;
    }
  }

  /**
   * 发送消息到用户
   */
  async sendMessageToUser(userId, message) {
    try {
      const token = await this.getTenantAccessToken();

      const response = await axios.post(
        `${this.baseUrl}/im/v1/messages`,
        {
          receive_id: userId,
          content: JSON.stringify({
            text: message
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
          }
        }
      );

      return response.data.code === 0;
    } catch (error) {
      console.error('发送消息失败:', error.message);
      return false;
    }
  }

  /**
   * 发送消息到群聊
   */
  async sendMessageToChat(chatId, message) {
    try {
      const token = await this.getTenantAccessToken();

      const response = await axios.post(
        `${this.baseUrl}/im/v1/messages`,
        {
          receive_id: chatId,
          content: JSON.stringify({
            text: message
          }),
          msg_type: 'text'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            receive_id_type: 'chat_id'
          }
        }
      );

      return response.data.code === 0;
    } catch (error) {
      console.error('发送消息失败:', error.message);
      return false;
    }
  }
}

module.exports = {
  FeishuAgent
};
