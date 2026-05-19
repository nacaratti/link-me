import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL/SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

// ─── Activity Logs ───────────────────────────────────────────────────────────

export async function logActivity({ agent, action, details = {}, card_id = null }) {
  const { data, error } = await supabase
    .from('activity_logs')
    .insert({ agent, action, details, card_id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getRecentLogs(limit = 50) {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

// ─── Weekly Focus ────────────────────────────────────────────────────────────

export async function getWeeklyFocus() {
  const { data, error } = await supabase
    .from('weekly_focus')
    .select('*')
    .order('week_start', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function setWeeklyFocus({ focus_text, north_star_name, north_star_target }) {
  const d = new Date();
  const day = d.getUTCDay();
  const delta = (day + 6) % 7;
  d.setUTCDate(d.getUTCDate() - delta);
  const week_start = d.toISOString().slice(0, 10);

  const { data: existing } = await supabase
    .from('weekly_focus')
    .select('id')
    .eq('week_start', week_start)
    .maybeSingle();

  const update = {};
  if (focus_text !== undefined) update.focus_text = focus_text;
  if (north_star_name !== undefined) update.north_star_name = north_star_name;
  if (north_star_target !== undefined) update.north_star_target = north_star_target;

  if (existing) {
    const { data, error } = await supabase
      .from('weekly_focus')
      .update(update)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('weekly_focus')
      .insert({ week_start, focus_text: focus_text || 'Foco a definir', ...update })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

// ─── Agent Usage ─────────────────────────────────────────────────────────────

export async function getRecentUsage(days = 30) {
  const since = new Date(Date.now() - days * 86400_000).toISOString();
  const { data, error } = await supabase
    .from('agent_usage')
    .select('*')
    .gte('started_at', since)
    .order('started_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

const commands = {
  async log(agent, action, details = '{}') {
    const entry = await logActivity({ agent, action, details: JSON.parse(details) });
    console.log('Logged:', JSON.stringify(entry, null, 2));
  },
  async logs(limit = '50') {
    const logs = await getRecentLogs(parseInt(limit));
    console.log(JSON.stringify(logs, null, 2));
  },
  async focus() {
    const f = await getWeeklyFocus();
    console.log(f ? JSON.stringify(f, null, 2) : 'No weekly_focus yet');
  },
  async setFocus(focus_text, north_star_name, north_star_target) {
    const target = north_star_target ? Number(north_star_target) : undefined;
    const f = await setWeeklyFocus({ focus_text, north_star_name, north_star_target: target });
    console.log('Saved:', JSON.stringify(f, null, 2));
  },
  async usage(days = '30') {
    const rows = await getRecentUsage(parseInt(days));
    console.log(JSON.stringify(rows, null, 2));
  },
};

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const [,, cmd, ...args] = process.argv;
  if (cmd && commands[cmd]) {
    commands[cmd](...args).catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
  } else if (cmd) {
    console.error(`Unknown command: ${cmd}`);
    console.error('Available:', Object.keys(commands).join(', '));
    process.exit(1);
  }
}
