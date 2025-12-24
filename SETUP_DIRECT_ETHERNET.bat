@echo off
REM Setup script for direct Ethernet connection between two machines
REM This configures Machine 1 (Server) with static IP for direct Ethernet

echo ========================================
echo DIRECT ETHERNET CONNECTION SETUP
echo Machine 1 (Server) Configuration
echo ========================================
echo.
echo This script will configure Machine 1 for direct Ethernet
echo connection with Machine 2 (no router needed).
echo.
echo Press any key to continue...
pause >nul

echo.
echo ========================================
echo STEP 1: Checking Administrator Rights
echo ========================================
echo.

net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] ERROR: This script must be run as Administrator!
    echo.
    echo Please:
    echo 1. Right-click this file
    echo 2. Select "Run as administrator"
    echo 3. Run again
    echo.
    pause
    exit /b 1
)

echo [OK] Running as Administrator

echo.
echo ========================================
echo STEP 2: Finding Ethernet Adapter
echo ========================================
echo.

echo Listing network adapters...
echo.
netsh interface show interface
echo.

set /p ADAPTER_NAME="Enter your Ethernet adapter name (e.g., 'Ethernet' or 'Local Area Connection'): "

echo.
echo Using adapter: %ADAPTER_NAME%
echo.

echo ========================================
echo STEP 3: Configuring Static IP Address
echo ========================================
echo.

echo Setting static IP address for Machine 1 (Server):
echo   IP Address: 192.168.1.100
echo   Subnet Mask: 255.255.255.0
echo.

netsh interface ip set address name="%ADAPTER_NAME%" static 192.168.1.100 255.255.255.0

if %ERRORLEVEL% EQU 0 (
    echo [OK] IP address configured successfully
) else (
    echo [X] Failed to configure IP address
    echo.
    echo Please check:
    echo - Adapter name is correct
    echo - Ethernet cable is connected
    echo - Adapter is enabled
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo STEP 4: Verifying Configuration
echo ========================================
echo.

echo Current IP configuration:
ipconfig | findstr /i "%ADAPTER_NAME%" /A /B 2
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set ip=%%a
    setlocal enabledelayedexpansion
    set ip=!ip:~1!
    echo Detected IP: !ip!
    if "!ip!"=="192.168.1.100" (
        echo [OK] IP address configured correctly
    ) else (
        echo [WARNING] IP address may not be correct
    )
    endlocal
)

echo.
echo ========================================
echo STEP 5: Configuring Firewall
echo ========================================
echo.

echo Adding firewall rule to allow connections on port 3000...
netsh advfirewall firewall delete rule name="Node.js Server" >nul 2>&1
netsh advfirewall firewall add rule name="Node.js Server" dir=in action=allow protocol=TCP localport=3000

if %ERRORLEVEL% EQU 0 (
    echo [OK] Firewall rule added successfully
) else (
    echo [WARNING] Could not add firewall rule
)

echo.
echo ========================================
echo STEP 6: Testing Connection
echo ========================================
echo.

echo Configuration complete!
echo.
echo Next steps:
echo.
echo 1. Connect Ethernet cable between the two machines
echo.
echo 2. On Machine 2 (Client), configure static IP:
echo    - IP Address: 192.168.1.101
echo    - Subnet Mask: 255.255.255.0
echo    - Gateway: (leave empty)
echo    - DNS: (leave empty)
echo.
echo 3. On Machine 2, test connection:
echo    ping 192.168.1.100
echo.
echo 4. Start server on Machine 1:
echo    START_OPTIMIZED.bat
echo.
echo 5. On Machine 2, open browser:
echo    http://192.168.1.100:3000/app.html
echo.
echo ========================================
echo CURRENT CONFIGURATION:
echo ========================================
echo.
echo Machine 1 (Server): 192.168.1.100
echo Machine 2 (Client): 192.168.1.101 (configure manually)
echo Subnet Mask: 255.255.255.0
echo Server URL: http://192.168.1.100:3000/app.html
echo.
echo ========================================
echo.

pause

