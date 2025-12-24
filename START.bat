@echo off
echo ========================================
echo Starting Supermarket Management System
echo ========================================
echo.
echo Opening web server...
echo.
cd /d "%~dp0"
echo Server will start on: http://localhost:8000
echo.
echo Open your browser and go to:
echo http://localhost:8000/index.html
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.
python -m http.server 8000
pause

