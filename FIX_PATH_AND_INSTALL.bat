@echo off
echo ========================================
echo  Fixing PATH and Installing Dependencies
echo ========================================
echo.

cd /d "%~dp0"

REM Add Node.js to PATH for this session
set "PATH=C:\Program Files\nodejs;%PATH%"

echo Step 1: Cleaning old installation...
if exist node_modules (
    rmdir /s /q node_modules 2>nul
)
del /f /q package-lock.json 2>nul

echo.
echo Step 2: Installing dependencies with Node.js in PATH...
echo This will take 2-5 minutes. Please wait...
echo.

call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Installation failed!
    echo Check the error messages above.
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

call node server.js

pause

