@echo off
echo ========================================
echo  Simple HTTP Server for Supermarket App
echo ========================================
echo.

REM Check for Python
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting Python HTTP server...
    echo.
    echo Open your browser to: http://localhost:8000/test-app.html
    echo.
    echo Press Ctrl+C to stop the server
    echo ========================================
    echo.
    python -m http.server 8000
    goto :end
)

REM Check for Node.js serve
where npx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting Node.js serve...
    echo.
    echo Open your browser to: http://localhost:3000/test-app.html
    echo.
    echo Press Ctrl+C to stop the server
    echo ========================================
    echo.
    npx serve -p 3000
    goto :end
)

echo ERROR: Neither Python nor Node.js found!
echo.
echo Please install one of the following:
echo 1. Python 3 (https://www.python.org/downloads/)
echo 2. Node.js (https://nodejs.org/)
echo.
pause
exit /b 1

:end
pause

