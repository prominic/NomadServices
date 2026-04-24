@echo off
REM Start the Jekyll dev server for the nomad.services site.
REM Serves http://127.0.0.1:4000/ with live-reload on file save.
REM Press Ctrl+C in this window to stop, or run stop-server.bat.

setlocal
set "PATH=C:\Ruby33-x64\bin;%PATH%"
cd /d "%~dp0"

echo.
echo === Jekyll dev server ===
echo Site:      http://127.0.0.1:4000/
echo LiveReload: http://127.0.0.1:35729/
echo Project:   %CD%
echo.

call bundle exec jekyll serve --livereload --port 4000 --host 127.0.0.1

echo.
echo Server exited.
pause
endlocal
