const fs = require('fs');
const path = require('path');

const TASKS_PATH = path.join(__dirname, 'tasks.json');

/**
 * 读取任务列表
 */
function loadTasks() {
  try {
    const data = fs.readFileSync(TASKS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { tasks: [] };
  }
}

/**
 * 保存任务列表
 */
function saveTasks(tasks) {
  fs.writeFileSync(TASKS_PATH, JSON.stringify(tasks, null, 2), 'utf8');
}

/**
 * 添加任务
 */
function addTask(content, priority = 'medium') {
  const tasks = loadTasks();
  const task = {
    id: Date.now().toString(),
    content: content,
    priority: priority, // high, medium, low
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: null
  };
  tasks.tasks.push(task);
  saveTasks(tasks);
  return task;
}

/**
 * 获取所有任务
 */
function getAllTasks() {
  return loadTasks();
}

/**
 * 获取今日任务
 */
function getTodayTasks() {
  const tasks = loadTasks();
  const today = new Date().toDateString();
  
  return tasks.tasks.filter(task => {
    if (task.completed) return false;
    if (!task.dueDate) return true;
    return new Date(task.dueDate).toDateString() === today;
  });
}

/**
 * 标记任务完成
 */
function completeTask(taskId) {
  const tasks = loadTasks();
  const taskIndex = tasks.tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return null;
  }
  
  tasks.tasks[taskIndex].completed = true;
  tasks.tasks[taskIndex].completedAt = new Date().toISOString();
  saveTasks(tasks);
  return tasks.tasks[taskIndex];
}

/**
 * 删除任务
 */
function deleteTask(taskId) {
  const tasks = loadTasks();
  const taskIndex = tasks.tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return null;
  }
  
  const deletedTask = tasks.tasks.splice(taskIndex, 1)[0];
  saveTasks(tasks);
  return deletedTask;
}

/**
 * 更新任务
 */
function updateTask(taskId, updates) {
  const tasks = loadTasks();
  const taskIndex = tasks.tasks.findIndex(t => t.id === taskId);
  
  if (taskIndex === -1) {
    return null;
  }
  
  tasks.tasks[taskIndex] = { ...tasks.tasks[taskIndex], ...updates };
  saveTasks(tasks);
  return tasks.tasks[taskIndex];
}

/**
 * 格式化任务列表
 */
function formatTasks(tasksList) {
  if (tasksList.length === 0) {
    return '今天没有待办任务，享受美好的一天吧！😊';
  }
  
  const priorityEmoji = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };
  
  let result = '📋 今日任务清单：\n\n';
  
  // 按优先级排序
  const sorted = [...tasksList].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
  
  sorted.forEach((task, index) => {
    result += `${index + 1}. ${priorityEmoji[task.priority]} ${task.content}\n`;
  });
  
  return result;
}

module.exports = {
  addTask,
  getAllTasks,
  getTodayTasks,
  completeTask,
  deleteTask,
  updateTask,
  formatTasks
};
