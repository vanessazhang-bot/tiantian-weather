#!/usr/bin/env node
const readline = require('readline');
const UserManager = require('./userManager.js');
const MultiWeatherService = require('./multi-weather.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => {
  rl.question(prompt, resolve);
});

/**
 * 天天天气助手 - 命令行管理工具
 */
class CLI {
  constructor() {
    this.userManager = new UserManager();
    this.weatherService = new MultiWeatherService();
  }

  /**
   * 显示主菜单
   */
  async showMainMenu() {
    console.log('\n╔══════════════════════════════════════╗');
    console.log('║     🌤️  天天天气助手 - 管理面板      ║');
    console.log('╚══════════════════════════════════════╝');
    console.log('');
    console.log('1. 📋 查看所有用户');
    console.log('2. ➕ 添加新用户');
    console.log('3. ✏️  编辑用户');
    console.log('4. 🗑️  删除用户');
    console.log('5. 📤 立即推送天气');
    console.log('6. 💬 管理语录库');
    console.log('0. 🚪 退出');
    console.log('');
  }

  /**
   * 添加用户交互
   */
  async addUserInteractive() {
    console.log('\n┌──────────────────────────────────────┐');
    console.log('│          ➕ 添加新用户               │');
    console.log('└──────────────────────────────────────┘');
    console.log('');

    const name = await question('👤 用户名称 (如: 宝宝、黄sir): ');
    if (!name.trim()) {
      console.log('❌ 用户名称不能为空');
      return;
    }

    const pushkey = await question('🔑 PushDeer Key: ');
    if (!pushkey.trim()) {
      console.log('❌ PushDeer Key 不能为空');
      return;
    }

    const cityInput = await question('🏙️  城市 (默认深圳，输入 auto 使用IP定位): ');
    const city = cityInput.trim() || '深圳';
    const useIP = cityInput.trim().toLowerCase() === 'auto';

    console.log('\n📝 消息风格设置:');
    console.log('─'.repeat(40));
    console.log('语录类型:');
    console.log('  1. inspirational - 励志语录');
    console.log('  2. love - 情话');
    console.log('  3. funny - 搞笑');
    console.log('  4. custom - 自定义');
    console.log('');
    
    const quoteTypeInput = await question('选择语录类型 (1-4, 默认1): ');
    const quoteTypeMap = {
      '1': 'inspirational',
      '2': 'love',
      '3': 'funny',
      '4': 'custom'
    };
    const quoteType = quoteTypeMap[quoteTypeInput.trim()] || 'inspirational';

    const titleTemplate = await question('📝 标题模板 (默认: 🌤️ 今天天气来啦～): ') || '🌤️ 今天天气来啦～';
    const quoteTitle = await question('💬 语录标题 (默认: 🍵 今日寄语): ') || '🍵 今日寄语';

    console.log('\n语气风格:');
    console.log('  1. friendly - 友好亲切');
    console.log('  2. sweet - 甜蜜温柔');
    console.log('  3. playful - 活泼俏皮');
    console.log('  4. professional - 专业正式');
    console.log('');
    
    const toneInput = await question('选择语气风格 (1-4, 默认1): ');
    const toneMap = {
      '1': 'friendly',
      '2': 'sweet',
      '3': 'playful',
      '4': 'professional'
    };
    const tone = toneMap[toneInput.trim()] || 'friendly';

    const user = this.userManager.addUser({
      name: name.trim(),
      pushkey: pushkey.trim(),
      city: useIP ? null : city,
      useIP,
      messageStyle: {
        titleTemplate,
        quoteType,
        quoteTitle,
        tone
      }
    });

    console.log('\n✅ 用户添加成功！');
    console.log(`   ID: ${user.id}`);
    
    const testNow = await question('\n是否立即测试推送？ (y/n): ');
    if (testNow.toLowerCase() === 'y') {
      // 重新创建 weatherService 以加载新用户
      const MultiWeatherService = require('./multi-weather.js');
      const weatherService = new MultiWeatherService();
      await weatherService.pushToUser(user.id);
    }
  }

  /**
   * 编辑用户
   */
  async editUserInteractive() {
    this.userManager.listUsers();
    
    const userId = await question('\n请输入要编辑的用户ID (或输入序号): ');
    if (!userId.trim()) {
      console.log('❌ 取消编辑');
      return;
    }

    // 支持序号或ID
    let user;
    if (userId.startsWith('user_')) {
      user = this.userManager.getUser(userId);
    } else {
      const index = parseInt(userId) - 1;
      user = this.userManager.users.users[index];
    }

    if (!user) {
      console.log('❌ 未找到该用户');
      return;
    }

    console.log(`\n当前用户: ${user.name}`);
    console.log('─'.repeat(40));
    console.log(`1. 名称: ${user.name}`);
    console.log(`2. PushKey: ${user.pushkey.substring(0, 15)}...`);
    console.log(`3. 城市: ${user.city || 'IP定位'}`);
    console.log(`4. 语录类型: ${user.messageStyle.quoteType}`);
    console.log(`5. 状态: ${user.enabled ? '启用' : '禁用'}`);
    console.log('');

    const field = await question('选择要修改的字段 (1-5): ');
    
    switch (field.trim()) {
      case '1':
        const newName = await question('新名称: ');
        this.userManager.updateUser(user.id, { name: newName.trim() });
        break;
      case '2':
        const newKey = await question('新PushKey: ');
        this.userManager.updateUser(user.id, { pushkey: newKey.trim() });
        break;
      case '3':
        const newCity = await question('新城市 (或输入 auto): ');
        this.userManager.updateUser(user.id, { 
          city: newCity === 'auto' ? null : newCity,
          useIP: newCity === 'auto'
        });
        break;
      case '4':
        console.log('\n语录类型:');
        console.log('  1. inspirational');
        console.log('  2. love');
        console.log('  3. funny');
        console.log('  4. custom');
        const newQuoteType = await question('选择: ');
        const quoteTypeMap = { '1': 'inspirational', '2': 'love', '3': 'funny', '4': 'custom' };
        this.userManager.updateUser(user.id, { 
          messageStyle: { quoteType: quoteTypeMap[newQuoteType] }
        });
        break;
      case '5':
        this.userManager.updateUser(user.id, { enabled: !user.enabled });
        break;
      default:
        console.log('❌ 无效选择');
    }
  }

  /**
   * 删除用户
   */
  async deleteUserInteractive() {
    this.userManager.listUsers();
    
    const userId = await question('\n请输入要删除的用户ID (或输入序号): ');
    if (!userId.trim()) {
      console.log('❌ 取消删除');
      return;
    }

    // 支持序号或ID
    let user;
    if (userId.startsWith('user_')) {
      user = this.userManager.getUser(userId);
    } else {
      const index = parseInt(userId) - 1;
      user = this.userManager.users.users[index];
    }

    if (!user) {
      console.log('❌ 未找到该用户');
      return;
    }

    const confirm = await question(`确认删除用户 "${user.name}"？ (y/n): `);
    if (confirm.toLowerCase() === 'y') {
      this.userManager.deleteUser(user.id);
    } else {
      console.log('❌ 取消删除');
    }
  }

  /**
   * 管理语录库
   */
  async manageQuotes() {
    console.log('\n💬 语录库管理');
    console.log('─'.repeat(40));
    console.log('1. 查看所有语录');
    console.log('2. 添加语录');
    console.log('0. 返回');
    console.log('');

    const choice = await question('请选择: ');

    switch (choice.trim()) {
      case '1':
        console.log('\n📚 所有语录:');
        const quotes = this.userManager.users.quotes;
        Object.keys(quotes).forEach(type => {
          console.log(`\n${type}:`);
          quotes[type].forEach((q, i) => console.log(`  ${i + 1}. ${q}`));
        });
        break;
      case '2':
        console.log('\n语录类型:');
        console.log('  1. inspirational');
        console.log('  2. love');
        console.log('  3. funny');
        console.log('  4. custom');
        const type = await question('选择类型: ');
        const quote = await question('输入语录内容: ');
        const typeMap = { '1': 'inspirational', '2': 'love', '3': 'funny', '4': 'custom' };
        this.userManager.addQuote(typeMap[type], quote);
        break;
      case '0':
        return;
    }
  }

  /**
   * 运行CLI
   */
  async run() {
    console.log('🌤️  欢迎使用天天天气助手！');
    
    while (true) {
      await this.showMainMenu();
      const choice = await question('请选择操作 (0-6): ');
      
      switch (choice.trim()) {
        case '1':
          this.userManager.listUsers();
          break;
        case '2':
          await this.addUserInteractive();
          break;
        case '3':
          await this.editUserInteractive();
          break;
        case '4':
          await this.deleteUserInteractive();
          break;
        case '5':
          await this.weatherService.pushAllUsers();
          break;
        case '6':
          await this.manageQuotes();
          break;
        case '0':
          console.log('\n👋 再见！');
          rl.close();
          return;
        default:
          console.log('❌ 无效选择，请重试');
      }
      
      await question('\n按回车继续...');
    }
  }
}

// 启动CLI
if (require.main === module) {
  const cli = new CLI();
  cli.run().catch(console.error);
}

module.exports = CLI;
