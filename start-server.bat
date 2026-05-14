@echo off
REM Start the Jekyll dev server for the nomad.services site.
REM Serves https://127.0.0.1:4000/ — manual browser refresh on save
REM (Jekyll's --livereload is incompatible with --ssl-cert; the
REM LiveReload websocket doesn't support WSS).
REM Press Ctrl+C in this window to stop, or run stop-server.bat.
REM
REM Requires a self-signed dev cert (dev-cert.pem / dev-key.pem) in
REM this directory. Run setup-https.bat once to generate them.

setlocal
set "PATH=C:\Ruby33-x64\bin;%PATH%"
cd /d "%~dp0"

if not exist "dev-cert.pem" goto :no_cert
if not exist "dev-key.pem" goto :no_cert

echo.
echo === Jekyll dev server ===
echo Site:    https://127.0.0.1:4000/
echo Project: %CD%
echo.
echo Browser will warn about the self-signed cert the first time.
echo Click "Advanced" -^> "Proceed to 127.0.0.1 (unsafe)".
echo Refresh the browser manually after saving files (no live-reload over HTTPS).
echo.

call bundle exec jekyll serve --port 4000 --host 127.0.0.1 --ssl-cert dev-cert.pem --ssl-key dev-key.pem

echo.
echo Server exited.
goto :end

:no_cert
echo.
echo HTTPS cert not found in this directory.
echo Run setup-https.bat once to generate dev-cert.pem and dev-key.pem.
echo.

:end
pause
endlocal
