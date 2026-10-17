"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowLeft, Eye, X } from "lucide-react";
import PageView from "@/components/page/PageView";
import PhoneFrame from "@/components/page/PhoneFrame";
import { buildPage, pickPalette, pickTemplate, type Answers } from "@/lib/builder";
import { getProfession } from "@/lib/presets";
import type { Block, PageProfile, Plan } from "@/lib/types";
import { publish } from "./actions";
import { STEPS, type Draft, type StepCtx } from "./steps";

export interface WizardProps {
  userId: string;
  plan: Plan;
  username: string;
  initial: Draft;
}

/** Rascunho → respostas completas, com textos de exemplo onde ainda falta algo */
export function draftToAnswers(d: Draft): Answers {
  const preset = getProfession(d.profession);
  return {
    profession: preset.id,
    goal: d.goal ?? "redes",
    template_id: d.template_id,
    palette_id: d.palette_id,
    display_name: d.display_name ?? "",
    headline: d.headline ?? "",
    bio: d.bio ?? "",
    avatar_url: d.avatar_url,
    photos: d.photos,
    featured: d.featured ?? null,
    links: d.links ?? [],
    whatsapp: d.whatsapp ?? null,
  };
}

/** A prévia ao vivo usa o mesmo buildPage da publicação, com ids de mentira */
export function previewOf(d: Draft, plan: Plan, username: string): { profile: PageProfile; blocks: Block[] } {
  const preset = getProfession(d.profession);
  const answers = draftToAnswers(d);
  const built = buildPage(
    {
      ...answers,
      display_name: answers.display_name || "Seu nome",
      headline: answers.headline || (d.profession ? preset.headlineExample : ""),
      links: answers.links.length ? answers.links : [{ url: "instagram.com/voce" }, { url: "seusite.com.br" }],
    },
    plan,
  );
  return {
    profile: { ...built.profile, id: "draft", username: username || "voce", plan, font_id: null },
    blocks: built.blocks.map((b, i) => ({ ...b, id: `d${i}` }) as Block),
  };
}

export default function Wizard({ userId, plan, username, initial }: WizardProps) {
  const steps = useMemo(() => STEPS.filter((s) => s.id !== "username" || !username), [username]);
  const [draft, setDraft] = useState<Draft>(initial);
  const [index, setIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishing, startPublish] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);

  const step = steps[index];
  const preview = useMemo(() => previewOf(draft, plan, draft.username ?? username), [draft, plan, username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [index]);

  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  function next(patch?: Partial<Draft>) {
    if (patch) update(patch);
    setError(null);
    setIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function doPublish() {
    setError(null);
    startPublish(async () => {
      const res = await publish(draftToAnswers(draft), draft.username ?? username);
      if (res?.error) setError(res.error);
    });
  }

  const ctx: StepCtx = {
    draft,
    update,
    next,
    plan,
    userId,
    username: draft.username ?? username,
    preview,
    publishing,
    publish: doPublish,
    // Ao escolher a profissão, já deixa modelo e paleta sugeridos marcados
    suggest: (profession) => ({
      template_id: pickTemplate({ profession }, plan),
      palette_id: pickPalette({ profession }, plan),
    }),
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_480px]">
      <section className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-rule bg-bg/90 px-5 py-4 backdrop-blur sm:px-8">
          <Link href="/painel" aria-label="linqu.es" className="text-ink">
          <Logo />
        </Link>
          <div className="ml-auto flex items-center gap-3">
            <span className="t-caption">
              {index + 1} de {steps.length}
            </span>
            <div className="h-1 w-24 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-500"
                style={{ width: `${((index + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-xl flex-1 px-5 pb-40 pt-8 sm:px-8">
          {/* Conversa até aqui: tocar na resposta volta para aquela pergunta */}
          {steps.slice(0, index).map((s, i) => (
            <div key={s.id} className="mb-5 space-y-2">
              <BotBubble>{s.question(ctx)}</BotBubble>
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="ml-auto block max-w-[85%] rounded-2xl rounded-tr-sm bg-ink px-4 py-2.5 text-left text-sm text-bg transition-opacity hover:opacity-85"
                title="Mudar esta resposta"
              >
                {s.summary(ctx) || "Pular"}
              </button>
            </div>
          ))}

          <div key={step.id} className="rise space-y-4">
            <BotBubble>{step.question(ctx)}</BotBubble>
            {step.hint && <p className="pl-1 text-sm text-muted">{step.hint(ctx)}</p>}
            <div className="pt-2">{step.render(ctx)}</div>
            {error && <p className="text-sm text-[#b42318]">{error}</p>}
            {index > 0 && (
              <button
                type="button"
                onClick={() => setIndex(index - 1)}
                className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </button>
            )}
          </div>
          <div ref={bottomRef} />
        </div>
      </section>

      {/* Prévia: fixa ao lado no desktop, em tela cheia sob demanda no celular */}
      <aside className="hidden border-l border-rule bg-surface lg:block">
        <div className="sticky top-0 flex h-screen items-center justify-center">
          <PhoneFrame scale={0.86}>
            <PageView preview profile={preview.profile} blocks={preview.blocks} />
          </PhoneFrame>
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
          <PhoneFrame scale={Math.min(1, (typeof window !== "undefined" ? window.innerHeight - 120 : 700) / 780)}>
            <PageView preview profile={preview.profile} blocks={preview.blocks} />
          </PhoneFrame>
        </div>
      )}
    </div>
  );
}

function BotBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm text-on-accent">
        l
      </span>
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm bg-surface px-4 py-3 leading-relaxed">{children}</div>
    </div>
  );
}
