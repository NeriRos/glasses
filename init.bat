@echo off

echo. 
echo [+] installing bower
npm install -g bower
echo. 
echo [+] installing nodemon
npm install -g nodemon
echo.  
echo [+] installing angular cli
npm install -g @angular/cli

echo [+] installing back end prerequisites.
cmd.exe /C "cd  %~dp0%backEnd && npm install"
echo. 
echo [+] installing front end prerequisites.
cmd.exe /C "cd  %~dp0%frontEnd && npm install"
echo.
echo [+] installing front end assets prerequisites.
cmd.exe /C "cd  %~dp0%frontEnd\src\assets && bower install"

echo.
echo.
echo [*] DONE! YOU CAN CLOSE NOW.
pause