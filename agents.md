# Agents Configuration

## Available Subagents

### code-explorer
- **Path**: builtin
- **Description**: Subagent used whenever the task requires searching across multiple files, directories, or patterns, or when the scope of code exploration is too large for a single read_file or search_file call.
- **Use Cases**:
  - Understanding codebase structure
  - Identifying modules and packages
  - Finding feature implementations
  - Gathering information spread across many files
  - Forming high-level view of project organization

### weather-agent
- **Path**: workspace-live/weather.js
- **Description**: 专门负责天气查询和穿衣建议的agent
- **Use Cases**:
  - 获取实时天气信息
  - 生成穿衣建议
  - 格式化天气数据

### task-agent
- **Path**: workspace-live/tasks.js
- **Description**: 专门负责任务管理的agent
- **Use Cases**:
  - 添加任务
  - 查看任务列表
  - 标记任务完成
  - 删除任务

### reminder-agent
- **Path**: workspace-live/reminder.js
- **Description**: 专门负责定时提醒的agent
- **Use Cases**:
  - 定时触发每日提醒
  - 生成提醒内容
  - 发送微信推送

## Team Mode Capabilities

### When to Use Team Mode
- 复杂的多步骤任务处理
- 需要不同专业能力的协作
- 后台长期运行的服务

### Team Workflow
1. Create team using `team_create`
2. Spawn team members using `Task` tool with `name` parameter
3. Members communicate via `send_message` tool
4. Delete team when work is complete using `team_delete`

### Example Team Members
- **weather-collector**: 收集天气数据
- **task-manager**: 管理任务状态
- **reminder-sender**: 发送提醒通知
- **wechat-notifier**: 处理微信推送

## Team Communication
- Use `send_message` tool for inter-agent communication
- Message types: message, broadcast, shutdown_request, shutdown_response, plan_approval_response
- Use "main" as recipient alias for team lead

## Team Storage
Team data stored at: `{workspace}/.codebuddy/teams/{team_name}/`

## Best Practices
- 使用团队模式处理复杂的提醒逻辑
- 确保每个agent职责清晰
- 定时任务要可靠执行
- 及时清理完成的工作流
