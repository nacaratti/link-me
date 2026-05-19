@echo off
REM ============================================================
REM Watchdog - Linques (verifica se agentes rodaram)
REM ============================================================
cd /d "%~dp0.."

for /f "usebackq eol=# tokens=1,* delims==" %%a in (".env.local") do (
  if not "%%a"=="" set "%%a=%%b"
)

echo [%date% %time%] Watchdog Linques iniciando...
node scripts/agent-watchdog.mjs
echo [%date% %time%] Watchdog finalizado (exit %errorlevel%)
