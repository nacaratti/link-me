"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Eye, X } from "lucide-react";
import PageView from "@/components/page/PageView";
import PhoneFrame from "@/components/page/PhoneFrame";
import { effectiveStyle } from "@/lib/profile";
import type { OwnProfile } from "@/lib/session";
import type { Stats } from "@/lib/stats";
import type { Block } from "@/lib/types";
import { cn } from "@/lib/utils";
import ContentTab from "./tabs/ContentTab";
import StyleTab from "./tabs/StyleTab";
import ProfileTab from "./tabs/ProfileTab";
import AccountTab from "./tabs/AccountTab";

export type Tab = "conteudo" | "estilo" | "perfil" | "conta";

const TABS: { id: Tab; label: string }[] = [
  { id: "conteudo", label: "Conteúdo" },
  { id: "estilo", label: "Estilo" },
  { id: "perfil", label: "Perfil" },
  { id: "conta", label: "Números e plano" },
];

export interface PanelCtx {
  userId: string;
  email: string;
  profile: OwnProfile;
  setProfile: (p: OwnProfile) => void;
  blocks: Block[];
  setBlocks: (b: Block[]) => void;
  stats: Stats;
  toast: (message: string, kind?: "ok" | "error") => void;
}

export default function Painel(props: {
  userId: string;
  email: string;
  profile: OwnProfile;
  blocks: Block[];
  stats: Stats;
  initialTab: Tab;
  notice: "published" | "upgraded" | null;
}) {
  const [tab, setTab] = useState<Tab>(props.initialTab);
  const [profile, setProfile] = useState(props.profile);
  const [blocks, setBlocks] = useState(props.blocks);
  const [toastMsg, setToastMsg] = useState<{ message: string; kind: "ok" | "error" } | null>(
    props.notice === "published"
      ? { message: "Sua página está no ar!", kind: "ok" }
      : props.notice === "upgraded"
        ? { message: "Bem-vindo ao PRO! Tudo liberado.", kind: "ok" }
        : null,
  );
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!toastMsg) return;
    const id = setTimeout(() => setToastMsg(null), 3500);
    return () => clearTimeout(id);
  }, [toastMsg]);

  // Tira ?publicado / ?upgrade do endereço para o aviso não voltar no F5
  useEffect(() => {
    if (props.notice) history.replaceState(null, "", `/painel${tab === "conteudo" ? "" : `?aba=${tab}`}`);
  }, [props.notice, tab]);

  const ctx: PanelCtx = {
    userId: props.userId,
    email: props.email,
    profile,
    setProfile,
    blocks,
    setBlocks,
    stats: props.stats,
    toast: (message, kind = "ok") => setToastMsg({ message, kind }),
  };

  const pageUrl = `linqu.es/${profile.username}`;
  const preview = <PageView preview profile={effectiveStyle(profile)} blocks={blocks} />;

  async function copy() {
    await navigator.clipboard.writeText(`https://${pageUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_460px]">
      <div className="min-w-0">
        <header className="sticky top-0 z-10 border-b border-rule bg-bg/90 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 pt-4 sm:px-8">
            <Link href="/" className="font-display text-xl">
              linqu.es
            </Link>
            <div className="ml-auto flex min-w-0 items-center gap-1 rounded-full border border-rule bg-surface py-1 pl-4 pr-1 text-sm">
              <span className="truncate">{pageUrl}</span>
              <button type="button" onClick={copy} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-bg" aria-label="Copiar link">
                {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
              </button>
              <a href={`/${profile.username}`} target="_blank" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-bg" aria-label="Abrir página">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <nav className="mx-auto flex max-w-2xl gap-6 overflow-x-auto px-5 sm:px-8" aria-label="Seções do painel">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "shrink-0 border-b-2 pb-3 pt-4 text-sm font-medium transition-colors",
                  tab === t.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-2xl px-5 pb-32 pt-8 sm:px-8">
          {tab === "conteudo" && <ContentTab {...ctx} />}
          {tab === "estilo" && <StyleTab {...ctx} />}
          {tab === "perfil" && <ProfileTab {...ctx} />}
          {tab === "conta" && <AccountTab {...ctx} />}
        </main>
      </div>

      <aside className="hidden border-l border-rule bg-surface lg:block">
        <div className="sticky top-0 flex h-screen items-center justify-center">
          <PhoneFrame scale={0.86}>{preview}</PhoneFrame>
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setShowPreview(true)}
        className="fixed bottom-5 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-bg shadow-lg lg:hidden"
      >
        <Eye className="h-4 w-4" /> Ver prévia
      </button>
      {showPreview && (
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-black/70 p-4 lg:hidden">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className="mb-3 ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"
            aria-label="Fechar prévia"
          >
            <X className="h-5 w-5" />
          </button>
          <PhoneFrame scale={Math.min(1, (window.innerHeight - 120) / 780)}>{preview}</PhoneFrame>
        </div>
      )}

      {toastMsg && (
        <div
          role="status"
          className={cn(
            "fixed left-1/2 top-5 z-40 -translate-x-1/2 rounded-full px-5 py-3 text-sm font-medium shadow-lg",
            toastMsg.kind === "ok" ? "bg-ink text-bg" : "bg-[#b42318] text-white",
          )}
        >
          {toastMsg.message}
        </div>
      )}
    </div>
  );
}
