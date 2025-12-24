@echo off
echo ========================================
echo  Fix Dependencies and Start Server
echo ========================================
echo.

cd /d "%~dp0"

REM Use full path to npm if node not in PATH
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"
    set "NODE_CMD=C:\Program Files\nodejs\node.exe"
) else (
    set "NPM_CMD=npm"
    set "NODE_CMD=node"
)

echo Step 1: Cleaning old dependencies...
if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules 2>nul
)

if exist package-lock.json (
    del package-lock.json 2>nul
)

echo.
echo Step 2: Installing all dependencies...
echo This will take 2-5 minutes. Please wait...
echo.

call "%NPM_CMD%" install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Installation failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo Step 3: Verifying installation...
if not exist "node_modules\express" (
    echo ERROR: Express not installed!
    pause
    exit /b 1
)
if not exist "node_modules\sqlite3" (
    echo ERROR: SQLite3 not installed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  Installation Complete!
echo ========================================
echo.
echo Starting server...
echo.

"%NODE_CMD%" server.js

pause

