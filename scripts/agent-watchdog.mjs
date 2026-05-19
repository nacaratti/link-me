import { createClient } from '@supabase/supabase-js';

const SUPA_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_CHAT  = process.env.TELEGRAM_CHAT_ID;

if (!SUPA_URL || !SUPA_KEY) {
  console.error('Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(SUPA_URL, SUPA_KEY);

async function sendTelegram(text) {
  if (!TG_TOKEN || !TG_CHAT) {
    console.warn('Telegram nao configurado — alerta nao enviado');
    console.log(text);
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'Markdown' }),
    });
    const data = await res.json();
    if (!data.ok) console.error('Telegram API:', data.description);
  } catch (err) {
    console.error('Erro ao enviar Telegram:', err.message);
  }
}

function toBRDate(d) {
  return d.toLocaleDateString('pt-BR');
}

async function getLastLog(agent, action) {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('created_at')
    .eq('agent', agent)
    .eq('action', action)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return new Date(data.created_at);
}

const now = new Date();
const today = new Date(now);
today.setHours(0, 0, 0, 0);
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const alerts = [];

// Dev Agent: roda Seg-Sex + Dom (pula sábado). Checar se ontem não era sábado.
const yesterdayDow = yesterday.getDay(); // 0=dom, 6=sab
const devShouldHaveRun = yesterdayDow !== 6; // pula sábado

if (devShouldHaveRun) {
  const devStart = await getLastLog('dev_agent', 'session_started');
  if (!devStart) {
    alerts.push(`⚠️ *Dev Agent (Leopoldo)* — nunca rodou ainda (sem registro no banco).`);
  } else {
    const devStartDay = new Date(devStart);
    devStartDay.setHours(0, 0, 0, 0);
    if (devStartDay < yesterday) {
      const diff = Math.floor((today - devStartDay) / 86400000);
      alerts.push(
        `⚠️ *Dev Agent (Leopoldo)* — última execução foi *${toBRDate(devStartDay)}* ` +
        `(${diff} dia${diff > 1 ? 's' : ''} atrás). Deveria rodar todo dia (exceto sáb) às 2h.`
      );
    } else {
      const devEnded = await getLastLog('dev_agent', 'session_ended');
      const devCompleted = await getLastLog('dev_agent', 'card_completed');
      const lastFinish = Math.max(
        devEnded ? devEnded.getTime() : 0,
        devCompleted ? devCompleted.getTime() : 0,
      );
      const hoursSinceStart = (now - devStart) / 3600_000;
      if (hoursSinceStart > 2 && lastFinish < devStart.getTime()) {
        alerts.push(
          `⚠️ *Dev Agent (Leopoldo)* — sessão de ${toBRDate(devStart)} começou mas não terminou ` +
          `(sem \`card_completed\` nem \`session_ended\`). Pode ter travado.`
        );
      }
    }
  }
}

// CEO Agent: roda todo sábado. Checar se o último sábado teve execução.
const dow = now.getDay(); // 0=dom, 6=sab
const daysSinceSaturday = dow === 6 ? 0 : (dow + 1); // dom=1, seg=2, ..., sex=6, sab=0
const lastSaturday = new Date(today);
lastSaturday.setDate(lastSaturday.getDate() - daysSinceSaturday);
const lastSaturdayDeadline = new Date(lastSaturday);
lastSaturdayDeadline.setHours(2, 30, 0, 0);

if (now >= lastSaturdayDeadline) {
  const ceoStart = await getLastLog('ceo_agent', 'session_started');
  if (!ceoStart) {
    alerts.push(`⚠️ *CEO Agent (Geraldo)* — nunca rodou ainda.`);
  } else {
    const ceoStartDay = new Date(ceoStart);
    ceoStartDay.setHours(0, 0, 0, 0);
    if (ceoStartDay < lastSaturday) {
      alerts.push(
        `⚠️ *CEO Agent (Geraldo)* — última execução foi *${toBRDate(ceoStartDay)}*. ` +
        `Deveria ter rodado no sábado (${toBRDate(lastSaturday)}).`
      );
    }
  }
}

if (alerts.length === 0) {
  console.log('Watchdog OK — agentes Linques em dia.');
  process.exit(0);
}

const message =
  `🔔 *Watchdog dos agentes Linques*\n\n` +
  alerts.join('\n\n') +
  `\n\n_Possíveis causas: PC desligado no horário, falta de tokens no Claude, ` +
  `erro de conexão ou bug nos scripts._\n\n` +
  `Veja o runbook: \`docs/RUNBOOK.md\``;

await sendTelegram(message);
console.log('Alerta enviado:\n' + message);
