@echo off
title Lumina Journal — Personal Blogging Platform
color 0A

echo ===================================================
echo     Starting Lumina Journal Editorial Studio
echo ===================================================
echo.

:: Change directory to current script location
cd /d "%~dp0"

:: Check if node_modules exists, if not install
if not exist "node_modules\" (
    echo [1/3] Installing dependencies, please wait...
    call npm install
) else (
    echo [1/3] Dependencies verified.
)

echo [2/3] Starting local development server...
start "" http://localhost:3000/

echo [3/3] Launching Lumina Journal...
echo.
echo ---------------------------------------------------
echo  Server running at: http://localhost:3000/
echo  Press Ctrl+C in this window to stop the server.
echo ---------------------------------------------------
echo.

call npm run dev
pause
