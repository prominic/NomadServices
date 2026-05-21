@echo off
REM One-time setup: generate a self-signed dev cert for serving the site
REM over HTTPS at https://127.0.0.1:4000/.
REM
REM The cert is NOT trusted by Windows or the browser — you'll see a
REM "Your connection is not private" warning the first time you load
REM the site. Click "Advanced" -> "Proceed to 127.0.0.1 (unsafe)".
REM Chrome/Edge remember the override per-domain for the session.
REM
REM Cert is valid for 365 days. Rerun this script after it expires.

setlocal
cd /d "%~dp0"

if exist "dev-cert.pem" if exist "dev-key.pem" (
  echo Existing cert found:
  echo   dev-cert.pem
  echo   dev-key.pem
  echo Delete both files and rerun this script to regenerate.
  goto :done
)

echo Generating self-signed cert for 127.0.0.1 / localhost...
openssl req -x509 -newkey rsa:2048 -nodes -days 365 ^
  -subj "/CN=127.0.0.1" ^
  -addext "subjectAltName=IP:127.0.0.1,DNS:localhost" ^
  -keyout dev-key.pem -out dev-cert.pem

if errorlevel 1 (
  echo.
  echo openssl failed. Make sure Git for Windows is installed and on PATH
  echo ^(it bundles openssl at C:\Program Files\Git\usr\bin\openssl.exe^).
  goto :done
)

echo.
echo Done. Files created:
echo   dev-cert.pem
echo   dev-key.pem
echo Both are gitignored. Run start-server.bat next.

:done
endlocal
pause
