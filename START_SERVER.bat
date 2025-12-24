@echo off
echo ========================================
echo  Supermarket Management System
echo  Starting Database Server...
echo ========================================
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules\" (
    echo Installing dependencies...
    echo This may take 2-5 minutes. Please wait...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: Failed to install dependencies!
        echo Try running: FIX_AND_START.bat
        pause
        exit /b 1
    )
    echo.
)

REM Verify critical dependencies exist
if not exist "node_modules\express" (
    echo Express missing! Installing...
    call npm install express cors sqlite3
)

echo Starting server on http://localhost:3000
echo.
echo ========================================
echo  MULTI-DEVICE ACCESS
echo ========================================
echo.
echo This server can be accessed from multiple devices!
echo.
echo On THIS computer, open:
echo   http://localhost:3000/app.html
echo.
echo On OTHER devices (phones, tablets, other computers):
echo   1. Make sure they're on the same WiFi network
echo   2. Find your computer's IP address (shown when server starts)
echo   3. Open: http://[YOUR-IP]:3000/app.html
echo.
echo Example: http://192.168.1.100:3000/app.html
echo.
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo  PERFORMANCE OPTIMIZATION
echo ========================================
echo Using optimized settings for better performance
echo Memory limit: 1.5GB (for systems with 4GB+ RAM)
echo.
echo For older hardware (4GB RAM), use: START_OPTIMIZED.bat
echo ========================================
echo.

REM Start with memory optimization for older hardware
node --max-old-space-size=1536 server.js

pause

