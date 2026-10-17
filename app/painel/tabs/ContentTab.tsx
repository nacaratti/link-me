"use client";

import { useRef, useState } from "react";
import { Reorder, useDragControls } from "motion/react";
import { GripVertical, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import BrandIcon from "@/components/BrandIcon";
import { PhotoPicker, Primary, Toggle, inputClass } from "@/components/ui";
import { defaultTitle, detectBrand, normalizeUrl } from "@/lib/links";
import { FEATURED_LIMIT, linkLimit } from "@/lib/plans";
import { FEATURED_KINDS } from "@/lib/presets";
import type { Block, FeaturedData, LinkData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { addBlock, deleteBlock, reorderBlocks, updateBlock } from "../actions";
import type { PanelCtx } from "../Painel";

const emptyFeatured: FeaturedData = { badge: FEATURED_KINDS[0].badge, title: "", url: "", cta: FEATURED_KINDS[0].cta };

export default function ContentTab(ctx: PanelCtx) {
  const { blocks, setBlocks, profile, toast } = ctx;
  const [adding, setAdding] = useState<"link" | "featured" | null>(null);
  const before = useRef<Block[]>(blocks);
  // Ordem mais recente, para o fim do arraste não ler um estado antigo
  const latest = useRef<Block[]>(blocks);
  const onReorder = (next: Block[]) => {
    latest.current = next;
    setBlocks(next);
  };

  const links = blocks.filter((b) => b.type === "link").length;
  const featured = blocks.filter((b) => b.type === "featured").length;
  const limit = linkLimit(profile.plan);

  async function persistOrder() {
    const current = latest.current;
    const ids = current.map((b) => b.id);
    if (ids.join() === before.current.map((b) => b.id).join()) return;
    const res = await reorderBlocks(ids);
    if (!res.ok) {
      setBlocks(before.current);
      toast(res.error, "error");
    } else {
      before.current = current;
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="t-title">Seus links</h1>
        <p className="mt-1 text-sm text-muted">
          Arraste para mudar a ordem. Desligue para esconder sem apagar.{" "}
          <span className="t-caption">
            {links}/{limit} links · {featured}/{FEATURED_LIMIT} destaques
          </span>
        </p>
      </div>

      {blocks.length === 0 && !adding && (
        <p className="rounded-2xl border border-dashed border-rule p-8 text-center text-muted">Nenhum link ainda.</p>
      )}

      <Reorder.Group
        axis="y"
        values={blocks}
        onReorder={onReorder}
        className="space-y-2"
      >
        {blocks.map((b) => (
          <BlockRow key={b.id} block={b} ctx={ctx} onDragEnd={persistOrder} />
        ))}
      </Reorder.Group>

      {adding ? (
        <div className="rounded-2xl border border-ink p-4">
          <BlockForm
            type={adding}
            initial={adding === "link" ? { title: "", url: "" } : emptyFeatured}
            ctx={ctx}
            onCancel={() => setAdding(null)}
            onSave={async (data) => {
              const res = await addBlock(adding === "link" ? { type: "link", data: data as LinkData } : { type: "featured", data: data as FeaturedData });
              if (!res.ok) return toast(res.error, "error");
              const next = adding === "featured" ? [res.data, ...blocks] : [...blocks, res.data];
              setBlocks(next);
              before.current = next;
              setAdding(null);
              toast(adding === "link" ? "Link adicionado." : "Destaque adicionado.");
            }}
          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={links >= limit}
            onClick={() => setAdding("link")}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-bg transition-opacity hover:opacity-85 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> Link
          </button>
          <button
            type="button"
            disabled={featured >= FEATURED_LIMIT}
            onClick={() => setAdding("featured")}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-rule px-5 text-sm font-medium transition-colors hover:border-ink disabled:opacity-40"
          >
            <Plus className="h-4 w-4" /> Destaque com imagem
          </button>
          {links >= limit && profile.plan === "free" && (
            <p className="w-full text-sm text-muted">O plano grátis tem até {limit} links. O PRO libera até 50.</p>
          )}
        </div>
      )}
    </div>
  );
}

function BlockRow({ block, ctx, onDragEnd }: { block: Block; ctx: PanelCtx; onDragEnd: () => void }) {
  const controls = useDragControls();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const { blocks, setBlocks, toast, stats } = ctx;

  const replace = (patch: Partial<Block>) =>
    setBlocks(blocks.map((b) => (b.id === block.id ? ({ ...b, ...patch } as Block) : b)));

  async function toggle(is_active: boolean) {
    replace({ is_active });
    const res = await updateBlock(block.id, { is_active });
    if (!res.ok) {
      replace({ is_active: !is_active });
      toast(res.error, "error");
    }
  }

  async function remove() {
    if (!confirm(`Apagar "${block.data.title}"?`)) return;
    setBusy(true);
    const res = await deleteBlock(block.id);
    setBusy(false);
    if (!res.ok) return toast(res.error, "error");
    setBlocks(blocks.filter((b) => b.id !== block.id));
  }

  const clicks30 = stats.byBlock[block.id] ?? 0;

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      className={cn("rounded-2xl border border-rule bg-bg", !block.is_active && "opacity-60")}
    >
      <div className="flex items-center gap-3 p-3">
        <button
          type="button"
          onPointerDown={(e) => controls.start(e)}
          className="cursor-grab touch-none text-muted active:cursor-grabbing"
          aria-label="Arrastar para reordenar"
        >
          <GripVertical className="h-5 w-5" />
        </button>
        {block.type === "featured" && block.data.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={block.data.image} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-accent">
            <BrandIcon name={detectBrand(block.data.url)} className="h-5 w-5" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">
            {block.type === "featured" && <span className="t-label mr-2">{block.data.badge || "Destaque"}</span>}
            {block.data.title}
          </p>
          <p className="truncate text-xs text-muted">
            {block.data.url.replace(/^(https?:\/\/|mailto:|tel:)/, "")} · {clicks30} clique{clicks30 === 1 ? "" : "s"} em 30 dias
          </p>
        </div>
        <button type="button" onClick={() => setEditing(!editing)} className="p-1.5 text-muted hover:text-ink" aria-label="Editar">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" onClick={remove} disabled={busy} className="p-1.5 text-muted hover:text-[#b42318]" aria-label="Apagar">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
        <Toggle checked={block.is_active} onChange={toggle} label="Mostrar na página" />
      </div>
      {editing && (
        <div className="border-t border-rule p-4">
          <BlockForm
            type={block.type}
            initial={block.data}
            ctx={ctx}
            onCancel={() => setEditing(false)}
            onSave={async (data) => {
              const res = await updateBlock(block.id, { data }, block.type);
              if (!res.ok) return toast(res.error, "error");
              const url = normalizeUrl(data.url);
              replace({ data: { ...data, url, title: data.title.trim() || defaultTitle(url) } } as Partial<Block>);
              setEditing(false);
              toast("Salvo.");
            }}
          />
        </div>
      )}
    </Reorder.Item>
  );
}

function BlockForm({
  type,
  initial,
  ctx,
  onSave,
  onCancel,
}: {
  type: Block["type"];
  initial: LinkData | FeaturedData;
  ctx: PanelCtx;
  onSave: (data: LinkData | FeaturedData) => Promise<void>;
  onCancel: () => void;
}) {
  const [data, setData] = useState<LinkData & Partial<FeaturedData>>(initial as LinkData & Partial<FeaturedData>);
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<FeaturedData & LinkData>) => setData((d) => ({ ...d, ...patch }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave(data as LinkData | FeaturedData);
    setSaving(false);
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {type === "featured" && (
        <div className="flex flex-wrap gap-2">
          {FEATURED_KINDS.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => set({ badge: k.badge, cta: k.cta })}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium",
                data.badge === k.badge ? "border-ink bg-ink text-bg" : "border-rule hover:border-ink",
              )}
            >
              {k.badge}
            </button>
          ))}
        </div>
      )}
      <input
        autoFocus
        value={data.url}
        onChange={(e) => set({ url: e.target.value })}
        placeholder="Link (instagram.com/voce, seu@email.com…)"
        className={inputClass}
        inputMode="url"
        autoCapitalize="none"
        required
      />
      <input
        value={data.title}
        onChange={(e) => set({ title: e.target.value })}
        placeholder={data.url ? defaultTitle(normalizeUrl(data.url)) : "Título"}
        className={inputClass}
        maxLength={60}
        required={type === "featured"}
      />
      {type === "link" ? (
        <input value={data.note ?? ""} onChange={(e) => set({ note: e.target.value })} placeholder="Legenda curta (opcional)" className={inputClass} maxLength={60} />
      ) : (
        <>
          <input value={data.subtitle ?? ""} onChange={(e) => set({ subtitle: e.target.value })} placeholder="Detalhe (opcional: preço, data…)" className={inputClass} maxLength={60} />
          <input value={data.cta ?? ""} onChange={(e) => set({ cta: e.target.value })} placeholder="Texto do botão" className={inputClass} maxLength={30} />
          <PhotoPicker userId={ctx.userId} value={data.image} onChange={(image) => set({ image })} label="Imagem do destaque" maxSide={1200} />
        </>
      )}
      <div className="flex gap-2 pt-1">
        <Primary type="submit" disabled={saving || !data.url.trim()} className="h-11 px-5 text-sm">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
        </Primary>
        <button type="button" onClick={onCancel} className="h-11 px-4 text-sm text-muted hover:text-ink">
          Cancelar
        </button>
      </div>
    </form>
  );
}
