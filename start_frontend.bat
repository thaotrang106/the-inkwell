@echo off
title The Inkwell Frontend (Next.js 16)
echo ===================================================================
echo               KHOI DONG THE INKWELL WEB FRONTEND
echo ===================================================================
echo.
cd /d "%~dp0frontend"
echo [1/2] Dang mo trinh duyet tai http://localhost:3000 ...
start http://localhost:3000
echo [2/2] Dang chay Next.js Dev Server (port 3000) ...
echo.
echo Khi can tat server, hay nhan to hop phim [Ctrl + C] tren cua so nay.
echo ===================================================================
echo.
npm run dev
pause
