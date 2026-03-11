import { lazy } from 'react';
import type { ThemeDefinition } from './types';

// ── WebGL (Three.js) ─────────────────────────────────────────────────────────
const MercuryBackground     = lazy(() => import('./mercury/Background'));
const QuantumBackground     = lazy(() => import('./quantum/Background'));
const VoidBackground        = lazy(() => import('./void/Background'));

// ── CSS animations ────────────────────────────────────────────────────────────
const AuroraBackground      = lazy(() => import('./aurora/Background'));
const SunsetBackground      = lazy(() => import('./sunset/Background'));
const NeonBackground        = lazy(() => import('./neon/Background'));
const BlobBackground        = lazy(() => import('./blob/Background'));

// ── Canvas 2D ─────────────────────────────────────────────────────────────────
const LaserBackground         = lazy(() => import('./laser/Background'));
const ConstellationBackground = lazy(() => import('./constellation/Background'));
const RippleBackground        = lazy(() => import('./ripple/Background'));
const FlowBackground          = lazy(() => import('./flow/Background'));
const FirefliesBackground     = lazy(() => import('./fireflies/Background'));
const BubblesBackground       = lazy(() => import('./bubbles/Background'));

// ── Profissões ────────────────────────────────────────────────────────────────
const AdvogadoBackground      = lazy(() => import('./advogado/Background'));
const MedicoBackground        = lazy(() => import('./medico/Background'));
const DentistaBackground      = lazy(() => import('./dentista/Background'));
const PsicologoBackground     = lazy(() => import('./psicologo/Background'));
const DevBackground           = lazy(() => import('./dev/Background'));

export const THEMES: ThemeDefinition[] = [
  // ── Clássico ──────────────────────────────────────────────────────────────
  {
    id: 'default',
    name: 'Clássico',
    description: 'Fundo simples com cores totalmente personalizáveis.',
    previewStyle: { background: 'linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)' },
    defaults: {
      bg_color: '#f8fafc', text_color: '#0f172a',
      button_color: '#ffffff', button_text_color: '#0f172a',
      button_style: 'rounded', font_family: 'Inter',
    },
  },

  // ── WebGL ──────────────────────────────────────────────────────────────────
  {
    id: 'mercury',
    name: 'Mercúrio Líquido',
    description: 'Blobs orgânicos animados em WebGL com efeito metálico.',
    previewStyle: { background: 'radial-gradient(ellipse at 35% 65%,#2a1f2a 0%,#0a0a0a 100%)' },
    defaults: {
      bg_color: '#0a0a0a', text_color: '#f0f0f0',
      button_color: 'rgba(255,255,255,0.50)', button_text_color: '#000000',
      button_style: 'pill', font_family: 'Space Grotesk',
    },
    Background: MercuryBackground,
    isWebGL: true,
  },
  {
    id: 'quantum',
    name: 'Esfera Quântica',
    description: 'Esferas metálicas distorcidas flutuando em um cosmos de estrelas.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%,#1a1a2e 0%,#000000 100%)' },
    defaults: {
      bg_color: '#000000', text_color: '#ffffff',
      button_color: 'rgba(255,255,255,0.08)', button_text_color: '#ffffff',
      button_style: 'pill', font_family: 'Space Grotesk',
    },
    Background: QuantumBackground,
    isWebGL: true,
  },
  {
    id: 'laser',
    name: 'Laser',
    description: 'Feixes de luz neon ricocheteando em um cosmos escuro com bloom.',
    previewStyle: { background: 'radial-gradient(ellipse at 30% 60%,#00ffff22 0%,#ff00ff11 50%,#010101 100%)' },
    defaults: {
      bg_color: '#010101', text_color: '#ffffff',
      button_color: 'rgba(0,255,255,0.1)', button_text_color: '#00ffff',
      button_style: 'pill', font_family: 'Space Grotesk',
    },
    Background: LaserBackground,
  },
  {
    id: 'void',
    name: 'Void',
    description: 'Nuvens de partículas girando no vazio infinito.',
    previewStyle: { background: 'radial-gradient(ellipse at 40% 60%,#1e1b4b 0%,#050505 100%)' },
    defaults: {
      bg_color: '#050505', text_color: '#e0e7ff',
      button_color: 'rgba(165,180,252,0.1)', button_text_color: '#e0e7ff',
      button_style: 'pill', font_family: 'Space Grotesk',
    },
    Background: VoidBackground,
    isWebGL: true,
  },

  // ── CSS ────────────────────────────────────────────────────────────────────
  {
    id: 'aurora',
    name: 'Aurora Boreal',
    description: 'Cortinas de luz esverdeada dançando sobre um céu estrelado.',
    previewStyle: { background: 'linear-gradient(180deg,#030d1a 0%,#071a10 55%,#050a12 100%)' },
    defaults: {
      bg_color: '#030d1a', text_color: '#d0fff0',
      button_color: 'rgba(0,200,120,0.12)', button_text_color: '#a0ffd0',
      button_style: 'pill', font_family: 'Space Grotesk',
    },
    Background: AuroraBackground,
  },
  {
    id: 'sunset',
    name: 'Pôr do Sol',
    description: 'Camadas de gradiente quente em roxo, magenta e laranja dourado.',
    previewStyle: { background: 'linear-gradient(180deg,#12001e 0%,#500040 42%,#a00050 70%,#e05000 100%)' },
    defaults: {
      bg_color: '#12001e', text_color: '#ffd4a8',
      button_color: 'rgba(255,100,50,0.15)', button_text_color: '#ffb080',
      button_style: 'pill', font_family: 'Playfair Display',
    },
    Background: SunsetBackground,
  },
  {
    id: 'neon',
    name: 'Neon Grid',
    description: 'Grade cyberpunk em perspectiva com orbes neon pulsantes.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 110%,#00ffee18 0%,#ff00cc10 45%,#000000 100%)' },
    defaults: {
      bg_color: '#000000', text_color: '#00ffee',
      button_color: 'rgba(0,255,220,0.08)', button_text_color: '#00ffee',
      button_style: 'square', font_family: 'Space Grotesk',
    },
    Background: NeonBackground,
  },
  {
    id: 'blob',
    name: 'Liquid Blob',
    description: 'Bolhas orgânicas em pastel se deformando suavemente.',
    previewStyle: { background: 'linear-gradient(135deg,#f0e8ff 0%,#e8f5f0 50%,#ffe8f0 100%)' },
    defaults: {
      bg_color: '#f5eeff', text_color: '#3d1a6e',
      button_color: 'rgba(255,255,255,0.65)', button_text_color: '#5b2d9e',
      button_style: 'pill', font_family: 'Poppins',
    },
    Background: BlobBackground,
  },

  // ── Canvas 2D ──────────────────────────────────────────────────────────────
  {
    id: 'constellation',
    name: 'Constelação',
    description: 'Estrelas à deriva conectadas por linhas sutis de luz.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%,#0a1020 0%,#050812 100%)' },
    defaults: {
      bg_color: '#050812', text_color: '#c8d8ff',
      button_color: 'rgba(150,180,255,0.1)', button_text_color: '#a8c0ff',
      button_style: 'rounded', font_family: 'Space Grotesk',
    },
    Background: ConstellationBackground,
  },
  {
    id: 'ripple',
    name: 'Lago de Ondas',
    description: 'Círculos concêntricos se expandindo em água turquesa.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%,#051a20 0%,#02151f 100%)' },
    defaults: {
      bg_color: '#02151f', text_color: '#90ffe8',
      button_color: 'rgba(0,200,180,0.12)', button_text_color: '#60ffd8',
      button_style: 'rounded', font_family: 'Inter',
    },
    Background: RippleBackground,
  },
  {
    id: 'flow',
    name: 'Fluxo Dourado',
    description: 'Partículas áureas fluindo em padrões orgânicos hipnóticos.',
    previewStyle: { background: 'linear-gradient(135deg,#0a0805 0%,#150f0a 100%)' },
    defaults: {
      bg_color: '#0a0805', text_color: '#ffd080',
      button_color: 'rgba(255,180,50,0.1)', button_text_color: '#ffcc60',
      button_style: 'pill', font_family: 'Poppins',
    },
    Background: FlowBackground,
  },
  {
    id: 'fireflies',
    name: 'Vagalumes',
    description: 'Pontos luminosos piscando com movimento orgânico na floresta.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%,#051008 0%,#020d05 100%)' },
    defaults: {
      bg_color: '#020d05', text_color: '#c8ffcc',
      button_color: 'rgba(100,255,100,0.08)', button_text_color: '#80ff90',
      button_style: 'rounded', font_family: 'Inter',
    },
    Background: FirefliesBackground,
  },
  // ── Profissões ──────────────────────────────────────────────────────────────
  {
    id: 'advogado',
    name: 'Advocacia',
    description: 'Balanças da justiça e símbolos jurídicos flutuando em fundo navy e dourado.',
    previewStyle: { background: 'linear-gradient(160deg,#0c1017 0%,#1a1408 100%)' },
    defaults: {
      bg_color: '#0c1017', text_color: '#e8d5a3',
      button_color: 'rgba(201,168,76,0.15)', button_text_color: '#c9a84c',
      button_style: 'square', font_family: 'Playfair Display',
    },
    Background: AdvogadoBackground,
  },
  {
    id: 'medico',
    name: 'Medicina',
    description: 'Linha de ECG animada e cruzes médicas em fundo clínico escuro.',
    previewStyle: { background: 'linear-gradient(160deg,#041218 0%,#0a0a1a 100%)' },
    defaults: {
      bg_color: '#041218', text_color: '#f0f8ff',
      button_color: 'rgba(229,62,62,0.15)', button_text_color: '#feb2b2',
      button_style: 'rounded', font_family: 'Inter',
    },
    Background: MedicoBackground,
  },
  {
    id: 'dentista',
    name: 'Odontologia',
    description: 'Dentes e bolhas flutuando em fundo teal escuro com brilhos mint.',
    previewStyle: { background: 'linear-gradient(160deg,#071a17 0%,#030f0d 100%)' },
    defaults: {
      bg_color: '#071a17', text_color: '#a8f0e0',
      button_color: 'rgba(168,240,224,0.12)', button_text_color: '#a8f0e0',
      button_style: 'pill', font_family: 'Poppins',
    },
    Background: DentistaBackground,
  },
  {
    id: 'psicologo',
    name: 'Psicologia',
    description: 'Ondas cerebrais e símbolos da mente flutuando em fundo lilás profundo.',
    previewStyle: { background: 'linear-gradient(160deg,#0f0a1e 0%,#1a0a2e 100%)' },
    defaults: {
      bg_color: '#0f0a1e', text_color: '#e9d8fd',
      button_color: 'rgba(183,148,244,0.15)', button_text_color: '#d6bcfa',
      button_style: 'pill', font_family: 'Montserrat',
    },
    Background: PsicologoBackground,
  },
  {
    id: 'dev',
    name: 'Desenvolvedor',
    description: 'Chuva de código estilo Matrix com símbolos de programação em verde neon.',
    previewStyle: { background: 'linear-gradient(160deg,#081208 0%,#020802 100%)' },
    defaults: {
      bg_color: '#081208', text_color: '#00ff88',
      button_color: 'rgba(0,255,136,0.1)', button_text_color: '#00ff88',
      button_style: 'square', font_family: 'Space Grotesk',
    },
    Background: DevBackground,
  },

  {
    id: 'bubbles',
    name: 'Bolhas',
    description: 'Bolinhas coloridas translúcidas subindo suavemente pela tela.',
    previewStyle: { background: 'linear-gradient(180deg,#0d1b2a 0%,#1a0d2e 100%)' },
    defaults: {
      bg_color: '#0d1b2a', text_color: '#ffffff',
      button_color: 'rgba(255,255,255,0.12)', button_text_color: '#ffffff',
      button_style: 'pill', font_family: 'Poppins',
    },
    Background: BubblesBackground,
  },
];

export function getTheme(id: string): ThemeDefinition {
  return THEMES.find(t => t.id === id) ?? THEMES[0];
}

export type { ThemeDefinition };
