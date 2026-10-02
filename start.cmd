@echo off
title Lumina Journal — Personal Blogging Platform
color 0A

echo ===================================================
echo     Starting Lumina Journal Editorial Studio
echo ===================================================
echo.

cd /d "%~dp0"

if not exist "node_modules\" (
    echo [1/3] Installing dependencies, please wait...
    call npm install
) else (
    echo [1/3] Dependencies verified.
)

echo [2/3] Starting local development server...
start "" http://localhost:3000/

echo [3/3] Launching Lumina Journal in your browser...
echo.
echo ---------------------------------------------------
echo  Server running at: http://localhost:3000/
echo  Press Ctrl+C to stop the server.
echo ---------------------------------------------------
echo.

call npm run dev
pause
