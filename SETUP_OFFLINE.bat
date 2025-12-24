@echo off
REM Setup script for offline operation - Downloads CDN resources locally
echo ========================================
echo OFFLINE SETUP - Mini Mart System
echo ========================================
echo.
echo This script will download all required resources
echo for offline operation (one-time setup).
echo.
echo NOTE: This initial download requires internet connection.
echo After this, the system works completely offline!
echo.
pause

cd /d "%~dp0"

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    echo.
    echo IMPORTANT: Download Node.js installer for offline installation:
    echo 1. Download from: https://nodejs.org/
    echo 2. Save installer file (can be installed offline later)
    pause
    exit /b 1
)

echo.
echo Step 1: Downloading offline resources...
echo This may take 1-2 minutes...
echo.

node download-offline-resources.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to download resources
    echo Please check your internet connection and try again
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 2: Verifying files...
echo ========================================
echo.

if exist "libs\react.production.min.js" (
    echo [OK] React library
) else (
    echo [ERROR] React library missing!
)

if exist "libs\react-dom.production.min.js" (
    echo [OK] ReactDOM library
) else (
    echo [ERROR] ReactDOM library missing!
)

if exist "libs\babel.min.js" (
    echo [OK] Babel library
) else (
    echo [ERROR] Babel library missing!
)

if exist "libs\tailwindcss.min.js" (
    echo [OK] Tailwind CSS library
) else (
    echo [ERROR] Tailwind CSS library missing!
)

echo.
echo ========================================
echo OFFLINE SETUP COMPLETE!
echo ========================================
echo.
echo Your system is now ready for OFFLINE use!
echo.
echo Next steps:
echo 1. Install Node.js (if not already installed)
echo 2. Run: npm install (requires internet for first time only)
echo 3. After npm install, everything works OFFLINE!
echo 4. Start server: START_OPTIMIZED.bat
echo.
echo The system will work completely offline after initial setup.
echo.
pause

