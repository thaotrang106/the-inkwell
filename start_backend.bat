@echo off
title The Inkwell AI Backend Server (FastAPI)
echo ===================================================================
echo               KHOI DONG THE INKWELL AI BACKEND
echo ===================================================================
echo.
cd /d "%~dp0backend"
echo [1/2] Dang mo trinh duyet Swagger Docs tai http://127.0.0.1:8000/docs ...
start http://127.0.0.1:8000/docs
echo [2/2] Dang chay Uvicorn Server (port 8000) ...
echo.
echo Khi can tat server, hay nhan to hop phim [Ctrl + C] tren cua so nay.
echo ===================================================================
echo.
python -m uvicorn app.main:app --reload --port 8000
pause
