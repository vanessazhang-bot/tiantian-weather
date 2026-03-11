@echo off
echo ====================================
echo    天天助手 - 明天天气测试
echo ====================================
echo.

cd /d "%~dp0"

echo 检查 Node.js 是否已安装...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
echo.
echo 检查依赖是否已安装...
if not exist "node_modules" (
    echo 依赖未安装，正在安装...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

echo ✅ 依赖检查完成
echo.
echo 运行明天天气测试...
echo.
node test-tomorrow.js

echo.
pause
