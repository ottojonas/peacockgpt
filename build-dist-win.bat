@echo off

REM Check if running with administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running with administrator privileges
) else (
    echo Please run this script as Administrator
    echo Right-click the batch file and select "Run as administrator"
    pause
    exit /b 1
)

REM Check Docker service
echo Checking Docker service...
sc query docker >nul 2>&1
if %errorLevel% == 1060 (
    echo Docker service not found. Please ensure Docker Desktop is installed.
    pause
    exit /b 1
)

REM Start Docker service if it's not running
net start docker 2>nul
timeout /t 5 /nobreak

echo Starting Docker containers...
docker-compose up -d

REM Wait for services to be ready
timeout /t 10 /nobreak

REM Build and start the frontend
cd frontend
echo Installing frontend dependencies...
call npm install
echo Building frontend...
call npm run build
echo Creating Windows distribution...
call npm run electron-dist:win

echo Build process completed!
pause 