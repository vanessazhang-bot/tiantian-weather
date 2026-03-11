@echo off
chcp 65001 >nul
echo ====================================
echo    天天助手 - 飞书推送测试
echo ====================================
echo.

cd /d "c:\Users\Zhang Jiayan\WorkBuddy\Claw\workspace-live"

echo 检查 Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到 Node.js
    echo.
    echo 请先安装 Node.js: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
echo.

echo 检查依赖...
if not exist "node_modules" (
    echo 依赖未安装，正在安装...
    call npm install axios
)

echo ✅ 依赖检查完成
echo.
echo 正在运行飞书推送测试...
echo ====================================
node test-feishu.js
echo ====================================

echo.
pause
