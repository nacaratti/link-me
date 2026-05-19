import type React from 'react';
import type { Profile } from '../types';

export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  /** CSS background string used in the theme selector card */
  previewStyle: React.CSSProperties;
  /** Color/style defaults applied when the theme is selected */
  defaults: Pick<Profile, 'bg_color' | 'text_color' | 'button_color' | 'button_text_color' | 'button_style' | 'font_family'>;
  /** Full-screen background rendered behind the profile content */
  Background?: React.ComponentType;
  /** True for WebGL (Three.js) themes — skipped in MobilePreview to avoid context limits */
  isWebGL?: boolean;
  /** Explicit group override; defaults to 'animated' if Background exists, 'static' otherwise */
  group?: 'static' | 'animated';
  /** Marks theme as PRO in the local definition — used as fallback when DB config is absent */
  isPro?: boolean;
  /** Path to local thumbnail image (relative to /public), e.g. '/temas/mercurio.png' */
  thumbnail?: string;
  /** URL of the hero banner image displayed at the top of the public profile (decorative only — text never overlays it) */
  bannerImage?: string;
  /** Accent color used for the thin line at the bottom of the banner (CSS color string) */
  bannerAccent?: string;
}
