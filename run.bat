@echo off
setlocal enabledelayedexpansion
title Lumina Journal — Universal 1-Click Launcher
color 0B

echo ================================================================
echo           LUMINA JOURNAL — EDITORIAL BLOGGING PLATFORM
echo ================================================================
echo.

:: 1. Navigate to project root directory
cd /d "%~dp0"

:: 2. Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    :: Check common Node install paths if not in PATH
    if exist "C:\Program Files\nodejs\node.exe" (
        set "PATH=C:\Program Files\nodejs;%PATH%"
    ) else if exist "%LocalAppData%\Programs\nodejs\node.exe" (
        set "PATH=%LocalAppData%\Programs\nodejs;%PATH%"
    ) else (
        echo [!] Node.js was not detected on this computer.
        echo.
        echo Attempting to install Node.js automatically via Windows Package Manager...
        winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
        if %errorlevel% neq 0 (
            echo.
            echo [X] Could not auto-install Node.js. Opening official download page...
            start "" "https://nodejs.org/en/download"
            echo Please install Node.js LTS and run this file again.
            pause
            exit /b 1
        )
        set "PATH=C:\Program Files\nodejs;%PATH%"
    )
)

:: 3. Check for node_modules and install if first run on new laptop
if not exist "node_modules\" (
    echo [*] First-time setup detected on this computer.
    echo [*] Installing required packages and dependencies, please wait...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [X] Installation failed. Please check internet connection.
        pause
        exit /b 1
    )
    echo [*] Installation complete!
    echo.
) else (
    echo [*] Dependencies verified.
)

:: 4. Launch browser and dev server
echo [*] Starting Lumina Journal Studio...
echo.
echo ----------------------------------------------------------------
echo   Local Address:   http://localhost:3000/
echo   Network Access:  http://0.0.0.0:3000/ (Accessible on same WiFi)
echo ----------------------------------------------------------------
echo.

:: Open browser automatically after a short 1 second delay
start "" powershell -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000/'"

:: Start Vite dev server
call npm run dev

pause
