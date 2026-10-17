import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Linques — sua página de links, pronta em minutos",
    template: "%s — linqu.es",
  },
  description:
    "Responda algumas perguntas e ganhe uma página de links bonita, com modelos e paletas feitos por designers.",
};

export const viewport: Viewport = { themeColor: "#faf7f2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={fontVariables}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
