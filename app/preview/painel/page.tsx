import { notFound } from "next/navigation";
import Painel from "@/app/painel/Painel";
import { SAMPLES } from "@/lib/samples";
import { STATS_DAYS } from "@/lib/stats";

/** Bancada do painel sem login (só em desenvolvimento; salvar não funciona aqui) */
export default async function PreviewPainel({ searchParams }: { searchParams: Promise<{ aba?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { aba } = await searchParams;
  const sample = SAMPLES[0];
  const daily = Array.from({ length: STATS_DAYS }, (_, i) => ({ day: `2026-10-${String(i + 1).padStart(2, "0")}`, views: (i * 7) % 23 }));
  return (
    <Painel
      userId="dev"
      email="dev@exemplo.com"
      profile={{ ...sample.profile, pro_expires_at: null, onboarding_answers: null, onboarded_at: "2026-10-01" }}
      blocks={sample.blocks}
      stats={{ views: 320, clicks: 88, daily, devices: { mobile: 250, tablet: 10, desktop: 60 }, referrers: [{ host: "instagram.com", count: 200 }, { host: "direto", count: 90 }], whatsappClicks: 12, byBlock: { s2: 40 } }}
      initialTab={(aba as "conteudo") ?? "conteudo"}
      notice={null}
    />
  );
}
