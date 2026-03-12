@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════╗
echo ║     🌤️  天天天气助手 - 管理面板      ║
echo ╚══════════════════════════════════════╝
echo.
echo 请选择操作：
echo.
echo 1. 启动管理面板
echo 2. 测试推送天气
echo 3. 查看用户列表
echo 4. 添加新用户
echo 5. 安装依赖
echo 6. 退出
echo.
set /p choice="请输入选项 (1-6): "

if "%choice%"=="1" goto manage
if "%choice%"=="2" goto test
if "%choice%"=="3" goto list
if "%choice%"=="4" goto add
if "%choice%"=="5" goto install
if "%choice%"=="6" goto end

:manage
cls
node cli.js
pause
goto end

:test
cls
echo.
echo 正在推送天气给所有用户...
echo.
node multi-weather.js
pause
goto end

:list
cls
echo.
node userManager.js list
pause
goto end

:add
cls
echo.
node userManager.js add
pause
goto end

:install
cls
echo.
echo 正在安装依赖...
npm install
echo.
echo ✅ 安装完成！
pause
goto end

:end
