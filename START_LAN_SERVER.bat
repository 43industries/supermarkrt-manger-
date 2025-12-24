@echo off
title LAN Server - Supermarket POS System
color 0A

echo ============================================================================
echo                     LAN SERVER - SUPERMARKET POS SYSTEM
echo ============================================================================
echo.
echo This server allows all computers on your local network to share data.
echo No internet connection needed - works with Ethernet cables only!
echo.
echo ============================================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Check if LAN_SERVER.js exists
if not exist "LAN_SERVER.js" (
    echo ERROR: LAN_SERVER.js not found!
    echo.
    pause
    exit /b 1
)

echo Starting LAN Server...
echo.
echo IMPORTANT:
echo - Make sure all computers are connected to the same network
echo - Use Ethernet cables for best performance
echo - Share the IP address shown below with other computers
echo.
echo ============================================================================
echo.

REM Start the server
node LAN_SERVER.js

REM If server stops, show error
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ============================================================================
    echo ERROR: Server stopped unexpectedly!
    echo ============================================================================
    echo.
    pause
)

