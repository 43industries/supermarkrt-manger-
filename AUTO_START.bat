@echo off
echo ========================================
echo  Supermarket System - Auto Start
echo ========================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM Check for Node.js
echo [1/4] Checking Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Node.js not found in PATH!
    echo.
    echo Trying alternative location...
    if exist "C:\Program Files\nodejs\node.exe" (
        set "NODE_PATH=C:\Program Files\nodejs"
        set "NPM_PATH=C:\Program Files\nodejs\npm.cmd"
        echo Found Node.js at: C:\Program Files\nodejs
    ) else (
        echo.
        echo ERROR: Node.js is not installed!
        echo Please install Node.js from: https://nodejs.org/
        echo.
        pause
        exit /b 1
    )
) else (
    set "NODE_PATH=node"
    set "NPM_PATH=npm"
    echo Node.js found!
)

echo.

REM Check if dependencies are installed
echo [2/4] Checking dependencies...
if not exist "node_modules\express" (
    echo Dependencies not found. Installing...
    echo This may take 2-5 minutes (especially sqlite3 compilation)...
    echo.
    call "%NPM_PATH%" install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ERROR: Failed to install dependencies!
        echo Please check the error messages above.
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
) else (
    echo Dependencies already installed!
)

echo.

REM Check for missing critical dependencies
echo [3/4] Verifying critical dependencies...
if not exist "node_modules\express" (
    echo Installing Express...
    call "%NPM_PATH%" install express
)
if not exist "node_modules\sqlite3" (
    echo Installing SQLite3...
    call "%NPM_PATH%" install sqlite3
)
if not exist "node_modules\cors" (
    echo Installing CORS...
    call "%NPM_PATH%" install cors
)

echo.
echo [4/4] Starting server...
echo.
echo ========================================
echo  SERVER STARTING
echo ========================================
echo.
echo Server will be available at:
echo   Local:    http://localhost:3000
echo   Network:  http://[YOUR-IP]:3000
echo.
echo Open your browser to: http://localhost:3000/app.html
echo.
echo Login credentials:
echo   Username: admin
echo   Password: admin123
echo.
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
"%NODE_PATH%" server.js

pause

