@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul

rem ============================================================
rem  START.BAT - auto-setup and launch of the "Cart" demo app
rem  (cart-demo, Vite + React)
rem  Works on Windows 10/11. Double-click to run.
rem ============================================================

cd /d "%~dp0"
title Cart Demo Launcher

echo ============================================================
echo   DEMO: Shopping Cart Page
echo   Folder: %CD%
echo ============================================================
echo.

rem ---------- [1/4] Check Node.js ----------
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found in PATH.
    echo.
    echo Download and install the LTS version here: https://nodejs.org/en
    echo After installation, run this script again.
    pause
    exit /b 1
)

for /f "delims=" %%v in ('node -v') do set NODE_VER=%%v
echo [1/4] Node.js found: !NODE_VER!

rem Warn if Node is older than 18
for /f "tokens=1,2 delims=.v" %%a in ("!NODE_VER!") do set NODE_MAJOR=%%b
if defined NODE_MAJOR if !NODE_MAJOR! LSS 18 (
    echo [WARNING] Node.js version 18 or newer is recommended. Very old versions may fail.
)

rem ---------- [2/4] Install dependencies if needed ----------
if exist "node_modules\vite" (
    echo [2/4] Dependencies already installed - skipping npm install.
) else (
    echo [2/4] Installing project dependencies, first run only...
    echo        It can take a few minutes.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERROR] "npm install" failed.
        echo         Check your internet connection and run the script again.
        pause
        exit /b 1
    )
)

rem ---------- [3/4] Pick free port (default 5173) ----------
set PORT=5173
:findport
netstat -ano | findstr /i /c:":%PORT% " | findstr /i /c:"LISTENING" >nul 2>&1
if not errorlevel 1 (
    set /a PORT+=1
    goto findport
)
echo [3/4] Dev server will use port %PORT%

rem ---------- [4/4] Launch dev server + open browser ----------
echo [4/4] Starting Vite dev server...
echo.
echo   URL for you:       http://localhost:%PORT%
echo   URL for colleagues: http://%COMPUTERNAME%:%PORT%
echo   Requires port %PORT% open in Windows Firewall for LAN access.
echo.
echo   Stop the server: press Ctrl+C in this window or close the window.
echo   For a repeat demo press "R" in the console - data resets to initial state.
echo.

start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:%PORT%"

call npx vite --host --port %PORT% --strictPort

echo.
echo Server stopped.
pause
endlocal
