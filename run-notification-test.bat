@echo off
echo ====================================
echo    天天助手 - 推送服务测试
echo ====================================
echo.

cd /d "%~dp0"

echo 运行推送服务测试...
echo.
node test-notification.js

echo.
echo ====================================
echo.
echo 💡 配置推送服务请查看：NOTIFICATION_GUIDE.md
echo.
pause
