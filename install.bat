@echo off
cd /d "%~dp0"
echo 正在安装依赖...
call npm install
echo.
echo 安装完成！
echo 运行 'npm start' 启动天天助手
pause
