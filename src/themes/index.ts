import type { ThemeDefinition } from './types';
import MercuryBackground from './mercury/Background';
import QuantumBackground from './quantum/Background';
import LaserBackground from './laser/Background';
import VoidBackground from './void/Background';

export const THEMES: ThemeDefinition[] = [
  {
    id: 'default',
    name: 'Clássico',
    description: 'Fundo simples com cores totalmente personalizáveis.',
    previewStyle: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    },
    defaults: {
      bg_color: '#f8fafc',
      text_color: '#0f172a',
      button_color: '#ffffff',
      button_text_color: '#0f172a',
      button_style: 'rounded',
      font_family: 'Inter',
    },
  },
  {
    id: 'mercury',
    name: 'Mercúrio Líquido',
    description: 'Blobs orgânicos animados em WebGL com efeito metálico.',
    previewStyle: {
      background: '#0a0a0a',
      position: 'relative',
      overflow: 'hidden',
    },
    defaults: {
      bg_color: '#0a0a0a',
      text_color: '#f0f0f0',
      button_color: 'rgba(255,255,255,0.08)',
      button_text_color: '#f0f0f0',
      button_style: 'pill',
      font_family: 'Space Grotesk',
    },
    Background: MercuryBackground,
  },
  {
    id: 'quantum',
    name: 'Esfera Quântica',
    description: 'Esferas metálicas distorcidas flutuando em um cosmos de estrelas.',
    previewStyle: {
      background: 'radial-gradient(ellipse at 50% 50%, #1a1a2e 0%, #000000 100%)',
    },
    defaults: {
      bg_color: '#000000',
      text_color: '#ffffff',
      button_color: 'rgba(255,255,255,0.08)',
      button_text_color: '#ffffff',
      button_style: 'pill',
      font_family: 'Space Grotesk',
    },
    Background: QuantumBackground,
  },
  {
    id: 'laser',
    name: 'Laser',
    description: 'Feixes de luz neon ricocheteando em um cosmos escuro com bloom.',
    previewStyle: {
      background: 'radial-gradient(ellipse at 30% 60%, #00ffff22 0%, #ff00ff11 50%, #010101 100%)',
    },
    defaults: {
      bg_color: '#010101',
      text_color: '#ffffff',
      button_color: 'rgba(0,255,255,0.1)',
      button_text_color: '#00ffff',
      button_style: 'pill',
      font_family: 'Space Grotesk',
    },
    Background: LaserBackground,
  },
  {
    id: 'void',
    name: 'Void',
    description: 'Nuvens de partículas girando no vazio infinito.',
    previewStyle: {
      background: 'radial-gradient(ellipse at 40% 60%, #1e1b4b 0%, #050505 100%)',
    },
    defaults: {
      bg_color: '#050505',
      text_color: '#e0e7ff',
      button_color: 'rgba(165,180,252,0.1)',
      button_text_color: '#e0e7ff',
      button_style: 'pill',
      font_family: 'Space Grotesk',
    },
    Background: VoidBackground,
  },
];

export function getTheme(id: string): ThemeDefinition {
  return THEMES.find(t => t.id === id) ?? THEMES[0];
}

export type { ThemeDefinition };
