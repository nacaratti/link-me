import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import Wizard from "./Wizard";
import type { Draft } from "./steps";

export const metadata: Metadata = { title: "Criar minha página", robots: { index: false } };

export default async function CriarPage({ searchParams }: { searchParams: Promise<{ refazer?: string }> }) {
  const { refazer } = await searchParams;
  const { user, profile } = await requireUser();
  if (!profile) redirect("/entrar");
  // Quem já publicou só volta aqui pelo botão "Refazer com o assistente"
  if (profile.onboarded_at && !refazer) redirect("/painel");

  const saved = (profile.onboarding_answers ?? null) as Draft | null;
  const initial: Draft = saved ?? {
    display_name: profile.display_name !== profile.username ? profile.display_name : "",
    avatar_url: profile.avatar_url || undefined,
  };

  return <Wizard userId={user.id} plan={profile.plan} username={profile.username} initial={initial} />;
}
