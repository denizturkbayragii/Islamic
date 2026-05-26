@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ========================================
echo   Islamic - iPhone icin Expo baslatma
echo ========================================
echo.

REM Eski Metro/Expo sureclerini kapat
echo [1/4] Eski sunucu kapatiliyor...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":8081" ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":8082" ^| findstr LISTENING') do taskkill /F /PID %%p >nul 2>&1
timeout /t 2 /nobreak >nul

set PORT=8081
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":%PORT%" ^| findstr LISTENING') do set PORT=8082

REM WiFi IP adresini bul
for /f %%i in ('powershell -NoProfile -Command "$ip=(Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -notlike ''127.*'' -and $_.InterfaceAlias -match ''Wi-?Fi'' } ^| Select-Object -First 1 -ExpandProperty IPAddress); if(-not $ip){$ip=(Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -notlike ''127.*'' } ^| Select-Object -First 1 -ExpandProperty IPAddress)}; $ip"') do set WIFI_IP=%%i

if "%WIFI_IP%"=="" (
  echo HATA: WiFi IP bulunamadi. WiFi acik mi kontrol edin.
  pause
  exit /b 1
)

echo [2/4] WiFi IP: %WIFI_IP%
set REACT_NATIVE_PACKAGER_HOSTNAME=%WIFI_IP%
set EXPO_PACKAGER_PROXY_URL=http://%WIFI_IP%:%PORT%

echo.
echo [3/4] Expo baslatiliyor (LAN modu)...
echo.
echo iPhone Expo Go icinde manuel URL:
echo   exp://%WIFI_IP%:%PORT%
echo.
echo NOT: Tunnel modu Expo hesabi (email/sifre) isteyebilir.
echo      Hesap olmadan calistirmak icin bu dosyayi kullanin.
echo.
echo Tunnel denemek icin (hesap gerekir): baslat-tunnel.bat
echo.
echo [4/4] QR kod asagida gorunecek...
echo ========================================
echo.

call npx expo start --lan --clear --port %PORT%

pause
