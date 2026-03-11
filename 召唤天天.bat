@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════╗
echo ║                                      ║
echo ║     ☀️ 天天 - 您的生活助理          ║
echo ║                                      ║
echo ╚══════════════════════════════════════╝
echo.

cd /d "c:\Users\Zhang Jiayan\WorkBuddy\Claw\workspace-live"

if "%1"=="" (
    echo 💬 正在查询明天天气...
    node tiantian.js
) else (
    echo 💬 天天收到指令：%*
    node tiantian.js %*
)

echo.
pause
