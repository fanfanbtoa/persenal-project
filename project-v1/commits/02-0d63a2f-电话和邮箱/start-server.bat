@echo off
cd /d "%~dp0"
start "" cmd /c "timeout /t 1 >nul & start http://127.0.0.1:3000/"
node server.mjs
echo.
echo 服务已停止。按任意键关闭窗口。
pause >nul
