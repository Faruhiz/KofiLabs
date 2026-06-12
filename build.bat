@echo off
echo.
echo  KofiLabs -- Building .exe
echo  ============================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo  [ERROR] Node.js is required to build. Get it from https://nodejs.org
  pause & exit /b 1
)

echo  Installing pkg...
call npm install -g pkg

echo.
echo  Building exe...
pkg server.js --target node18-win-x64 --output KofiLabs.exe

echo.
echo  Done! KofiLabs.exe is ready.
echo.
pause
