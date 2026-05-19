# ============================================================
# Setup das tasks agendadas para os agentes do Linques
# Execute como Administrador na pasta do projeto:
#   PowerShell > Run as Administrator
#   > cd C:\Users\davin\OneDrive\link-me
#   > .\scripts\setup-tasks.ps1
# ============================================================

$ProjectDir = (Resolve-Path "$PSScriptRoot\..").Path
$DevBat = Join-Path $ProjectDir "scripts\run-dev-agent.bat"
$CeoBat = Join-Path $ProjectDir "scripts\run-ceo-agent.bat"
$WatchdogBat = Join-Path $ProjectDir "scripts\run-watchdog.bat"

Write-Host "Projeto: $ProjectDir" -ForegroundColor Cyan

# -----------------------------------------------------------
Write-Host "Criando task: Linques Dev Agent (Seg-Sex + Dom as 2h)..." -ForegroundColor Cyan

$devAction = New-ScheduledTaskAction `
  -Execute "cmd.exe" `
  -Argument "/c `"$DevBat`"" `
  -WorkingDirectory $ProjectDir

$devTrigger = New-ScheduledTaskTrigger -Weekly `
  -DaysOfWeek Monday,Tuesday,Wednesday,Thursday,Friday,Sunday `
  -At "02:00"

$devSettings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 35)

Register-ScheduledTask `
  -TaskName "Linques Dev Agent" `
  -Action $devAction `
  -Trigger $devTrigger `
  -Settings $devSettings `
  -Description "Agente desenvolvedor Linques (Leopoldo) - Seg-Sex+Dom as 2h, 30min" `
  -Force

Write-Host "OK: Linques Dev Agent criado!" -ForegroundColor Green

# -----------------------------------------------------------
Write-Host "Criando task: Linques CEO Agent (sabados as 2h)..." -ForegroundColor Cyan

$ceoAction = New-ScheduledTaskAction `
  -Execute "cmd.exe" `
  -Argument "/c `"$CeoBat`"" `
  -WorkingDirectory $ProjectDir

$ceoTrigger = New-ScheduledTaskTrigger -Weekly `
  -DaysOfWeek Saturday `
  -At "02:00"

$ceoSettings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 35)

Register-ScheduledTask `
  -TaskName "Linques CEO Agent" `
  -Action $ceoAction `
  -Trigger $ceoTrigger `
  -Settings $ceoSettings `
  -Description "Agente CEO Linques (Geraldo) - sabados as 2h, relatorio semanal" `
  -Force

Write-Host "OK: Linques CEO Agent criado!" -ForegroundColor Green

# -----------------------------------------------------------
Write-Host "Criando task: Linques Watchdog (diario as 9h)..." -ForegroundColor Cyan

$wdAction = New-ScheduledTaskAction `
  -Execute "cmd.exe" `
  -Argument "/c `"$WatchdogBat`"" `
  -WorkingDirectory $ProjectDir

$wdTrigger = New-ScheduledTaskTrigger -Daily -At "09:00"

$wdSettings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -ExecutionTimeLimit (New-TimeSpan -Minutes 5)

Register-ScheduledTask `
  -TaskName "Linques Watchdog" `
  -Action $wdAction `
  -Trigger $wdTrigger `
  -Settings $wdSettings `
  -Description "Watchdog do Linques - verifica execucoes e alerta via Telegram" `
  -Force

Write-Host "OK: Linques Watchdog criado!" -ForegroundColor Green

# -----------------------------------------------------------
Write-Host ""
Write-Host "Tasks criadas com sucesso! Verifique no Agendador de Tarefas." -ForegroundColor Yellow
Write-Host "  - Linques Dev Agent:  Seg-Sex+Dom as 2h (30min)"
Write-Host "  - Linques CEO Agent:  Sabados as 2h"
Write-Host "  - Linques Watchdog:   Todo dia as 9h"
Write-Host ""
Write-Host "Para testar manualmente:"
Write-Host '  schtasks /Run /TN "Linques Dev Agent"'
Write-Host '  schtasks /Run /TN "Linques CEO Agent"'
Write-Host '  schtasks /Run /TN "Linques Watchdog"'

Read-Host "Pressione Enter para fechar"
