const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, 'config.json');

/**
 * 通知服务基类
 */
class NotificationService {
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

  saveConfig(config) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  }

  async send(message, title = '天天提醒') {
    throw new Error('send method must be implemented');
  }
}

/**
 * PushDeer 推送服务（推荐）
 * 官网：https://www.pushdeer.com
 * 适用于：iOS、Android、Mac
 * 支持多设备推送：pushkey 可以用逗号分隔多个 key
 */
class PushDeerService extends NotificationService {
  constructor() {
    super();
    this.baseUrl = 'https://api2.pushdeer.com/message/push';
  }

  async send(message, title = '天天提醒') {
    if (!this.config.pushdeer?.enabled || !this.config.pushdeer?.pushkey) {
      console.log('❌ PushDeer 未配置或未启用');
      return false;
    }

    // 支持多个 pushkey，用逗号分隔
    const pushkeys = this.config.pushdeer.pushkey.split(',').map(k => k.trim()).filter(k => k);
    let successCount = 0;
    let failCount = 0;

    for (const pushkey of pushkeys) {
      try {
        const response = await axios.post(this.baseUrl, {
          pushkey: pushkey,
          text: title,
          desp: message,
          type: 'text'
        });

        if (response.data.code === 0) {
          console.log(`✅ PushDeer 推送成功 (${pushkey.substring(0, 8)}...)`);
          successCount++;
        } else {
          console.error(`❌ PushDeer 推送失败 (${pushkey.substring(0, 8)}...):`, response.data.message || response.data.error || '未知错误');
          console.error('   完整响应:', JSON.stringify(response.data));
          failCount++;
        }
      } catch (error) {
        console.error(`❌ PushDeer 推送失败 (${pushkey.substring(0, 8)}...):`, error.message);
        failCount++;
      }
    }

    console.log(`📊 推送结果: ${successCount} 成功, ${failCount} 失败`);
    return successCount > 0;
  }
}

/**
 * Bark 推送服务
 * 官网：https://github.com/Finb/Bark
 * 适用于：iOS
 */
class BarkService extends NotificationService {
  constructor() {
    super();
    this.baseUrl = 'https://api.day.app';
  }

  async send(message, title = '天天提醒') {
    if (!this.config.bark?.enabled || !this.config.bark?.deviceKey) {
      console.log('❌ Bark 未配置或未启用');
      return false;
    }

    try {
      const url = `${this.baseUrl}/${this.config.bark.deviceKey}/${encodeURIComponent(title)}/${encodeURIComponent(message)}`;
      const response = await axios.get(url);

      if (response.data.code === 200) {
        console.log('✅ Bark 推送成功');
        return true;
      } else {
        console.error('❌ Bark 推送失败:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Bark 推送失败:', error.message);
      return false;
    }
  }
}

/**
 * Server酱 推送服务
 * 官网：https://sct.ftqq.com
 * 适用于：微信公众号
 */
class ServerChanService extends NotificationService {
  constructor() {
    super();
    this.baseUrl = 'https://sctapi.ftqq.com';
  }

  async send(message, title = '天天提醒') {
    if (!this.config.serverchan?.enabled || !this.config.serverchan?.sendkey) {
      console.log('❌ Server酱 未配置或未启用');
      return false;
    }

    try {
      const response = await axios.post(`${this.baseUrl}/${this.config.serverchan.sendkey}.send`, {
        title: title,
        desp: message
      });

      if (response.data.code === 0) {
        console.log('✅ Server酱 推送成功');
        return true;
      } else {
        console.error('❌ Server酱 推送失败:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('❌ Server酱 推送失败:', error.message);
      return false;
    }
  }
}

/**
 * Telegram 推送服务
 */
class TelegramService extends NotificationService {
  constructor() {
    super();
    this.baseUrl = 'https://api.telegram.org';
  }

  async send(message, title = '天天提醒') {
    if (!this.config.telegram?.enabled || !this.config.telegram?.botToken || !this.config.telegram?.chatId) {
      console.log('❌ Telegram 未配置或未启用');
      return false;
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/bot${this.config.telegram.botToken}/sendMessage`,
        {
          chat_id: this.config.telegram.chatId,
          text: `*${title}*\n\n${message}`,
          parse_mode: 'Markdown'
        }
      );

      if (response.data.ok) {
        console.log('✅ Telegram 推送成功');
        return true;
      } else {
        console.error('❌ Telegram 推送失败:', response.data.description);
        return false;
      }
    } catch (error) {
      console.error('❌ Telegram 推送失败:', error.message);
      return false;
    }
  }
}

/**
 * 控制台输出（默认）
 */
class ConsoleService extends NotificationService {
  async send(message, title = '天天提醒') {
    console.log('\n' + '='.repeat(50));
    console.log(title);
    console.log('='.repeat(50));
    console.log(message);
    console.log('='.repeat(50) + '\n');
    return true;
  }
}

/**
 * 通知管理器
 */
class NotificationManager {
  constructor() {
    this.services = {
      pushdeer: new PushDeerService(),
      bark: new BarkService(),
      serverchan: new ServerChanService(),
      telegram: new TelegramService(),
      console: new ConsoleService()
    };
  }

  async send(message, title = '天天提醒') {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

    // 优先级：尝试配置的服务，最后使用控制台
    const serviceOrder = ['pushdeer', 'bark', 'serverchan', 'telegram', 'console'];

    for (const serviceName of serviceOrder) {
      if (serviceName === 'console' || config[serviceName]?.enabled) {
        const service = this.services[serviceName];
        const success = await service.send(message, title);

        if (success) {
          return true;
        }
      }
    }

    return false;
  }

  listAvailableServices() {
    console.log('\n📋 可用的推送服务：\n');
    console.log('1. PushDeer (推荐) - iOS/Android/Mac 通用');
    console.log('   官网：https://www.pushdeer.com');
    console.log('   配置：pushdeer.pushkey\n');
    console.log('2. Bark - iOS 专用');
    console.log('   官网：https://github.com/Finb/Bark');
    console.log('   配置：bark.deviceKey\n');
    console.log('3. Server酱 - 微信公众号');
    console.log('   官网：https://sct.ftqq.com');
    console.log('   配置：serverchan.sendkey\n');
    console.log('4. Telegram - 国际通用');
    console.log('   官网：https://telegram.org');
    console.log('   配置：telegram.botToken 和 telegram.chatId\n');
    console.log('5. 控制台 - 默认方式');
    console.log('   无需配置，直接在控制台显示\n');
  }
}

module.exports = {
  NotificationManager,
  PushDeerService,
  BarkService,
  ServerChanService,
  TelegramService,
  ConsoleService
};
