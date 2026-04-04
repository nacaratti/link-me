import { supabase } from './supabase';
import type { ThemeDefinition } from '../themes/types';

export interface ThemeConfig {
  id: string;
  is_pro: boolean;
  preview_url?: string;
}

// Cache em memória — invalidado quando admin altera
let _cache: Record<string, ThemeConfig> | null = null;

export async function fetchThemeConfigs(): Promise<Record<string, ThemeConfig>> {
  if (_cache) return _cache;
  const { data } = await supabase.from('theme_config').select('id, is_pro, preview_url');
  if (data) {
    _cache = Object.fromEntries(data.map((t: ThemeConfig) => [t.id, t]));
  }
  return _cache ?? {};
}

export function invalidateThemeConfigCache(): void {
  _cache = null;
}

export function isThemePro(
  configs: Record<string, ThemeConfig>,
  themeId: string,
  definition?: ThemeDefinition,
): boolean {
  if (configs[themeId] !== undefined) return configs[themeId].is_pro;
  return definition?.isPro ?? false;
}
