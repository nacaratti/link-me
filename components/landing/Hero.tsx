"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import PageView from "@/components/page/PageView";
import PhoneFrame from "@/components/page/PhoneFrame";
import { getFontPair } from "@/lib/fontPairs";
import { FREE_LINK_LIMIT } from "@/lib/plans";
import { getPalette, paletteVars } from "@/lib/palettes";
import { normalizeUsername } from "@/lib/reserved";
import { SAMPLES } from "@/lib/samples";
import { getTemplate } from "@/lib/templates";
import { cn } from "@/lib/utils";

const TYPE_MS = 70; // por letra
const HOLD_MS = 2600; // endereço completo na tela

/**
 * Abertura que se veste com as páginas dos clientes: o endereço de cada
 * exemplo é digitado na fonte do modelo dele, e a seção inteira (fundo,
 * texto, destaque) assume a paleta daquela página. É a demonstração de
 * "modelo + paleta + fontes" sem precisar explicar.
 */
export default function Hero() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(SAMPLES[0].profile.username.length);
  const [claim, setClaim] = useState("");

  const sample = SAMPLES[index];
  const name = sample.profile.username;
  const palette = getPalette(sample.profile.palette_id);
  const font = getFontPair(sample.profile.font_id, getTemplate(sample.profile.template_id).defaultFont);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const id = setTimeout(() => setIndex((i) => (i + 1) % SAMPLES.length), 5000);
      return () => clearTimeout(id);
    }
    if (typed < name.length) {
      const id = setTimeout(() => setTyped((t) => t + 1), TYPE_MS);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setTyped(0);
      setIndex((i) => (i + 1) % SAMPLES.length);
    }, HOLD_MS);
    return () => clearTimeout(id);
  }, [typed, name]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const u = normalizeUsername(claim);
    const next = u ? `/criar?u=${encodeURIComponent(u)}` : "/criar";
    router.push(`/entrar?next=${encodeURIComponent(next)}`);
  }

  return (
    <section
      style={paletteVars(palette)}
      className="relative overflow-hidden bg-bg text-ink transition-[background-color,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
    >
      <header className="relative z-10 mx-auto flex max-w-6xl items-center px-5 py-5 sm:px-8">
        <Link href="/" aria-label="linqu.es">
          <Logo />
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          <Link href="/entrar" className="px-3 py-2 opacity-70 transition-opacity hover:opacity-100">
            Entrar
          </Link>
          <Link
            href="/entrar"
            className="hidden rounded-full border border-current px-4 py-2 font-medium transition-colors sm:inline-block"
          >
            Criar conta
          </Link>
        </nav>
      </header>

      <div className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-5 pb-16 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-6 lg:pb-24 lg:pt-12">
        <div>
          <h1 className="max-w-[16ch] font-display text-[clamp(2.4rem,6vw,4.25rem)] font-medium leading-[1.02] tracking-tight">
            Sua página de links, montada numa conversa.
          </h1>
          <p className="mt-5 max-w-[44ch] text-lg leading-relaxed opacity-75">
            Você conta o que faz e cola seus links. A gente escolhe o modelo, as cores e as fontes. No fim, você ganha um
            endereço assim:
          </p>

          {/* O endereço do exemplo, na fonte do modelo dele */}
          <p className="sr-only">Exemplos: {SAMPLES.map((s) => `linqu.es/${s.profile.username}`).join(", ")}</p>
          <p
            aria-hidden="true"
            className="mt-7 min-h-[1.1em] text-[clamp(1.9rem,6.4vw,3.6rem)] leading-[1.05] tracking-tight [overflow-wrap:anywhere]"
            style={{ fontFamily: font.display }}
          >
            <span className="opacity-45">linqu.es/</span>
            <span>{name.slice(0, typed)}</span>
            <span className="caret ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.12em] bg-accent" />
          </p>

          <form onSubmit={submit} className="mt-8 max-w-md">
            <label htmlFor="claim" className="text-sm opacity-75">
              Escolha o seu
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-full border border-rule bg-surface p-1.5 pl-5 transition-colors focus-within:border-ink" style={{ transitionDuration: "700ms" }}>
              <span className="shrink-0 opacity-50">linqu.es/</span>
              <input
                id="claim"
                value={claim}
                onChange={(e) => setClaim(normalizeUsername(e.target.value))}
                placeholder="seunome"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="h-11 min-w-0 flex-1 bg-transparent outline-none placeholder:opacity-40"
              />
              <button className="h-11 shrink-0 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent transition-[background-color,color,opacity] duration-700 hover:opacity-90">
                Criar página
              </button>
            </div>
            <p className="mt-3 text-sm opacity-60">Grátis até {FREE_LINK_LIMIT} links, sem cartão.</p>
          </form>
        </div>

        {/* A página do exemplo; os quatro celulares ficam empilhados e só o atual aparece */}
        <div className="relative mx-auto grid w-fit" aria-hidden="true">
          {SAMPLES.map((s, i) => (
            <div
              key={s.profile.username}
              className={cn(
                "col-start-1 row-start-1 transition-[opacity,translate] ease-[cubic-bezier(0.16,1,0.3,1)]",
                i === index ? "translate-y-0 opacity-100 delay-150 duration-1000" : "translate-y-4 opacity-0 duration-300",
              )}
            >
              <PhoneFrame scale={0.78}>
                <PageView preview profile={{ ...s.profile, plan: "pro" }} blocks={s.blocks} />
              </PhoneFrame>
            </div>
          ))}
          <div className="mt-5 flex justify-center gap-2">
            {SAMPLES.map((s, i) => (
              <span
                key={s.profile.username}
                className={cn(
                  "h-1.5 rounded-full bg-current transition-[width,opacity] duration-500",
                  i === index ? "w-6 opacity-80" : "w-1.5 opacity-25",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
