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
];

export const BUTTON_STYLE_OPTIONS = [
  { label: 'Arredondado', value: 'rounded', class: 'rounded-xl' },
  { label: 'Pílula', value: 'pill', class: 'rounded-full' },
  { label: 'Quadrado', value: 'square', class: 'rounded-none' },
  { label: 'Contorno', value: 'outline', class: 'rounded-xl' },
];

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
  theme_id: string;
  links: Link[];
}
