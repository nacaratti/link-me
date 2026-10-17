"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Trash2, X } from "lucide-react";
import { Chip, PaletteSwatch, PhotoPicker, Primary, ProBadge, Skip, inputClass, textareaClass } from "@/components/ui";
import BrandIcon from "@/components/BrandIcon";
import PageView from "@/components/page/PageView";
import PhoneFrame from "@/components/page/PhoneFrame";
import type { Answers } from "@/lib/builder";
import { defaultTitle, detectBrand, normalizeUrl } from "@/lib/links";
import { PALETTES, getPalette } from "@/lib/palettes";
import { canUsePalette, canUseTemplate, linkLimit } from "@/lib/plans";
import { FEATURED_KINDS, GOALS, PROFESSIONS, getProfession, type ProfessionId } from "@/lib/presets";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import type { Block, PageProfile, Plan } from "@/lib/types";
import { cn } from "@/lib/utils";
import { checkUsername } from "./actions";

export type Draft = Partial<Omit<Answers, "featured">> & {
  username?: string;
  featured?: Answers["featured"];
};

export interface StepCtx {
  draft: Draft;
  update: (patch: Partial<Draft>) => void;
  next: (patch?: Partial<Draft>) => void;
  plan: Plan;
  userId: string;
  username: string;
  preview: { profile: PageProfile; blocks: Block[] };
  publishing: boolean;
  publish: () => void;
  suggest: (profession: ProfessionId) => Pick<Draft, "template_id" | "palette_id">;
}

interface Step {
  id: string;
  question: (c: StepCtx) => React.ReactNode;
  hint?: (c: StepCtx) => React.ReactNode;
  summary: (c: StepCtx) => string;
  render: (c: StepCtx) => React.ReactNode;
}

// ── Passos ─────────────────────────────────────────────────────────────────

function UsernameInput({ c }: { c: StepCtx }) {
  const [value, setValue] = useState(c.draft.username ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    start(async () => {
      const res = await checkUsername(value);
      if (res.error) setError(res.error);
      else c.next({ username: res.username });
    });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex h-12 items-center rounded-xl border border-rule bg-bg pl-4 focus-within:border-ink">
        <span className="text-muted">linqu.es/</span>
        <input
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          placeholder="seunome"
          className="h-full min-w-0 flex-1 bg-transparent pr-4 outline-none"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>
      {error && <p className="text-sm text-[#b42318]">{error}</p>}
      <Primary type="submit" disabled={pending || value.trim().length < 3}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Esse é meu"}
      </Primary>
    </form>
  );
}

function AboutForm({ c }: { c: StepCtx }) {
  const preset = getProfession(c.draft.profession);
  const [name, setName] = useState(c.draft.display_name ?? "");
  const [headline, setHeadline] = useState(c.draft.headline ?? "");
  const [bio, setBio] = useState(c.draft.bio ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        c.next({ display_name: name, headline, bio });
      }}
      className="space-y-3"
    >
      <input autoFocus value={name} onChange={(e) => { setName(e.target.value); c.update({ display_name: e.target.value }); }} placeholder="Seu nome ou da sua marca" className={inputClass} maxLength={60} required />
      <input value={headline} onChange={(e) => { setHeadline(e.target.value); c.update({ headline: e.target.value }); }} placeholder={preset.headlineExample} className={inputClass} maxLength={60} />
      <textarea
        value={bio}
        onChange={(e) => { setBio(e.target.value); c.update({ bio: e.target.value }); }}
        placeholder={preset.bioExample}
        rows={3}
        maxLength={160}
        className={textareaClass}
      />
      <div className="flex items-center justify-between">
        <Primary type="submit" disabled={!name.trim()}>Continuar</Primary>
        <span className="t-caption">{bio.length}/160</span>
      </div>
    </form>
  );
}

function PhotosForm({ c }: { c: StepCtx }) {
  const photos = c.draft.photos ?? [];
  const usesCover = ["editorial", "vitrine"].includes(getTemplate(c.draft.template_id).id);

  return (
    <div className="space-y-6">
      <PhotoPicker userId={c.userId} value={c.draft.avatar_url} onChange={(url) => c.update({ avatar_url: url })} label="Foto de perfil" round maxSide={600} />
      <div>
        <p className="mb-3 text-sm font-medium">
          Fotos de capa <span className="font-normal text-muted">({usesCover ? "aparecem grandes no topo; com mais de uma, elas se alternam" : "o modelo Cartão usa só a de perfil"})</span>
        </p>
        <div className="flex flex-wrap gap-3">
          {photos.map((url, i) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => c.update({ photos: photos.filter((_, j) => j !== i) })}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                aria-label="Remover foto"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {photos.length < 4 && (
            <PhotoPicker userId={c.userId} onChange={(url) => url && c.update({ photos: [...photos, url] })} label={photos.length ? "Mais uma" : "Adicionar"} />
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Primary onClick={() => c.next()}>Continuar</Primary>
        {!c.draft.avatar_url && !photos.length && <Skip onClick={() => c.next()}>Sem fotos por agora</Skip>}
      </div>
    </div>
  );
}

function FeaturedForm({ c }: { c: StepCtx }) {
  const f = c.draft.featured;
  const kind = FEATURED_KINDS.find((k) => k.id === f?.kind);

  if (!f || !kind) {
    return (
      <div className="flex flex-wrap gap-2">
        {FEATURED_KINDS.map((k) => (
          <Chip key={k.id} onClick={() => c.update({ featured: { kind: k.id, title: "", url: "" } })}>
            {k.label}
          </Chip>
        ))}
        <Chip onClick={() => c.next({ featured: null })}>Não, só os links</Chip>
      </div>
    );
  }

  const set = (patch: Partial<NonNullable<Draft["featured"]>>) => c.update({ featured: { ...f, ...patch } });

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        {kind.label} · <button type="button" className="underline" onClick={() => c.update({ featured: undefined })}>trocar</button>
      </p>
      <input autoFocus value={f.title} onChange={(e) => set({ title: e.target.value })} placeholder="Título (ex.: nome do álbum, do serviço…)" className={inputClass} maxLength={60} />
      <input value={f.subtitle ?? ""} onChange={(e) => set({ subtitle: e.target.value })} placeholder="Detalhe curto (opcional: preço, data, duração…)" className={inputClass} maxLength={60} />
      <input value={f.url} onChange={(e) => set({ url: e.target.value })} placeholder={`Link (${kind.hint})`} className={inputClass} inputMode="url" autoCapitalize="none" />
      <PhotoPicker userId={c.userId} value={f.image} onChange={(url) => set({ image: url })} label="Imagem do destaque (opcional)" maxSide={1200} />
      <div className="flex gap-2 pt-1">
        <Primary disabled={!f.title.trim() || !f.url.trim()} onClick={() => c.next()}>Continuar</Primary>
        <Skip onClick={() => c.next({ featured: null })}>Deixar sem destaque</Skip>
      </div>
    </div>
  );
}

function LinksForm({ c }: { c: StepCtx }) {
  const links = c.draft.links ?? [];
  const [text, setText] = useState("");
  const limit = linkLimit(c.plan);

  function addFromText() {
    const urls = text.split(/[\n,\s]+/).map((u) => u.trim()).filter(Boolean);
    const known = new Set(links.map((l) => normalizeUrl(l.url)));
    const added = urls.map(normalizeUrl).filter((u) => u && !known.has(u) && known.add(u));
    c.update({ links: [...links, ...added.map((url) => ({ url, title: defaultTitle(url) }))].slice(0, limit) });
    setText("");
  }

  return (
    <div className="space-y-4">
      {links.length > 0 && (
        <ul className="space-y-2">
          {links.map((l, i) => (
            <li key={l.url} className="flex items-center gap-3 rounded-xl border border-rule bg-bg px-3 py-2">
              <BrandIcon name={detectBrand(l.url)} className="h-5 w-5 shrink-0 text-accent" />
              <input
                value={l.title ?? ""}
                onChange={(e) => c.update({ links: links.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })}
                className="min-w-0 flex-1 bg-transparent font-medium outline-none"
                aria-label="Título do link"
              />
              <span className="hidden max-w-[40%] truncate text-xs text-muted sm:block">{l.url.replace(/^(https?:\/\/|mailto:)/, "")}</span>
              <button type="button" onClick={() => c.update({ links: links.filter((_, j) => j !== i) })} className="text-muted hover:text-ink" aria-label="Remover link">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {links.length < limit ? (
        <div className="space-y-2">
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addFromText();
              }
            }}
            rows={3}
            placeholder={"instagram.com/voce\nyoutube.com/@voce\nseu@email.com"}
            className="w-full resize-none rounded-xl border border-rule bg-bg px-4 py-3 font-label text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-ink"
          />
          <button type="button" onClick={addFromText} disabled={!text.trim()} className="text-sm font-medium text-accent disabled:opacity-40">
            + Adicionar {text.split(/[\n,\s]+/).filter(Boolean).length > 1 ? "links" : "link"}
          </button>
        </div>
      ) : (
        <p className="text-sm text-muted">
          {c.plan === "pro" ? "Limite de links atingido." : `O plano grátis tem até ${limit} links. Dá para ter mais no PRO, depois.`}
        </p>
      )}

      <div className="flex gap-2">
        <Primary onClick={() => { if (text.trim()) addFromText(); c.next(); }}>Continuar</Primary>
      </div>
    </div>
  );
}

function WhatsAppForm({ c }: { c: StepCtx }) {
  const [value, setValue] = useState(c.draft.whatsapp ?? "");
  const digits = value.replace(/\D/g, "");
  return (
    <form onSubmit={(e) => { e.preventDefault(); c.next({ whatsapp: value }); }} className="space-y-3">
      <input autoFocus value={value} onChange={(e) => { setValue(e.target.value); c.update({ whatsapp: e.target.value }); }} placeholder="(21) 99999-0000" inputMode="tel" className={inputClass} />
      <div className="flex gap-2">
        <Primary type="submit" disabled={digits.length < 10}>Usar esse número</Primary>
        <Skip onClick={() => { setValue(""); c.next({ whatsapp: null }); }}>Não uso WhatsApp aqui</Skip>
      </div>
    </form>
  );
}

function TemplatePicker({ c }: { c: StepCtx }) {
  const preset = getProfession(c.draft.profession);
  // Sugeridos primeiro
  const ordered = [...TEMPLATES].sort(
    (a, b) => (preset.templates.indexOf(a.id) + 1 || 9) - (preset.templates.indexOf(b.id) + 1 || 9),
  );
  return (
    <div className="grid grid-cols-2 gap-4">
      {ordered.map((t, i) => {
        const allowed = canUseTemplate(t.id, c.plan);
        const active = c.preview.profile.template_id === t.id;
        return (
          <button
            key={t.id}
            type="button"
            disabled={!allowed}
            onClick={() => c.next({ template_id: t.id })}
            className={cn(
              "group rounded-3xl border p-3 text-left transition-colors",
              active ? "border-ink bg-surface" : "border-rule hover:border-ink",
              !allowed && "cursor-not-allowed opacity-60 hover:border-rule",
            )}
          >
            <div className="pointer-events-none mx-auto w-fit">
              <PhoneFrame scale={0.36}>
                <PageView preview profile={{ ...c.preview.profile, template_id: t.id, plan: "pro" }} blocks={c.preview.blocks} />
              </PhoneFrame>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="font-medium">{t.name}</span>
              {!allowed && <ProBadge />}
              {allowed && i === 0 && <span className="text-xs text-accent">sugerido</span>}
              {active && <Check className="ml-auto h-4 w-4" />}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">{t.description}</p>
          </button>
        );
      })}
    </div>
  );
}

function PalettePicker({ c }: { c: StepCtx }) {
  const preset = getProfession(c.draft.profession);
  const [all, setAll] = useState(false);
  const list = all ? PALETTES.map((p) => p.id) : preset.palettes;
  const current = c.preview.profile.palette_id;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {list.map((id) => {
          const p = getPalette(id);
          const allowed = canUsePalette(id, c.plan);
          return (
            <button
              key={id}
              type="button"
              disabled={!allowed}
              onClick={() => c.update({ palette_id: id })}
              className={cn(
                "flex items-center gap-3 rounded-2xl border p-2.5 text-left text-sm transition-colors",
                current === id ? "border-ink bg-surface" : "border-rule hover:border-ink",
                !allowed && "cursor-not-allowed opacity-60 hover:border-rule",
              )}
            >
              <PaletteSwatch id={id} />
              <span className="flex flex-col gap-1">
                <span className="font-medium">{p.name}</span>
                {!allowed && <ProBadge />}
              </span>
            </button>
          );
        })}
      </div>
      {!all && (
        <button type="button" onClick={() => setAll(true)} className="text-sm font-medium text-accent">
          Ver todas as {PALETTES.length} paletas
        </button>
      )}
      <div>
        <Primary onClick={() => c.next({ palette_id: current })}>Gostei dessa</Primary>
      </div>
    </div>
  );
}

// ── Roteiro ────────────────────────────────────────────────────────────────

export const STEPS: Step[] = [
  {
    id: "username",
    question: () => "Oi! Vamos montar sua página. Primeiro: qual vai ser o seu endereço?",
    hint: () => "É o link que você vai colocar na bio do Instagram.",
    summary: (c) => `linqu.es/${c.draft.username ?? ""}`,
    render: (c) => <UsernameInput c={c} />,
  },
  {
    id: "profession",
    question: () => "Com o que você trabalha?",
    summary: (c) => {
      const p = getProfession(c.draft.profession);
      return c.draft.profession ? `${p.emoji} ${p.label}` : "";
    },
    render: (c) => (
      <div className="flex flex-wrap gap-2">
        {PROFESSIONS.map((p) => (
          <Chip key={p.id} active={c.draft.profession === p.id} onClick={() => c.next({ profession: p.id, ...c.suggest(p.id) })}>
            <span aria-hidden="true">{p.emoji}</span> {p.label}
          </Chip>
        ))}
      </div>
    ),
  },
  {
    id: "goal",
    question: () => "E o que você mais quer com a página?",
    hint: () => "Isso decide a ordem dos seus links.",
    summary: (c) => GOALS.find((g) => g.id === c.draft.goal)?.label ?? "",
    render: (c) => (
      <div className="flex flex-wrap gap-2">
        {GOALS.map((g) => (
          <Chip key={g.id} active={c.draft.goal === g.id} onClick={() => c.next({ goal: g.id })}>
            {g.label}
          </Chip>
        ))}
      </div>
    ),
  },
  {
    id: "template",
    question: (c) => `Separei um estilo que costuma funcionar para ${getProfession(c.draft.profession).label.toLowerCase()}. Qual combina mais com você?`,
    summary: (c) => getTemplate(c.preview.profile.template_id).name,
    render: (c) => <TemplatePicker c={c} />,
  },
  {
    id: "palette",
    question: () => "Agora as cores. Escolha uma paleta (dá para ver na prévia ao lado).",
    summary: (c) => getPalette(c.preview.profile.palette_id).name,
    render: (c) => <PalettePicker c={c} />,
  },
  {
    id: "about",
    question: () => "Como você quer aparecer?",
    hint: () => "Nome, o que você faz em uma linha e, se quiser, uma frase sobre você.",
    summary: (c) => [c.draft.display_name, c.draft.headline].filter(Boolean).join(" · "),
    render: (c) => <AboutForm c={c} />,
  },
  {
    id: "photos",
    question: () => "Tem fotos? Uma de perfil e, se quiser, até quatro de capa.",
    summary: (c) => {
      const n = (c.draft.photos?.length ?? 0) + (c.draft.avatar_url ? 1 : 0);
      return n ? `${n} foto${n > 1 ? "s" : ""}` : "Sem fotos";
    },
    render: (c) => <PhotosForm c={c} />,
  },
  {
    id: "featured",
    question: () => "Quer destacar alguma coisa no topo?",
    hint: () => "Um lançamento, um serviço, um produto ou sua agenda. Aparece com imagem, antes dos links.",
    summary: (c) => (c.draft.featured ? `${FEATURED_KINDS.find((k) => k.id === c.draft.featured!.kind)?.label}: ${c.draft.featured.title}` : "Sem destaque"),
    render: (c) => <FeaturedForm c={c} />,
  },
  {
    id: "links",
    question: () => "Cole seus links, um por linha. Eu reconheço as redes e coloco os ícones.",
    summary: (c) => {
      const n = c.draft.links?.length ?? 0;
      return n ? `${n} link${n > 1 ? "s" : ""}` : "Sem links";
    },
    render: (c) => <LinksForm c={c} />,
  },
  {
    id: "whatsapp",
    question: () => "Quer um botão de WhatsApp flutuando na página?",
    summary: (c) => (c.draft.whatsapp ? `WhatsApp ${c.draft.whatsapp}` : "Sem WhatsApp"),
    render: (c) => <WhatsAppForm c={c} />,
  },
  {
    id: "review",
    question: (c) => (
      <>
        Pronto! Sua página fica em <strong>linqu.es/{c.username}</strong>. Confere na prévia e publica. Depois dá para mudar
        tudo no painel.
      </>
    ),
    summary: () => "",
    render: (c) => (
      <Primary onClick={c.publish} disabled={c.publishing}>
        {c.publishing ? <><Loader2 className="h-4 w-4 animate-spin" /> Publicando…</> : "Publicar minha página"}
      </Primary>
    ),
  },
];
