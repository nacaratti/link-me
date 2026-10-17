import {
  Archivo,
  Bodoni_Moda,
  Fraunces,
  Geist,
  Geist_Mono,
  IBM_Plex_Mono,
  Inter,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Source_Sans_3,
  Space_Grotesk,
  Space_Mono,
} from "next/font/google";

// Só as fontes do par Clássica (que também veste o app) entram em preload;
// as dos outros pares (lib/fontPairs.ts) baixam quando a página usa o par.
const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], display: "swap" });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], display: "swap" });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap", preload: false });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap", preload: false });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap", preload: false });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap", preload: false });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap", preload: false });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], display: "swap", preload: false });
const sourceSans = Source_Sans_3({ variable: "--font-source-sans", subsets: ["latin"], display: "swap", preload: false });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap", preload: false });
const spaceMono = Space_Mono({ variable: "--font-space-mono", subsets: ["latin"], weight: ["400", "700"], display: "swap", preload: false });

export const fontVariables = [
  bodoni, archivo, plexMono, jakarta, fraunces, inter, geist, geistMono, playfair, sourceSans, spaceGrotesk, spaceMono,
]
  .map((f) => f.variable)
  .join(" ");
