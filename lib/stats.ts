import type { SupabaseClient } from "@supabase/supabase-js";

export interface Stats {
  views: number;
  clicks: number;
  /** Visitas por dia, do mais antigo para hoje */
  daily: { day: string; views: number }[];
  devices: Record<"mobile" | "tablet" | "desktop", number>;
  referrers: { host: string; count: number }[];
  whatsappClicks: number;
  /** Cliques por bloco no período */
  byBlock: Record<string, number>;
}

export const STATS_DAYS = 30;

/** Agrega os eventos dos últimos 30 dias (RLS garante que só vêm os do dono) */
export async function getStats(supabase: SupabaseClient, profileId: string): Promise<Stats> {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (STATS_DAYS - 1));

  const [{ data: views }, { data: clicks }] = await Promise.all([
    supabase
      .from("page_view_events")
      .select("viewed_at, device_type, referrer")
      .eq("profile_id", profileId)
      .gte("viewed_at", since.toISOString())
      .limit(20000),
    supabase
      .from("block_click_events")
      .select("block_id")
      .eq("profile_id", profileId)
      .gte("clicked_at", since.toISOString())
      .limit(20000),
  ]);

  const daily = Array.from({ length: STATS_DAYS }, (_, i) => {
    const d = new Date(since);
    d.setUTCDate(d.getUTCDate() + i);
    return { day: d.toISOString().slice(0, 10), views: 0 };
  });
  const dayIndex = new Map(daily.map((d, i) => [d.day, i]));
  const devices = { mobile: 0, tablet: 0, desktop: 0 };
  const refs = new Map<string, number>();

  for (const v of views ?? []) {
    const i = dayIndex.get(String(v.viewed_at).slice(0, 10));
    if (i !== undefined) daily[i].views++;
    if (v.device_type in devices) devices[v.device_type as keyof typeof devices]++;
    const host = v.referrer || "direto";
    refs.set(host, (refs.get(host) ?? 0) + 1);
  }

  const byBlock: Record<string, number> = {};
  let whatsappClicks = 0;
  for (const c of clicks ?? []) {
    if (c.block_id) byBlock[c.block_id] = (byBlock[c.block_id] ?? 0) + 1;
    else whatsappClicks++;
  }

  return {
    views: views?.length ?? 0,
    clicks: clicks?.length ?? 0,
    daily,
    devices,
    referrers: [...refs.entries()]
      .map(([host, count]) => ({ host, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    whatsappClicks,
    byBlock,
  };
}
