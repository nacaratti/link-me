import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import PageView from "@/components/page/PageView";
import Tracker from "@/components/page/Tracker";
import { getPublicPage } from "@/lib/data";
import { getPalette } from "@/lib/palettes";
import { RESERVED_USERNAMES } from "@/lib/reserved";

// Páginas geradas na primeira visita e guardadas em cache; o painel invalida ao salvar
export const revalidate = 3600;
export function generateStaticParams() {
  return [];
}

type Params = { params: Promise<{ username: string }> };

async function load(raw: string) {
  const username = decodeURIComponent(raw).toLowerCase();
  if (RESERVED_USERNAMES.has(username)) return null;
  return getPublicPage(username);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = await load((await params).username);
  if (!page) return { title: "Página não encontrada" };
  const { profile } = page;

  const title = profile.headline ? `${profile.display_name} · ${profile.headline}` : profile.display_name;
  const description = profile.bio || `Os links de ${profile.display_name} em um só lugar.`;
  const image = profile.photos[0] || profile.avatar_url;

  return {
    title: { absolute: `${profile.display_name} — linqu.es` },
    description,
    alternates: { canonical: `/${profile.username}` },
    openGraph: {
      type: "profile",
      siteName: "linqu.es",
      title,
      description,
      url: `/${profile.username}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: profile.photos[0] ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export async function generateViewport({ params }: Params): Promise<Viewport> {
  const page = await load((await params).username);
  // Barra do navegador na cor da página
  return { themeColor: page ? getPalette(page.profile.palette_id).bg : "#faf7f2" };
}

export default async function PublicPage({ params }: Params) {
  const page = await load((await params).username);
  if (!page) notFound();

  return (
    <>
      <PageView profile={page.profile} blocks={page.blocks} className="min-h-screen" />
      <Tracker profileId={page.profile.id} />
    </>
  );
}
