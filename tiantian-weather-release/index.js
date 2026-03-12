const { startReminderService } = require('./reminder');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
╔══════════════════════════════════════╗
║     天天 - 您的生活/工作助理        ║
╚══════════════════════════════════════╝
`);

console.log('正在启动定时提醒服务...\n');

// 启动定时提醒服务
startReminderService();

// 命令行交互
console.log('\n📝 可用命令：');
console.log('  help     - 显示帮助');
console.log('  add      - 添加任务');
console.log('  list     - 查看任务');
console.log('  complete - 完成任务');
console.log('  reminder - 立即发送提醒');
console.log('  exit     - 退出程序\n');

const commands = {
  help: () => {
    console.log(`
📖 命令说明：

1. 添加任务
   格式：add <任务内容> [优先级]
   示例：add 完成项目报告 high
   优先级：high(高) / medium(中) / low(低)

2. 查看任务
   格式：list [all]
   示例：list        - 查看今日任务
         list all    - 查看所有任务

3. 完成任务
   格式：complete <任务ID>
   示例：complete 1234567890

4. 立即发送提醒
   格式：reminder

5. 退出程序
   格式：exit 或 quit
`);
  },
  
  add: (args) => {
    const content = args.slice(0, -1).join(' ') || args.join(' ');
    const priority = ['high', 'medium', 'low'].includes(args[args.length - 1]) 
      ? args[args.length - 1] 
      : 'medium';
    
    if (!content) {
      console.log('❌ 请输入任务内容');
      return;
    }
    
    const tasks = require('./tasks');
    const task = tasks.addTask(content, priority);
    console.log(`✅ 任务已添加：${content} (ID: ${task.id})`);
  },
  
  list: (args) => {
    const tasks = require('./tasks');
    const all = args.includes('all');
    const taskList = all ? tasks.getAllTasks().tasks : tasks.getTodayTasks();
    const text = tasks.formatTasks(taskList);
    console.log(text);
  },
  
  complete: (args) => {
    if (!args[0]) {
      console.log('❌ 请输入任务ID');
      return;
    }
    
    const tasks = require('./tasks');
    const task = tasks.completeTask(args[0]);
    
    if (task) {
      console.log(`✅ 任务已完成：${task.content}`);
    } else {
      console.log('❌ 未找到该任务');
    }
  },
  
  reminder: async () => {
    const reminder = require('./reminder');
    await reminder.executeDailyReminder();
  },
  
  exit: () => {
    console.log('\n👋 再见！天天随时为您服务~');
    rl.close();
    process.exit(0);
  },
  
  quit: () => {
    commands.exit();
  }
};

rl.on('line', (input) => {
  const [cmd, ...args] = input.trim().split(' ');
  
  if (commands[cmd]) {
    commands[cmd](args);
  } else if (cmd === '') {
    // 空输入，忽略
  } else {
    console.log(`❌ 未知命令：${cmd}，输入 'help' 查看帮助`);
  }
  
  rl.prompt();
});

rl.prompt();
