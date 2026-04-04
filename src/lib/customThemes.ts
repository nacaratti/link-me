import { supabase } from './supabase';

export interface CustomTheme {
  id: string;
  name: string;
  description: string;
  media_url: string;
  media_type: 'image' | 'video';
  preview_color: string;
  text_color: string;
  button_color: string;
  button_text_color: string;
  button_style: string;
  font_family: string;
  is_pro: boolean;
  thumbnail_url?: string;
  created_at: string;
}

let _cache: CustomTheme[] | null = null;

export async function fetchCustomThemes(): Promise<CustomTheme[]> {
  if (_cache) return _cache;
  const { data } = await supabase
    .from('custom_themes')
    .select('*')
    .order('created_at', { ascending: false });
  _cache = data ?? [];
  return _cache;
}

export function invalidateCustomThemeCache(): void {
  _cache = null;
}
