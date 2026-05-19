# Runbook — Troubleshooting dos Agentes Linques

## Agente não rodou no horário

**Sintoma**: Watchdog alerta que Dev ou CEO Agent não rodou.

**Causas comuns**:
1. PC estava desligado às 02:00
2. Claude Code sem créditos ou token expirado
3. Task Scheduler desabilitou a task

**Diagnóstico**:
```powershell
# Ver status das tasks
Get-ScheduledTask -TaskName "Linques*" | Format-Table TaskName, State, LastRunTime, LastTaskResult

# Ver histórico de execução
Get-ScheduledTaskInfo -TaskName "Linques Dev Agent"
```

**Resolução**:
- Se PC desligado: rode manualmente `scripts\run-dev-agent.bat`
- Se sem créditos: verificar assinatura Claude Code
- Se task desabilitada: `Enable-ScheduledTask -TaskName "Linques Dev Agent"`

## Telegram não envia

**Sintoma**: Scripts rodam mas mensagem não chega.

**Diagnóstico**:
```bash
node scripts/telegram.mjs "teste"
```

**Causas comuns**:
1. `TELEGRAM_BOT_TOKEN` ou `TELEGRAM_CHAT_ID` não está no `.env.local`
2. Bot foi bloqueado ou token revogado
3. Sem internet

## Notion MCP não funciona

**Sintoma**: Agente não consegue ler/escrever cards no Notion.

**Causas comuns**:
1. Notion MCP não está configurado no Claude Code
2. Token do Notion expirou
3. Database foi movida ou renomeada

**Resolução**:
- Verificar se o Notion MCP aparece nas ferramentas disponíveis do Claude Code
- Testar manualmente: abrir Claude Code e tentar `Notion:search`

## Supabase falha ao logar

**Sintoma**: `supabase-agent.mjs` retorna erro de credencial.

**Diagnóstico**:
```bash
# Carregar env vars primeiro
node scripts/supabase-agent.mjs logs 1
```

**Causas comuns**:
1. `SUPABASE_SERVICE_ROLE_KEY` ausente ou errada no `.env.local`
2. Tabelas `activity_logs`/`agent_usage` não existem (migration não rodou)

## Testar manualmente

```powershell
# Dev Agent
scripts\run-dev-agent.bat

# CEO Agent
scripts\run-ceo-agent.bat

# Watchdog
scripts\run-watchdog.bat

# Ou via Task Scheduler
schtasks /Run /TN "Linques Dev Agent"
schtasks /Run /TN "Linques CEO Agent"
schtasks /Run /TN "Linques Watchdog"
```
