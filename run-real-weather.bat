@echo off
chcp 65001 >nul
echo ====================================
echo    天天助手 - 真实天气测试
echo ====================================
echo.

cd /d "%~dp0"

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
    echo 依赖未安装，正在安装 axios...
    call npm install axios
)

echo ✅ 依赖检查完成
echo.
echo 正在获取真实天气数据...
echo ====================================
node test-real-weather.js
echo ====================================

echo.
pause
