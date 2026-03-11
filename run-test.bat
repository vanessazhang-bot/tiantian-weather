@echo off
chcp 65001 >nul
echo ====================================
echo    天天助手 - 推送测试
echo ====================================
echo.

cd /d "%~dp0"

echo 步骤 1/3: 检查 Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到 Node.js
    echo.
    echo 请先安装 Node.js:
    echo 1. 访问 https://nodejs.org/
    echo 2. 下载并安装 LTS 版本
    echo 3. 安装完成后重新运行此脚本
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js 已安装
echo.

echo 步骤 2/3: 检查依赖...
if not exist "node_modules" (
    echo 依赖未安装，正在安装...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo ✅ 依赖已安装
)
echo.

echo 步骤 3/3: 运行推送测试...
echo.
echo ====================================
node test-notification.js
echo ====================================

echo.
pause
