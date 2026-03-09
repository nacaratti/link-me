import { supabase } from './supabase';

export interface ThemeConfig {
  id: string;
  is_pro: boolean;
}

// Cache em memória — invalidado quando admin altera
let _cache: Record<string, ThemeConfig> | null = null;

export async function fetchThemeConfigs(): Promise<Record<string, ThemeConfig>> {
  if (_cache) return _cache;
  const { data } = await supabase.from('theme_config').select('id, is_pro');
  if (data) {
    _cache = Object.fromEntries(data.map((t: ThemeConfig) => [t.id, t]));
  }
  return _cache ?? {};
}

export function invalidateThemeConfigCache(): void {
  _cache = null;
}

export function isThemePro(configs: Record<string, ThemeConfig>, themeId: string): boolean {
  return configs[themeId]?.is_pro ?? false;
}
