import { Github, Linkedin, Globe, Instagram, Twitter, ExternalLink, Youtube } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ICON_MAP: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  globe: Globe,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  link: ExternalLink,
};

export const FONT_OPTIONS = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Space Grotesk', value: 'Space Grotesk' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'Nunito', value: 'Nunito' },
  { label: 'Lato', value: 'Lato' },
  { label: 'DM Sans', value: 'DM Sans' },
  { label: 'Raleway', value: 'Raleway' },
  { label: 'Ubuntu', value: 'Ubuntu' },
  { label: 'Josefin Sans', value: 'Josefin Sans' },
  { label: 'Alfa Slab One', value: 'Alfa Slab One' },
  { label: 'Chango', value: 'Chango' },
  { label: 'Salsa', value: 'Salsa' },
  { label: 'Bebas Neue', value: 'Bebas Neue' },
  { label: 'Pacifico', value: 'Pacifico' },
  { label: 'Lobster', value: 'Lobster' },
  { label: 'Righteous', value: 'Righteous' },
  { label: 'Orbitron', value: 'Orbitron' },
  { label: 'Fredoka One', value: 'Fredoka One' },
];

export const BUTTON_STYLE_OPTIONS = [
  { label: 'Pílula',      value: 'pill',    radius: '9999px' },
  { label: 'Arredondado', value: 'rounded', radius: '14px'   },
  { label: 'Suave',       value: 'soft',    radius: '6px'    },
  { label: 'Quadrado',    value: 'square',  radius: '0px'    },
  { label: 'Folha',       value: 'leaf',    radius: '20px 4px' },
  { label: 'Onda',        value: 'wave',    radius: '0px 16px' },
];

export function getButtonRadius(style?: string): string {
  return BUTTON_STYLE_OPTIONS.find(o => o.value === style)?.radius ?? '14px';
}

export interface Link {
  id: number;
  profile_id: string;
  title: string;
  url: string;
  icon_type: string;
  sort_order: number;
  clicks: number;
  is_active: boolean;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  bg_color: string;
  text_color: string;
  button_color: string;
  button_text_color: string;
  button_style: string;
  font_family: string;
  title_color?: string;
  title_font?: string;
  subtitle_color?: string;
  subtitle_font?: string;
  button_font?: string;
  button_border_width?: string;
  button_border_color?: string;
  bg_image_url?: string;
  bg_position?: string;
  theme_id: string;
  plan: 'free' | 'pro';
  role: 'user' | 'admin';
  links: Link[];
  whatsapp_number?: string;
  whatsapp_enabled?: boolean;
  whatsapp_bg_color?: string;
  whatsapp_icon_color?: string;
  whatsapp_size?: 'normal' | 'large';
  whatsapp_animation?: 'none' | 'pulse' | 'bounce' | 'shake';
}
