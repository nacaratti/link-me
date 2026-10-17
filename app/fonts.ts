import { Archivo, Bodoni_Moda, Fraunces, Geist, Geist_Mono, IBM_Plex_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";

// Só as fontes do Editorial (que também veste o app) entram em preload;
// as dos outros modelos baixam quando a página usa o modelo.
const bodoni = Bodoni_Moda({ variable: "--font-bodoni", subsets: ["latin"], display: "swap" });
const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], display: "swap" });
const plexMono = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap", preload: false });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap", preload: false });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap", preload: false });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap", preload: false });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap", preload: false });

export const fontVariables = [bodoni, archivo, plexMono, jakarta, fraunces, inter, geist, geistMono]
  .map((f) => f.variable)
  .join(" ");
