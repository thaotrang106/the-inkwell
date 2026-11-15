@echo off
title The Inkwell - He Thong Goi Y Sach Thong Minh
color 0A

echo ===============================================================================
echo            THE INKWELL - NEN TANG THU VIEN & HE THONG GOI Y SACH
echo       Khoa luan Tot nghiep Dai hoc Ngan hang TP.HCM (HUB) - Khoa HTTTQL
echo ===============================================================================
echo.

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo [1/3] Kiem tra file cau hinh bien moi truong...
if not exist "backend\.env" (
    echo [THONG BAO] Chua co backend\.env, tu dong tao tu backend\.env.example...
    copy "backend\.env.example" "backend\.env" >nul
)
if not exist "frontend\.env.local" (
    echo [THONG BAO] Chua co frontend\.env.local, tu dong tao tu frontend\.env.example...
    copy "frontend\.env.example" "frontend\.env.local" >nul
)

echo [2/3] Khoi dong Backend FastAPI Server (Port 8000)...
start "The Inkwell - Backend API (FastAPI)" cmd /k "cd /d ""%SCRIPT_DIR%backend"" && python -m uvicorn app.main:app --reload --port 8000"

echo [3/3] Khoi dong Frontend Web Server (Next.js 16 - Port 3000)...
start "The Inkwell - Frontend Client (Next.js)" cmd /k "cd /d ""%SCRIPT_DIR%frontend"" && npm run dev"

echo.
echo ===============================================================================
echo [THANH CONG] Cac dich vu dang duoc khoi chay song song!
echo   * Frontend Web UI  : http://localhost:3000
echo   * Backend Swagger   : http://localhost:8000/docs
echo   * Production Live   : https://the-inkwel.vercel.app
echo ===============================================================================
echo.
timeout /t 5 >nul
start http://localhost:3000
exit
