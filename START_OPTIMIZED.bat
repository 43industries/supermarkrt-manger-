@echo off
REM Optimized startup script for older hardware (4GB RAM systems)
echo ========================================
echo Supermarket System - Optimized for Older Hardware
echo ========================================
echo.
echo Detected: Intel i5-2400 / 4GB RAM System
echo Optimizations: Memory limits, reduced cache sizes
echo.
cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if offline resources are downloaded
if not exist "libs\" (
    echo.
    echo WARNING: Offline resources not found!
    echo.
    echo For full offline operation, run: SETUP_OFFLINE.bat
    echo (Requires internet for one-time download)
    echo.
    echo The system will work, but will try to load from CDN.
    echo.
    timeout /t 3 /nobreak >nul
)

REM Check if dependencies are installed
if not exist "node_modules\" (
    echo Installing dependencies...
    echo NOTE: This requires internet connection (first time only)
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting optimized server for older hardware...
echo Memory limit: 1.5GB (configured for 4GB RAM system)
echo Database cache: 8MB (optimized for limited RAM)
echo.
echo Server will be available at:
echo   Local:    http://localhost:3000
echo   Network:  http://YOUR_IP:3000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start server with memory optimizations
node --max-old-space-size=1536 server.js

pause

