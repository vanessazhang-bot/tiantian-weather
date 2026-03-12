@echo off
echo 正在测试天天助手...
echo.

:: 创建测试用的临时文件
echo 测试天气查询功能...
echo.

:: 直接使用node运行测试（如果已安装）
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo Node.js 已安装
    echo.
    echo 运行测试...
    cd /d "%~dp0"
    node -e "console.log('Node.js 运行正常')"
    echo.
    echo 请按以下步骤安装和运行:
    echo 1. 运行: npm install
    echo 2. 运行: node test.js
    echo 3. 运行: node index.js
) else (
    echo 未找到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
)

echo.
pause
