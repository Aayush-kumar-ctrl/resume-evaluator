@echo off
echo Starting Backend...
start cmd /k "cd backend && node index.js"

timeout /t 2

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"
