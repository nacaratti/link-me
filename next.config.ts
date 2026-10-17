import type { NextConfig } from "next";

// A Vercel da v1 tem as variáveis com prefixo VITE_; aceita as duas formas
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? "";

const supabaseHost = new URL(SUPABASE_URL || "https://uohxrknmwhglnzbdxedx.supabase.co").hostname;

const nextConfig: NextConfig = {
  devIndicators: false,
  env: {
    NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.linqu.es",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Fotos enviadas pelos usuários (bucket "media")
      { protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" },
      // Avatar do Google no login social
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      // Fotos de exemplo da landing (lib/samples.ts)
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
