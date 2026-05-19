@echo off
REM ============================================================
REM Agente CEO (Geraldo) - Linques
REM Roda todo Sabado as 02:00 via Task Scheduler
REM ============================================================
cd /d "%~dp0.."

REM Carrega .env.local para o ambiente
for /f "usebackq eol=# tokens=1,* delims==" %%a in (".env.local") do (
  if not "%%a"=="" set "%%a=%%b"
)

if not defined AGENT_DURATION set AGENT_DURATION=30

echo [%date% %time%] Iniciando CEO Agent Linques (duracao: %AGENT_DURATION% min)

set OUTFILE=%TEMP%\linques-ceo-agent.json
claude --dangerously-skip-permissions --print --output-format json "Leia o arquivo .claude/agent-ceo.md e execute as instrucoes do agente CEO. Tempo disponivel: %AGENT_DURATION% minutos. Analise a semana, planeje a proxima e envie o relatorio." > "%OUTFILE%"

set EXIT_CODE=%errorlevel%
echo [%date% %time%] CEO Agent finalizado (exit %EXIT_CODE%)

node scripts/record-usage.mjs ceo_agent "%OUTFILE%" %EXIT_CODE%

if not %EXIT_CODE%==0 (
  echo Erro detectado, enviando alerta Telegram...
  node scripts/notify-failure.mjs ceo_agent %EXIT_CODE%
)
