@echo off
REM ============================================================
REM create-dev-artifact.bat
REM
REM Build the Jekyll site fresh and package the deployable files
REM from _site\ into nomad-services-artifact.zip in this
REM directory. Any existing zip with that name is removed first.
REM
REM Items included in the archive (edit the array in the
REM PowerShell line below to change what gets packaged):
REM     assets\
REM     index.html
REM     sitemap.xml
REM     robots.txt
REM ============================================================

setlocal
set "PATH=C:\Ruby33-x64\bin;%PATH%"
cd /d "%~dp0"

set "ZIPNAME=nomad-services-artifact.zip"
set "ZIPPATH=%~dp0%ZIPNAME%"

if exist "%ZIPNAME%" (
  echo Removing existing %ZIPNAME%
  del /q "%ZIPNAME%"
)

echo.
echo === Cleaning previous build ===
call bundle exec jekyll clean

echo.
echo === Building Jekyll site ===
call bundle exec jekyll build
if errorlevel 1 (
  echo.
  echo Build failed. Aborting archive.
  goto :end
)

echo.
echo === Rewriting asset paths in index.html for portable deployment ===
REM Jekyll emits absolute asset references (href="/assets/...",
REM src="/assets/...") which only work at the document root. Strip the
REM leading slash so the references resolve relative to wherever
REM index.html ends up being served from. .NET WriteAllText is used to
REM avoid a UTF-8 BOM, which some servers serve with the wrong content
REM type if present at the start of an HTML file.
powershell -NoProfile -Command "$p = (Resolve-Path '_site\index.html').Path; $c = (Get-Content -Raw $p) -replace '=\"/assets/', '=\"assets/'; [System.IO.File]::WriteAllText($p, $c)"

echo.
echo === Creating archive: %ZIPNAME% ===
REM Push-Location into _site so the paths stored inside the zip are
REM relative (assets/, index.html, ...) rather than _site/assets/, etc.
REM Compress-Archive ships with PowerShell 5+, which is standard on
REM Windows 10+.
powershell -NoProfile -Command "Push-Location '_site'; $items = @('assets','index.html','launching.html','sitemap.xml','robots.txt') | Where-Object { Test-Path $_ }; if ($items.Count -eq 0) { Write-Host 'Nothing to archive - _site is empty or items missing.'; Pop-Location; exit 1 }; Compress-Archive -Path $items -DestinationPath '%ZIPPATH%' -Force; Pop-Location"

if exist "%ZIPNAME%" (
  echo.
  echo Done: %ZIPNAME%
  echo Upload the contents of this zip to the web server's document root.
) else (
  echo.
  echo Archive creation failed.
)

:end
endlocal
