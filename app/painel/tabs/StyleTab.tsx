"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import PageView from "@/components/page/PageView";
import PhoneFrame from "@/components/page/PhoneFrame";
import { PaletteSwatch, ProBadge } from "@/components/ui";
import { FONT_PAIRS } from "@/lib/fontPairs";
import { PALETTES } from "@/lib/palettes";
import { canUsePalette, canUseTemplate } from "@/lib/plans";
import { effectiveStyle } from "@/lib/profile";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { saveStyle } from "../actions";
import type { PanelCtx } from "../Painel";

/** Três escolhas fechadas: modelo, fontes e paleta. Nada de cor por item. */
export default function StyleTab({ profile, setProfile, blocks, toast }: PanelCtx) {
  const shown = effectiveStyle(profile);
  const [saving, setSaving] = useState(false);
  const templateFont = getTemplate(shown.template_id).defaultFont;
  const activeFont = profile.font_id ?? templateFont;

  async function choose(patch: { template_id?: string; palette_id?: string; font_id?: string | null }) {
    const prev = profile;
    const next = { ...profile, ...patch };
    setProfile(next);
    setSaving(true);
    const res = await saveStyle(next.template_id, next.palette_id, next.font_id);
    setSaving(false);
    if (!res.ok) {
      setProfile(prev);
      toast(res.error, "error");
    }
  }

  return (
    <div className="space-y-12">
      <section>
        <h1 className="t-title">Modelo</h1>
        <p className="mt-1 text-sm text-muted">O desenho da página. Seus links e fotos continuam os mesmos.</p>
        <div className="mt-5 grid grid-cols-2 gap-4">
          {TEMPLATES.map((t) => {
            const allowed = canUseTemplate(t.id, profile.plan);
            const active = shown.template_id === t.id;
            return (
              <button
                key={t.id}
                type="button"
                disabled={!allowed || saving}
                onClick={() => choose({ template_id: t.id })}
                className={cn(
                  "rounded-3xl border p-3 text-left transition-colors",
                  active ? "border-ink bg-surface" : "border-rule hover:border-ink",
                  !allowed && "cursor-not-allowed opacity-60 hover:border-rule",
                )}
              >
                <div className="pointer-events-none mx-auto w-fit">
                  <PhoneFrame scale={0.36}>
                    <PageView preview profile={{ ...shown, template_id: t.id, plan: "pro" }} blocks={blocks} />
                  </PhoneFrame>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="font-medium">{t.name}</span>
                  {!allowed && <ProBadge />}
                  {active && <Check className="ml-auto h-4 w-4" />}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted">{t.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="t-title">Fontes</h2>
        <p className="mt-1 text-sm text-muted">Título, texto e legenda escolhidos juntos. Cada modelo já vem com um par.</p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {FONT_PAIRS.map((f) => {
            const active = activeFont === f.id;
            const isDefault = f.id === templateFont;
            return (
              <button
                key={f.id}
                type="button"
                disabled={saving}
                // Escolher o par padrão do modelo volta a seguir o modelo (null)
                onClick={() => choose({ font_id: isDefault ? null : f.id })}
                className={cn(
                  "rounded-2xl border p-3 text-left transition-colors",
                  active ? "border-ink bg-surface" : "border-rule hover:border-ink",
                )}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span style={{ fontFamily: f.display }} className="text-2xl leading-none">
                    Aa
                  </span>
                  {active && <Check className="h-4 w-4" />}
                </span>
                <span style={{ fontFamily: f.body }} className="mt-2 block text-sm font-medium">
                  {f.name}
                </span>
                <span style={{ fontFamily: f.label }} className="block text-[0.7rem] text-muted">
                  {f.description}
                  {isDefault && " · padrão"}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="t-title">Paleta</h2>
        <p className="mt-1 text-sm text-muted">Fundo, texto e destaque escolhidos juntos, para sempre combinarem.</p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PALETTES.map((p) => {
            const allowed = canUsePalette(p.id, profile.plan);
            const active = shown.palette_id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                disabled={!allowed || saving}
                onClick={() => choose({ palette_id: p.id })}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border p-2.5 text-left text-sm transition-colors",
                  active ? "border-ink bg-surface" : "border-rule hover:border-ink",
                  !allowed && "cursor-not-allowed opacity-60 hover:border-rule",
                )}
              >
                <PaletteSwatch id={p.id} />
                <span className="flex flex-col gap-1">
                  <span className="font-medium">{p.name}</span>
                  {!allowed && <ProBadge />}
                </span>
                {active && <Check className="ml-auto h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
