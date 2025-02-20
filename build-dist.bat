@echo off
cd frontend
call npm install
call npm run build
call npm run electron-dist 