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

export const STATUS_TAGS = [
  { id: 'open_to_work',       label: 'Open to Work',       color: '#16a34a', bg: 'rgba(22,163,74,0.12)'   },
  { id: 'open_to_collab',     label: 'Open to Collab',     color: '#6366f1', bg: 'rgba(99,102,241,0.12)'  },
  { id: 'available',          label: 'Available',           color: '#0891b2', bg: 'rgba(8,145,178,0.12)'   },
  { id: 'hiring',             label: 'Hiring',              color: '#9333ea', bg: 'rgba(147,51,234,0.12)'  },
  { id: 'researching',        label: 'Researching',         color: '#d97706', bg: 'rgba(217,119,6,0.12)'   },
  { id: 'building_in_public', label: 'Building in Public',  color: '#db2777', bg: 'rgba(219,39,119,0.12)'  },
] as const;

export type StatusTagId = typeof STATUS_TAGS[number]['id'];

export const STATUS_TAG_SIZES = [
  { id: 'sm', label: 'P'    },
  { id: 'md', label: 'M'    },
  { id: 'lg', label: 'G'    },
] as const;

export const STATUS_TAG_POSITIONS = [
  { id: 'above-left',   label: 'Esquerda',  desc: 'Acima dos links'  },
  { id: 'above-center', label: 'Centro',    desc: 'Acima dos links'  },
  { id: 'above-right',  label: 'Direita',   desc: 'Acima dos links'  },
  { id: 'fixed-tl',     label: 'Esq. fixo', desc: 'Canto da tela'   },
  { id: 'fixed-tr',     label: 'Dir. fixo', desc: 'Canto da tela'   },
] as const;

export const STATUS_TAG_ICONS = [
  { id: 'dot',  label: '●'  },
  { id: '⚡',   label: '⚡'  },
  { id: '🔥',   label: '🔥'  },
  { id: '🚀',   label: '🚀'  },
  { id: '✦',    label: '✦'  },
  { id: '💼',   label: '💼'  },
] as const;

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
  status_tag?: string | null;
  status_tag_enabled?: boolean;
  status_tag_color?: string | null;
  status_tag_bg?: string | null;
  status_tag_size?: string;
  status_tag_position?: string;
  status_tag_font?: string | null;
  status_tag_icon?: string;
  status_tag_custom_label?: string | null;
  pro_expires_at?: string | null;
  stripe_subscription_id?: string | null;
}
