@echo off

REM Build and start the backend 
cd backend 
echo Installing backend dependencies...
call pip install -r requirements.txt
echo Starting backend 
call python -m app.main 
cd .. 

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
