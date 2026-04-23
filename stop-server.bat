@echo off
REM Stop the Jekyll dev server by killing whatever process tree
REM is listening on port 4000.

setlocal enabledelayedexpansion
set "PORT=4000"
set "FOUND="

for /f "tokens=5" %%p in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
  set "FOUND=%%p"
)

if defined FOUND (
  echo Stopping Jekyll server: PID !FOUND! on port %PORT%
  taskkill /F /T /PID !FOUND!
) else (
  echo No process is listening on port %PORT%.
)

endlocal
pause
