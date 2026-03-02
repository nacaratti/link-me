import { Github, Linkedin, Globe, Instagram, Twitter, ExternalLink, MoreHorizontal, Plus, Trash2, GripVertical, Settings, User } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ICON_MAP: Record<string, any> = {
  github: Github,
  linkedin: Linkedin,
  globe: Globe,
  instagram: Instagram,
  twitter: Twitter,
  link: ExternalLink,
};

export interface Link {
  id: number;
  profile_id: number;
  title: string;
  url: string;
  icon_type: string;
  sort_order: number;
  clicks: number;
}

export interface Profile {
  id: number;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  theme_config: {
    bg: string;
    text: string;
    button: string;
    buttonText?: string;
  };
  links: Link[];
}
