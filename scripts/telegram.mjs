import { fileURLToPath } from 'url';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendMessage(text) {
  if (!TOKEN || !CHAT_ID) {
    console.warn('[telegram] TELEGRAM_BOT_TOKEN/CHAT_ID ausentes — mensagem não enviada.');
    return null;
  }
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'Markdown',
    }),
  });
  const data = await res.json();
  if (!data.ok) throw new Error(`Telegram API error: ${data.description}`);
  return data;
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const [,, ...messageParts] = process.argv;
  if (messageParts.length > 0) {
    sendMessage(messageParts.join(' ')).then(
      (r) => console.log(r ? 'Message sent.' : 'Não enviado (sem credenciais).'),
      (err) => { console.error('Error:', err.message); process.exit(1); }
    );
  } else {
    console.error('Uso: node scripts/telegram.mjs "mensagem"');
    process.exit(1);
  }
}
