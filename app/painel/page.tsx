import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BLOCK_COLUMNS } from "@/lib/data";
import { requireUser } from "@/lib/session";
import { getStats } from "@/lib/stats";
import type { Block } from "@/lib/types";
import Painel, { type Tab } from "./Painel";

export const metadata: Metadata = { title: "Painel", robots: { index: false } };

export default async function PainelPage({
  searchParams,
}: {
  searchParams: Promise<{ aba?: string; publicado?: string; upgrade?: string }>;
}) {
  const { aba, publicado, upgrade } = await searchParams;
  const { supabase, user, profile } = await requireUser();
  if (!profile) redirect("/entrar");
  if (!profile.onboarded_at || !profile.username) redirect("/criar");

  const [{ data: blocks }, stats] = await Promise.all([
    supabase.from("blocks").select(BLOCK_COLUMNS).eq("profile_id", user.id).order("sort_order"),
    getStats(supabase, user.id),
  ]);

  const tabs: Tab[] = ["conteudo", "estilo", "perfil", "conta"];
  const initialTab = (tabs as string[]).includes(aba ?? "") ? (aba as Tab) : "conteudo";

  return (
    <Painel
      userId={user.id}
      email={user.email ?? ""}
      profile={profile}
      blocks={(blocks ?? []) as Block[]}
      stats={stats}
      initialTab={initialTab}
      notice={publicado ? "published" : upgrade === "success" ? "upgraded" : null}
    />
  );
}
