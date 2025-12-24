@echo off
REM Setup script for two-machine configuration
REM This helps configure Machine 1 (Server) for network access

echo ========================================
echo TWO-MACHINE SETUP - Configuration Tool
echo ========================================
echo.
echo This script will help you set up Machine 1 (Server)
echo so that Machine 2 can connect to it.
echo.
echo Press any key to continue...
pause >nul

echo.
echo ========================================
echo STEP 1: Checking Node.js Installation
echo ========================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js is NOT installed
    echo.
    echo Please install Node.js first:
    echo 1. Go to: https://nodejs.org/
    echo 2. Download LTS version (16.x or 18.x)
    echo 3. Run installer
    echo 4. Restart computer
    echo 5. Run this script again
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
    node --version
)

echo.
echo ========================================
echo STEP 2: Checking Dependencies
echo ========================================
echo.

cd /d "%~dp0"

if not exist "node_modules\" (
    echo [X] Dependencies not installed
    echo.
    echo Installing dependencies...
    echo This may take 2-5 minutes. Please wait...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [X] Failed to install dependencies!
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully
) else (
    echo [OK] Dependencies are installed
)

echo.
echo ========================================
echo STEP 3: Configuring Firewall
echo ========================================
echo.

echo Adding firewall rule to allow connections on port 3000...
echo This requires Administrator privileges.
echo.

REM Check if running as admin
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Not running as Administrator
    echo.
    echo To allow other machines to connect, you need to:
    echo 1. Right-click this file
    echo 2. Select "Run as administrator"
    echo 3. Run this script again
    echo.
    echo OR manually run this command in Administrator Command Prompt:
    echo netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3000
    echo.
) else (
    echo [OK] Running as Administrator
    echo.
    echo Adding firewall rule...
    netsh advfirewall firewall delete rule name="Node.js Server" >nul 2>&1
    netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3000
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Firewall rule added successfully
    ) else (
        echo [WARNING] Could not add firewall rule automatically
        echo You may need to add it manually
    )
)

echo.
echo ========================================
echo STEP 4: Finding Your IP Address
echo ========================================
echo.

echo Your IP address(es) on this network:
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set ip=%%a
    setlocal enabledelayedexpansion
    set ip=!ip:~1!
    echo   http://!ip!:3000/app.html
    endlocal
)

echo.
echo ========================================
echo STEP 5: Starting Server
echo ========================================
echo.

echo Configuration complete!
echo.
echo Next steps:
echo 1. Note your IP address above
echo 2. Server will start in 5 seconds...
echo 3. On Machine 2, open: http://[YOUR-IP]:3000/app.html
echo.
echo Press Ctrl+C to cancel, or wait 5 seconds...
timeout /t 5 /nobreak >nul

echo.
echo Starting optimized server...
echo.
echo ========================================
echo SERVER STARTING
echo ========================================
echo.
echo Keep this window open!
echo.
echo On Machine 2, open:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set ip=%%a
    setlocal enabledelayedexpansion
    set ip=!ip:~1!
    echo   http://!ip!:3000/app.html
    endlocal
    goto :found_ip
)
:found_ip
echo.
echo ========================================
echo.

REM Start server with optimizations
node --max-old-space-size=1536 server.js

pause

