@echo off
REM ============================================================
REM Agente Desenvolvedor (Leopoldo) - Linques
REM Roda Seg-Sex + Dom as 02:00 via Task Scheduler
REM ============================================================
cd /d "%~dp0.."

REM Carrega .env.local para o ambiente
for /f "usebackq eol=# tokens=1,* delims==" %%a in (".env.local") do (
  if not "%%a"=="" set "%%a=%%b"
)

if not defined AGENT_DURATION set AGENT_DURATION=30

echo [%date% %time%] Iniciando Dev Agent Linques (duracao: %AGENT_DURATION% min)

set OUTFILE=%TEMP%\linques-dev-agent.json
claude --dangerously-skip-permissions --print --output-format json "Leia o arquivo .claude/agent-dev.md e execute as instrucoes do agente desenvolvedor. Tempo disponivel: %AGENT_DURATION% minutos. Trabalhe nos cards do kanban (via Notion MCP) ate o tempo acabar." > "%OUTFILE%"

set EXIT_CODE=%errorlevel%
echo [%date% %time%] Dev Agent finalizado (exit %EXIT_CODE%)

node scripts/record-usage.mjs dev_agent "%OUTFILE%" %EXIT_CODE%

if not %EXIT_CODE%==0 (
  echo Erro detectado, enviando alerta Telegram...
  node scripts/notify-failure.mjs dev_agent %EXIT_CODE%
)
