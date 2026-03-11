@echo off
chcp 65001 >nul
echo.
echo ╔══════════════════════════════════════╗
echo ║                                      ║
echo ║     🚀 天天助手一键部署              ║
echo ║                                      ║
echo ╚══════════════════════════════════════╝
echo.

cd /d "c:\Users\Zhang Jiayan\WorkBuddy\Claw\workspace-live"

echo 步骤 1/4: 检查 Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到 Node.js
    echo 请先安装: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js 已安装
echo.

echo 步骤 2/4: 检查 Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo 正在安装 Vercel CLI...
    call npm i -g vercel
)
echo ✅ Vercel CLI 已安装
echo.

echo 步骤 3/4: 安装依赖...
call npm install
echo ✅ 依赖安装完成
echo.

echo 步骤 4/4: 部署到 Vercel...
echo.
echo ⚠️  即将打开浏览器让您登录 Vercel
echo 请使用邮箱注册/登录
echo.
pause

call vercel login

echo.
echo 开始部署...
call vercel --prod

echo.
echo =====================================
echo 部署完成！
echo.
echo 请记下上面的 URL（以 .vercel.app 结尾）
echo 然后配置环境变量：
echo 1. 访问 https://vercel.com/dashboard
echo 2. 找到 tiantian-assistant 项目
echo 3. Settings -^> Environment Variables
echo 4. 添加 QWEATHER_KEY 和 PUSHDEER_KEY
echo.
echo =====================================
pause
