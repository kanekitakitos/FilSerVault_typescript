@echo off

start pw /c "cd server  && npm run dev"

start pw /c "cd client && npm run prod"