@echo off
setlocal
pushd "%~dp0"
if errorlevel 1 exit /b 1

where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Instala Node.js y vuelve a intentarlo.
  popd
  exit /b 1
)

node test-local.js
set "EXIT_CODE=%ERRORLEVEL%"
popd
exit /b %EXIT_CODE%
