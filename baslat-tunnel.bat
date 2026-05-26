@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   Islamic - TUNNEL modu (iPhone)
echo ========================================
echo.

echo [1/3] Eski sunucu kapatiliyor...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":8081" ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":8082" ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1
timeout /t 2 /nobreak >nul

set PORT=8081
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":%PORT%" ^| findstr LISTENING') do set PORT=8082

echo [2/3] Tunnel baslatiliyor (1-2 dakika bekleyin)...
echo      "Tunnel ready" yazisini gorene kadar QR okutmayin!
echo.

call npx expo start --tunnel --clear --port %PORT%

pause
