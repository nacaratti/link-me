import { lazy } from 'react';
import type { ThemeDefinition } from './types';

// ── WebGL (Three.js) ─────────────────────────────────────────────────────────
const MercuryBackground     = lazy(() => import('./mercury/Background'));
const QuantumBackground     = lazy(() => import('./quantum/Background'));
const VoidBackground        = lazy(() => import('./void/Background'));
const WaveFieldBackground   = lazy(() => import('./wavefield/Background'));
const FractalBackground     = lazy(() => import('./fractal/Background'));
const ScanLinesBackground   = lazy(() => import('./scanlines/Background'));
const CrystalBackground     = lazy(() => import('./crystal/Background'));

// ── CSS animations ────────────────────────────────────────────────────────────
const AuroraBackground      = lazy(() => import('./aurora/Background'));

// ── Vídeo ─────────────────────────────────────────────────────────────────────
const BeyhiveBackground     = lazy(() => import('./beyhive/Background'));

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
const ArquitetoBackground     = lazy(() => import('./arquiteto/Background'));
const NutricionistaBackground = lazy(() => import('./nutricionista/Background'));
const PersonalBackground      = lazy(() => import('./personal/Background'));
const CoachBackground         = lazy(() => import('./coach/Background'));
const FotografoBackground     = lazy(() => import('./fotografo/Background'));
const DesignerBackground      = lazy(() => import('./designer/Background'));
const ChefBackground          = lazy(() => import('./chef/Background'));
const ImobiliariaBackground   = lazy(() => import('./imobiliaria/Background'));

// ── Estáticos premium (multiuso) ─────────────────────────────────────────────
const NoirBackground          = lazy(() => import('./noir/Background'));
const LinenBackground         = lazy(() => import('./linen/Background'));
const MarbleBackground        = lazy(() => import('./marble/Background'));

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
      button_style: 'leaf', font_family: 'Space Grotesk',
    },
    Background: MercuryBackground,
    isWebGL: true,
    thumbnail: '/temas/mercurio.png',
  },
  {
    id: 'quantum',
    name: 'Esfera Quântica',
    description: 'Esferas metálicas distorcidas flutuando em um cosmos de estrelas.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%,#1a1a2e 0%,#000000 100%)' },
    defaults: {
      bg_color: '#000000', text_color: '#ffffff',
      button_color: 'rgba(255,255,255,0.08)', button_text_color: '#ffffff',
      button_style: 'pill', font_family: 'Orbitron',
    },
    Background: QuantumBackground,
    isWebGL: true,
    thumbnail: '/temas/esfera.png',
  },
  {
    id: 'wavefield',
    name: 'Grade Cibernética',
    description: 'Grade em perspectiva ondulando em tempo real com shader GLSL cyberpunk.',
    previewStyle: { background: 'linear-gradient(180deg,#000814 0%,#001a2e 50%,#000814 100%)' },
    defaults: {
      bg_color: '#000814', text_color: '#00f2ff',
      button_color: 'rgba(0,242,255,0.08)', button_text_color: '#00f2ff',
      button_style: 'square', font_family: 'Orbitron',
    },
    Background: WaveFieldBackground,
    isWebGL: true,
    isPro: true,
    thumbnail: '/temas/grade.png',
  },
  {
    id: 'fractal',
    name: 'Pulso Fractal',
    description: 'Fractais hipnóticos pulsando em ciclos de cor turquesa infinitos.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%,#001a1a 0%,#000000 100%)' },
    defaults: {
      bg_color: '#000000', text_color: '#00f5ff',
      button_color: 'rgba(0,245,255,0.1)', button_text_color: '#00e5ff',
      button_style: 'pill', font_family: 'Space Grotesk',
    },
    Background: FractalBackground,
    isWebGL: true,
    isPro: true,
    thumbnail: '/temas/pulso.png',
  },
  {
    id: 'scanlines',
    name: 'Scan Torus',
    description: 'Toros girando com linhas de varredura neon em shader GLSL.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%,#000d10 0%,#000000 100%)' },
    defaults: {
      bg_color: '#000000', text_color: '#00f2ff',
      button_color: 'rgba(0,242,255,0.07)', button_text_color: '#00f2ff',
      button_style: 'wave', font_family: 'Orbitron',
    },
    Background: ScanLinesBackground,
    isWebGL: true,
    isPro: true,
    thumbnail: '/temas/torus.png',
  },
  {
    id: 'crystal',
    name: 'Treliça de Cristal',
    description: 'Cubo 3D de instâncias wireframe pulsando como um cristal vivo.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%,#001420 0%,#00050a 100%)' },
    defaults: {
      bg_color: '#00050a', text_color: '#00f2ff',
      button_color: 'rgba(0,242,255,0.08)', button_text_color: '#00e5ff',
      button_style: 'soft', font_family: 'Space Grotesk',
    },
    Background: CrystalBackground,
    isWebGL: true,
    isPro: true,
    thumbnail: '/temas/cristal.png',
  },
  {
    id: 'laser',
    name: 'Laser',
    description: 'Feixes de luz neon ricocheteando em um cosmos escuro com bloom.',
    previewStyle: { background: 'radial-gradient(ellipse at 30% 60%,#00ffff22 0%,#ff00ff11 50%,#010101 100%)' },
    defaults: {
      bg_color: '#010101', text_color: '#ffffff',
      button_color: 'rgba(0,255,255,0.1)', button_text_color: '#00ffff',
      button_style: 'wave', font_family: 'Orbitron',
    },
    Background: LaserBackground,
    thumbnail: '/temas/laser.png',
  },
  {
    id: 'void',
    name: 'Void',
    description: 'Nuvens de partículas girando no vazio infinito.',
    previewStyle: { background: 'radial-gradient(ellipse at 40% 60%,#1e1b4b 0%,#050505 100%)' },
    defaults: {
      bg_color: '#050505', text_color: '#e0e7ff',
      button_color: 'rgba(165,180,252,0.1)', button_text_color: '#e0e7ff',
      button_style: 'soft', font_family: 'Raleway',
    },
    Background: VoidBackground,
    isWebGL: true,
    thumbnail: '/temas/void.png',
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
      button_style: 'leaf', font_family: 'Raleway',
    },
    Background: AuroraBackground,
    thumbnail: '/temas/aurora.png',
  },
  // ── Vídeo ─────────────────────────────────────────────────────────────────
  {
    id: 'beyhive',
    name: 'Beyhive',
    description: 'Vídeo exclusivo com estética dourada — para quem nasceu para brilhar.',
    previewStyle: { background: 'linear-gradient(135deg, #1a1100 0%, #3a2800 50%, #0a0700 100%)' },
    defaults: {
      bg_color: '#0a0700', text_color: '#FFD700',
      button_color: 'rgba(255,215,0,0.15)', button_text_color: '#FFD700',
      button_style: 'pill', font_family: 'Playfair Display',
    },
    Background: BeyhiveBackground,
    group: 'animated',
    thumbnail: '/temas/bey.mp4',
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
      button_style: 'pill', font_family: 'Space Grotesk',
    },
    Background: ConstellationBackground,
    thumbnail: '/temas/constelacao.png',
  },
  {
    id: 'ripple',
    name: 'Lago de Ondas',
    description: 'Círculos concêntricos se expandindo em água turquesa.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%,#051a20 0%,#02151f 100%)' },
    defaults: {
      bg_color: '#02151f', text_color: '#90ffe8',
      button_color: 'rgba(0,200,180,0.12)', button_text_color: '#60ffd8',
      button_style: 'wave', font_family: 'Josefin Sans',
    },
    Background: RippleBackground,
    thumbnail: '/temas/lago.png',
  },
  {
    id: 'flow',
    name: 'Fluxo Dourado',
    description: 'Partículas áureas fluindo em padrões orgânicos hipnóticos.',
    previewStyle: { background: 'linear-gradient(135deg,#0a0805 0%,#150f0a 100%)' },
    defaults: {
      bg_color: '#0a0805', text_color: '#ffd080',
      button_color: 'rgba(255,180,50,0.1)', button_text_color: '#ffcc60',
      button_style: 'leaf', font_family: 'Raleway',
    },
    Background: FlowBackground,
    thumbnail: '/temas/fluxo.png',
  },
  {
    id: 'fireflies',
    name: 'Vagalumes',
    description: 'Pontos luminosos piscando com movimento orgânico na floresta.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%,#051008 0%,#020d05 100%)' },
    defaults: {
      bg_color: '#020d05', text_color: '#c8ffcc',
      button_color: 'rgba(100,255,100,0.08)', button_text_color: '#80ff90',
      button_style: 'soft', font_family: 'Nunito',
    },
    Background: FirefliesBackground,
    thumbnail: '/temas/vagalumes.png',
  },
  // ── Profissões ──────────────────────────────────────────────────────────────
  {
    id: 'advogado',
    name: 'Advocacia',
    description: 'Atmosfera de escritório jurídico — foto desfocada de biblioteca sobre fundo dark navy.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 40%, #141c2f 0%, #0a0f1c 100%)' },
    defaults: {
      bg_color: '#0a0f1c', text_color: '#f5f5f5',
      button_color: 'rgba(255,255,255,0.09)', button_text_color: '#ffffff',
      button_style: 'soft', font_family: 'Montserrat',
    },
    Background: AdvogadoBackground,
    bannerImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=85&auto=format&fit=crop',
    bannerAccent: '#c9a84c',
    group: 'static',
  },
  {
    id: 'medico',
    name: 'Medicina Azure',
    description: 'Navy profundo com foto de hospital, hélice de DNA, ECG brilhante e nós moleculares em ciano.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 0%, #0a2540 0%, #020c18 100%)' },
    defaults: {
      bg_color: '#020c18', text_color: '#e8f4f8',
      button_color: 'rgba(56,189,248,0.10)', button_text_color: '#7dd3fc',
      button_style: 'pill', font_family: 'DM Sans',
    },
    Background: MedicoBackground,
    group: 'static',
  },
  {
    id: 'dentista',
    name: 'Odontologia Pearl',
    description: 'Pérola gradiente com padrão hexagonal de esmalte e acentos mint.',
    previewStyle: { background: 'linear-gradient(135deg,#f0f4f8 0%,#e6f0ee 100%)' },
    defaults: {
      bg_color: '#eef2ee', text_color: '#0f3d3a',
      button_color: 'rgba(13,148,136,0.12)', button_text_color: '#0d7d75',
      button_style: 'pill', font_family: 'Josefin Sans',
    },
    Background: DentistaBackground,
    group: 'static',
  },
  {
    id: 'psicologo',
    name: 'Psicologia Serene',
    description: 'Areia quente com espiral áurea em terracota — sereno e acolhedor.',
    previewStyle: { background: 'linear-gradient(160deg,#f5ede0 0%,#e8ddd0 100%)' },
    defaults: {
      bg_color: '#f1e8da', text_color: '#3a2a1c',
      button_color: 'rgba(160,90,60,0.15)', button_text_color: '#7a3a25',
      button_style: 'soft', font_family: 'Raleway',
    },
    Background: PsicologoBackground,
    group: 'static',
  },
  {
    id: 'dev',
    name: 'Desenvolvedor Terminal',
    description: 'Graphite minimalista com grid técnico e símbolos de código em ciano.',
    previewStyle: { background: 'linear-gradient(160deg,#0e1626 0%,#06080f 100%)' },
    defaults: {
      bg_color: '#0a0e1a', text_color: '#e0f7fa',
      button_color: 'rgba(34,211,238,0.10)', button_text_color: '#22d3ee',
      button_style: 'square', font_family: 'Space Grotesk',
    },
    Background: DevBackground,
    group: 'static',
  },
  {
    id: 'arquiteto',
    name: 'Arquitetura Blueprint',
    description: 'Papel marfim com grade técnica e planta arquitetônica em grafite.',
    previewStyle: { background: 'linear-gradient(160deg,#f4ede0 0%,#e8e0cf 100%)' },
    defaults: {
      bg_color: '#f4ede0', text_color: '#2a2418',
      button_color: 'rgba(58,51,39,0.10)', button_text_color: '#3a3327',
      button_style: 'square', font_family: 'Playfair Display',
    },
    Background: ArquitetoBackground,
    group: 'static',
  },
  {
    id: 'nutricionista',
    name: 'Nutrição Verde',
    description: 'Off-white sereno com folha estilizada e acentos sage green.',
    previewStyle: { background: 'linear-gradient(180deg,#f7f9f4 0%,#eef2e6 100%)' },
    defaults: {
      bg_color: '#eef2e6', text_color: '#1f2d18',
      button_color: 'rgba(90,122,74,0.14)', button_text_color: '#3a5a2a',
      button_style: 'rounded', font_family: 'DM Sans',
    },
    Background: NutricionistaBackground,
    group: 'static',
  },
  {
    id: 'personal',
    name: 'Personal Trainer',
    description: 'Carvão escuro com linhas de movimento angulares e acento laranja-elétrico.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%, #2a1a14 0%, #0d0d0d 100%)' },
    defaults: {
      bg_color: '#1a1a1a', text_color: '#ffffff',
      button_color: 'rgba(255,107,53,0.15)', button_text_color: '#ff6b35',
      button_style: 'wave', font_family: 'Bebas Neue',
    },
    Background: PersonalBackground,
    group: 'static',
  },
  {
    id: 'coach',
    name: 'Executive Coach',
    description: 'Bordeaux profundo com monograma diamante em ouro fosco.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 30%, #5a1c2a 0%, #2a0712 100%)' },
    defaults: {
      bg_color: '#3a0e1a', text_color: '#f0e2c8',
      button_color: 'rgba(201,168,107,0.18)', button_text_color: '#c9a86b',
      button_style: 'square', font_family: 'Playfair Display',
    },
    Background: CoachBackground,
    group: 'static',
  },
  {
    id: 'fotografo',
    name: 'Fotografia Mono',
    description: 'Quase preto com grain de filme, frame branco fino e íris de diafragma.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%, #1a1a1a 0%, #050505 100%)' },
    defaults: {
      bg_color: '#0a0a0a', text_color: '#f0f0f0',
      button_color: 'rgba(255,255,255,0.10)', button_text_color: '#ffffff',
      button_style: 'square', font_family: 'Space Grotesk',
    },
    Background: FotografoBackground,
    group: 'static',
  },
  {
    id: 'designer',
    name: 'Designer Bauhaus',
    description: 'Branco com formas primárias Bauhaus — círculo, quadrado e triângulo.',
    previewStyle: { background: 'linear-gradient(135deg,#fafaf7 0%,#efefe6 100%)' },
    defaults: {
      bg_color: '#fafaf7', text_color: '#1a1a1a',
      button_color: 'rgba(26,26,26,0.08)', button_text_color: '#1a1a1a',
      button_style: 'square', font_family: 'Space Grotesk',
    },
    Background: DesignerBackground,
    group: 'static',
  },
  {
    id: 'chef',
    name: 'Gastronomia Plate',
    description: 'Cinza pedra com talheres cruzados e acento cobre — refinamento gastronômico.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 30%, #3a3530 0%, #1a1614 100%)' },
    defaults: {
      bg_color: '#2a2522', text_color: '#f0e8dc',
      button_color: 'rgba(184,115,51,0.18)', button_text_color: '#d49453',
      button_style: 'soft', font_family: 'Playfair Display',
    },
    Background: ChefBackground,
    group: 'static',
  },
  {
    id: 'imobiliaria',
    name: 'Real Estate Premium',
    description: 'Antracite com colunas verticais douradas e silhueta de casa em champagne.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 30%, #242830 0%, #0f1218 100%)' },
    defaults: {
      bg_color: '#1a1d24', text_color: '#e8d8b8',
      button_color: 'rgba(212,184,150,0.15)', button_text_color: '#d4b896',
      button_style: 'square', font_family: 'Playfair Display',
    },
    Background: ImobiliariaBackground,
    group: 'static',
  },

  // ── Estáticos premium (multiuso) ──────────────────────────────────────────
  {
    id: 'noir',
    name: 'Noir',
    description: 'Preto absoluto com fina linha de ouro horizontal — luxo silencioso.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 50%, #1a0e00 0%, #000000 100%)' },
    defaults: {
      bg_color: '#000000', text_color: '#f5e8c8',
      button_color: 'rgba(201,168,76,0.15)', button_text_color: '#c9a84c',
      button_style: 'square', font_family: 'Playfair Display',
    },
    Background: NoirBackground,
    group: 'static',
  },
  {
    id: 'linen',
    name: 'Linen',
    description: 'Off-white com textura de linho e acento sépia — orgânico e sofisticado.',
    previewStyle: { background: 'linear-gradient(135deg,#f5efe4 0%,#ece4d2 100%)' },
    defaults: {
      bg_color: '#f5efe4', text_color: '#3a2a1c',
      button_color: 'rgba(140,100,70,0.12)', button_text_color: '#6a4a2c',
      button_style: 'soft', font_family: 'Lato',
    },
    Background: LinenBackground,
    group: 'static',
  },
  {
    id: 'marble',
    name: 'Marble Luxe',
    description: 'Mármore branco com veios cinza e acento ouro rosado — premium atemporal.',
    previewStyle: { background: 'radial-gradient(ellipse at 50% 30%, #ffffff 0%, #d8d6d0 100%)' },
    defaults: {
      bg_color: '#f5f3ef', text_color: '#2a2520',
      button_color: 'rgba(190,140,120,0.15)', button_text_color: '#8a5a4a',
      button_style: 'rounded', font_family: 'Playfair Display',
    },
    Background: MarbleBackground,
    group: 'static',
  },

  {
    id: 'bubbles',
    name: 'Bolhas',
    description: 'Bolinhas coloridas translúcidas subindo suavemente pela tela.',
    previewStyle: { background: 'linear-gradient(180deg,#0d1b2a 0%,#1a0d2e 100%)' },
    defaults: {
      bg_color: '#0d1b2a', text_color: '#ffffff',
      button_color: 'rgba(255,255,255,0.12)', button_text_color: '#ffffff',
      button_style: 'pill', font_family: 'Fredoka One',
    },
    Background: BubblesBackground,
    thumbnail: '/temas/bolhas.png',
  },
];

export function getTheme(id: string): ThemeDefinition {
  return THEMES.find(t => t.id === id) ?? THEMES[0];
}

export type { ThemeDefinition };
