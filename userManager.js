const fs = require('fs');
const path = require('path');
const readline = require('readline');

const USERS_PATH = path.join(__dirname, 'users.json');
const EXAMPLE_PATH = path.join(__dirname, 'users.example.json');

/**
 * 用户管理器
 * 支持动态添加、删除、修改推送用户
 */
class UserManager {
  constructor() {
    this.users = this.loadUsers();
  }

  /**
   * 加载用户配置
   */
  loadUsers() {
    try {
      if (fs.existsSync(USERS_PATH)) {
        const data = fs.readFileSync(USERS_PATH, 'utf8');
        return JSON.parse(data);
      } else if (fs.existsSync(EXAMPLE_PATH)) {
        // 如果没有users.json，复制example
        const exampleData = fs.readFileSync(EXAMPLE_PATH, 'utf8');
        const config = JSON.parse(exampleData);
        console.log('⚠️  未找到 users.json，已从 users.example.json 复制');
        return config;
      } else {
        return { users: [], quotes: { inspirational: [], love: [], funny: [], custom: [] }, globalSettings: {} };
      }
    } catch (error) {
      console.error('加载用户配置失败:', error.message);
      return { users: [], quotes: { inspirational: [], love: [], funny: [], custom: [] }, globalSettings: {} };
    }
  }

  /**
   * 保存用户配置
   */
  saveUsers() {
    try {
      fs.writeFileSync(USERS_PATH, JSON.stringify(this.users, null, 2), 'utf8');
      console.log('✅ 用户配置已保存');
      return true;
    } catch (error) {
      console.error('保存用户配置失败:', error.message);
      return false;
    }
  }

  /**
   * 生成用户ID
   */
  generateUserId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 5);
    return `user_${timestamp}${random}`;
  }

  /**
   * 添加新用户
   */
  addUser(userInfo) {
    const user = {
      id: this.generateUserId(),
      name: userInfo.name || '用户',
      pushkey: userInfo.pushkey,
      city: userInfo.city || this.users.globalSettings?.defaultCity || '深圳',
      useIP: userInfo.useIP !== false,
      messageStyle: {
        titleTemplate: userInfo.messageStyle?.titleTemplate || '🌤️ 今天天气来啦～',
        quoteType: userInfo.messageStyle?.quoteType || 'inspirational',
        quoteTitle: userInfo.messageStyle?.quoteTitle || '🍵 今日寄语',
        tone: userInfo.messageStyle?.tone || 'friendly',
        showWeatherDetails: userInfo.messageStyle?.showWeatherDetails !== false,
        showClothingAdvice: userInfo.messageStyle?.showClothingAdvice !== false,
        showTravelTips: userInfo.messageStyle?.showTravelTips !== false
      },
      schedule: {
        enabled: userInfo.schedule?.enabled !== false,
        time: userInfo.schedule?.time || '08:30'
      },
      enabled: userInfo.enabled !== false
    };

    this.users.users.push(user);
    this.saveUsers();
    console.log(`✅ 已添加用户: ${user.name} (ID: ${user.id})`);
    return user;
  }

  /**
   * 删除用户
   */
  deleteUser(userId) {
    const index = this.users.users.findIndex(u => u.id === userId);
    if (index === -1) {
      console.log('❌ 未找到该用户');
      return false;
    }

    const user = this.users.users[index];
    this.users.users.splice(index, 1);
    this.saveUsers();
    console.log(`✅ 已删除用户: ${user.name}`);
    return true;
  }

  /**
   * 更新用户信息
   */
  updateUser(userId, updates) {
    const user = this.users.users.find(u => u.id === userId);
    if (!user) {
      console.log('❌ 未找到该用户');
      return false;
    }

    // 更新基本信息
    if (updates.name) user.name = updates.name;
    if (updates.pushkey) user.pushkey = updates.pushkey;
    if (updates.city) user.city = updates.city;
    if (updates.useIP !== undefined) user.useIP = updates.useIP;
    if (updates.enabled !== undefined) user.enabled = updates.enabled;

    // 更新消息样式
    if (updates.messageStyle) {
      user.messageStyle = { ...user.messageStyle, ...updates.messageStyle };
    }

    // 更新定时设置
    if (updates.schedule) {
      user.schedule = { ...user.schedule, ...updates.schedule };
    }

    this.saveUsers();
    console.log(`✅ 已更新用户: ${user.name}`);
    return true;
  }

  /**
   * 获取所有用户
   */
  getAllUsers() {
    return this.users.users.filter(u => u.enabled);
  }

  /**
   * 获取用户信息
   */
  getUser(userId) {
    return this.users.users.find(u => u.id === userId);
  }

  /**
   * 列出所有用户
   */
  listUsers() {
    console.log('\n📋 用户列表:');
    console.log('─'.repeat(60));
    this.users.users.forEach((user, index) => {
      const status = user.enabled ? '✅ 启用' : '❌ 禁用';
      console.log(`${index + 1}. ${user.name} (${user.id})`);
      console.log(`   城市: ${user.city} | 推送服务: ${user.pushkey.substring(0, 10)}...`);
      console.log(`   语录类型: ${user.messageStyle.quoteType} | 状态: ${status}`);
      console.log('');
    });
    console.log('─'.repeat(60));
  }

  /**
   * 添加自定义语录
   */
  addQuote(type, quote) {
    if (!this.users.quotes[type]) {
      this.users.quotes[type] = [];
    }
    this.users.quotes[type].push(quote);
    this.saveUsers();
    console.log(`✅ 已添加${type}语录: "${quote}"`);
  }

  /**
   * 交互式添加用户
   */
  async interactiveAddUser() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => new Promise((resolve) => {
      rl.question(prompt, resolve);
    });

    try {
      console.log('\n👤 添加新用户');
      console.log('─'.repeat(60));

      const name = await question('用户名称 (如: 宝宝、黄sir): ');
      const pushkey = await question('PushDeer Key: ');
      const city = await question('城市 (默认深圳，输入 auto 使用IP定位): ');
      
      console.log('\n📝 消息风格设置:');
      console.log('1. inspirational - 励志语录');
      console.log('2. love - 情话');
      console.log('3. funny - 搞笑');
      console.log('4. custom - 自定义');
      
      const quoteType = await question('选择语录类型 (默认 inspirational): ') || 'inspirational';
      
      const titleTemplate = await question('标题模板 (如: 🌤️ 早安呀，{name}～): ') || '🌤️ 今天天气来啦～';
      const quoteTitle = await question('语录标题 (如: 🍵 喝点毒鸡汤): ') || '🍵 今日寄语';

      const user = this.addUser({
        name,
        pushkey,
        city: city === 'auto' ? null : (city || '深圳'),
        useIP: city === 'auto',
        messageStyle: {
          titleTemplate,
          quoteType,
          quoteTitle
        }
      });

      console.log('\n✅ 用户添加成功！');
      this.listUsers();

      rl.close();
      return user;
    } catch (error) {
      console.error('添加用户失败:', error.message);
      rl.close();
      return null;
    }
  }
}

module.exports = UserManager;

// 如果直接运行此文件，启动交互式管理
if (require.main === module) {
  const manager = new UserManager();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'list':
      manager.listUsers();
      break;
    case 'add':
      manager.interactiveAddUser();
      break;
    case 'remove':
      if (args[1]) {
        manager.deleteUser(args[1]);
      } else {
        console.log('用法: node userManager.js remove <用户ID>');
      }
      break;
    default:
      console.log(`
使用方法:
  node userManager.js list         - 列出所有用户
  node userManager.js add          - 交互式添加用户
  node userManager.js remove <ID>  - 删除用户
      `);
  }
}
