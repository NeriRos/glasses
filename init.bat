@echo off

echo. 
echo [+] Installing yarn
cmd.exe /C "npm install -g yarn && exit 0"
echo .
echo [+] Installing nodemon
cmd.exe /C "npm install -g nodemon && exit 0"
echo.  
echo [+] Installing angular cli
cmd.exe /C "npm install -g @angular/cli && exit 0"

mkdir %~dp0%db

echo [+] Installing back end prerequisites.
cmd.exe /C "cd  %~dp0%backEnd && npm install && exit 0"
echo. 
echo [+] Installing front end prerequisites.
cmd.exe /C "cd  %~dp0%frontEnd && npm install && exit 0"
echo.
echo [+] Installing front end assets prerequisites.
cmd.exe /C "cd  %~dp0%frontEnd\src\assets && yarn install && exit 0"
echo.
echo [+] Building frontEnd.
cmd.exe /C "cd  %~dp0%backEnd && npm run build && exit 0"

echo.
echo.
echo [*] DONE! YOU CAN CLOSE NOW.
pause