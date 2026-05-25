@echo off
echo Expo Metro icin Windows Guvenlik Duvari kurali ekleniyor...
netsh advfirewall firewall add rule name="Expo Metro Bundler 8081" dir=in action=allow protocol=TCP localport=8081
netsh advfirewall firewall add rule name="Expo Metro Bundler 8081 Out" dir=out action=allow protocol=TCP localport=8081
echo.
echo Tamamlandi. Bu pencereyi kapatabilirsiniz.
pause
