@echo off
echo ========================================
echo  Starting Localhost Server
echo ========================================
echo.
echo Server starting on: http://localhost:8000
echo.
echo Open your browser to:
echo   http://localhost:8000/test-app.html
echo.
echo Login: admin / admin123
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Try different Python locations
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    python -m http.server 8000
) else if exist "C:\Users\%USERNAME%\AppData\Local\Microsoft\WindowsApps\python.exe" (
    "C:\Users\%USERNAME%\AppData\Local\Microsoft\WindowsApps\python.exe" -m http.server 8000
) else if exist "C:\Python*\python.exe" (
    for /d %%i in (C:\Python*) do "%%i\python.exe" -m http.server 8000
) else (
    echo ERROR: Python not found!
    echo Please make sure Python is installed and in PATH
    pause
    exit /b 1
)

pause

