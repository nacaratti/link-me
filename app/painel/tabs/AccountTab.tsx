"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Lock, Sparkles } from "lucide-react";
import { Primary } from "@/components/ui";
import { FREE_LINK_LIMIT, PRO_LINK_LIMIT } from "@/lib/plans";
import { STATS_DAYS } from "@/lib/stats";
import { createClient } from "@/lib/supabase/client";
import type { PanelCtx } from "../Painel";

const fmt = (n: number) => n.toLocaleString("pt-BR");

export default function AccountTab({ profile, setProfile, blocks, stats, email, toast }: PanelCtx) {
  const pro = profile.plan === "pro";
  const max = Math.max(1, ...stats.daily.map((d) => d.views));
  const ctr = stats.views ? Math.round((stats.clicks / stats.views) * 100) : 0;
  const deviceTotal = stats.devices.mobile + stats.devices.tablet + stats.devices.desktop;

  return (
    <div className="space-y-12">
      <section>
        <h1 className="t-title">Últimos {STATS_DAYS} dias</h1>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <Metric label="Visitas" value={fmt(stats.views)} />
          <Metric label="Cliques" value={fmt(stats.clicks)} />
          <Metric label="Taxa de clique" value={`${ctr}%`} />
        </div>

        <div className="relative mt-6 rounded-2xl border border-rule p-5">
          {!pro && <ProOverlay text="Gráfico diário, aparelhos e de onde vêm as visitas são do PRO." />}
          <div className={pro ? "" : "pointer-events-none select-none blur-sm"} aria-hidden={!pro}>
            <p className="t-label">Visitas por dia</p>
            <div className="mt-4 flex h-28 items-end gap-[3px]" role="img" aria-label="Gráfico de visitas por dia">
              {stats.daily.map((d) => (
                <div
                  key={d.day}
                  title={`${d.day.split("-").reverse().join("/")}: ${d.views} visita${d.views === 1 ? "" : "s"}`}
                  className="flex-1 rounded-t-sm bg-accent/80"
                  style={{ height: `${Math.max(3, (d.views / max) * 100)}%`, opacity: d.views ? 1 : 0.25 }}
                />
              ))}
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="t-label">Aparelhos</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {(["mobile", "desktop", "tablet"] as const).map((k) => (
                    <li key={k} className="flex justify-between">
                      <span>{k === "mobile" ? "Celular" : k === "desktop" ? "Computador" : "Tablet"}</span>
                      <span className="text-muted">{deviceTotal ? Math.round((stats.devices[k] / deviceTotal) * 100) : 0}%</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="t-label">De onde vêm</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {stats.referrers.length === 0 && <li className="text-muted">Sem dados ainda.</li>}
                  {stats.referrers.map((r) => (
                    <li key={r.host} className="flex justify-between gap-3">
                      <span className="truncate">{r.host}</span>
                      <span className="text-muted">{fmt(r.count)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="t-label">Cliques por link</p>
          <ul className="mt-3 divide-y divide-rule border-y border-rule text-sm">
            {blocks.map((b) => (
              <li key={b.id} className="flex justify-between gap-3 py-2.5">
                <span className="truncate">{b.data.title}</span>
                <span className="text-muted">{fmt(stats.byBlock[b.id] ?? 0)}</span>
              </li>
            ))}
            {profile.whatsapp_enabled && (
              <li className="flex justify-between gap-3 py-2.5">
                <span>Botão do WhatsApp</span>
                <span className="text-muted">{fmt(stats.whatsappClicks)}</span>
              </li>
            )}
          </ul>
        </div>
      </section>

      <PlanCard pro={pro} expiresAt={profile.pro_expires_at} onCanceled={(at) => setProfile({ ...profile, pro_expires_at: at })} toast={toast} />

      <section className="space-y-3">
        <h2 className="t-title">Conta</h2>
        <p className="text-sm text-muted">{email}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/criar?refazer=1"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-rule px-5 text-sm font-medium transition-colors hover:border-ink"
          >
            <Sparkles className="h-4 w-4" /> Refazer com o assistente
          </Link>
          <form action="/auth/sair" method="post">
            <button className="inline-flex h-11 items-center rounded-full px-5 text-sm text-muted hover:text-ink">Sair</button>
          </form>
        </div>
        <p className="text-xs text-muted">Refazer com o assistente substitui seus links e destaques pelos novos.</p>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface p-4">
      <p className="t-caption">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
    </div>
  );
}

function ProOverlay({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-bg/60 p-6 text-center">
      <Lock className="h-5 w-5 text-accent" />
      <p className="max-w-xs text-sm font-medium">{text}</p>
    </div>
  );
}

function PlanCard({
  pro,
  expiresAt,
  onCanceled,
  toast,
}: {
  pro: boolean;
  expiresAt: string | null;
  onCanceled: (at: string) => void;
  toast: PanelCtx["toast"];
}) {
  const [busy, setBusy] = useState(false);

  async function upgrade() {
    setBusy(true);
    const { data, error } = await createClient().functions.invoke("payment-create", { body: {} });
    if (error || !data?.checkout_url) {
      setBusy(false);
      return toast("Não foi possível abrir o pagamento agora.", "error");
    }
    location.href = data.checkout_url;
  }

  async function cancel() {
    if (!confirm("Cancelar o PRO? Ele continua ativo até o fim do período já pago.")) return;
    setBusy(true);
    const { data, error } = await createClient().functions.invoke("subscription-cancel", { body: {} });
    setBusy(false);
    if (error || !data?.expires_at) return toast("Não foi possível cancelar agora.", "error");
    onCanceled(data.expires_at);
    toast("Cancelamento agendado.");
  }

  const until = expiresAt ? new Date(expiresAt).toLocaleDateString("pt-BR") : null;

  return (
    <section className="rounded-3xl bg-ink p-6 text-bg">
      <p className="t-label !text-[#c9a961]">Seu plano</p>
      <h2 className="mt-2 font-display text-3xl">{pro ? "PRO" : "Grátis"}</h2>
      {pro ? (
        <>
          <p className="mt-2 text-sm opacity-75">
            Todos os modelos e paletas, até {PRO_LINK_LIMIT} links, estatísticas completas e sem a marca linqu.es.
            {until && ` Ativo até ${until}.`}
          </p>
          <button type="button" onClick={cancel} disabled={busy} className="mt-5 text-sm underline opacity-75 hover:opacity-100">
            {busy ? "Um instante…" : "Cancelar assinatura"}
          </button>
        </>
      ) : (
        <>
          <ul className="mt-4 space-y-1.5 text-sm opacity-85">
            <li>· Modelo Vitrine e as 10 paletas (hoje você tem 3 modelos e 4 paletas)</li>
            <li>· Até {PRO_LINK_LIMIT} links (hoje {FREE_LINK_LIMIT})</li>
            <li>· Gráfico diário, aparelhos e origem das visitas</li>
            <li>· Sem &ldquo;feito com linqu.es&rdquo; no rodapé</li>
          </ul>
          <Primary onClick={upgrade} disabled={busy} className="mt-6 bg-[#c9a961] text-[#12100e]">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assinar o PRO"}
          </Primary>
        </>
      )}
    </section>
  );
}
