"use client";

import { useState } from "react";
import { ImagePlus, Loader2, Lock } from "lucide-react";
import { getPalette } from "@/lib/palettes";
import { uploadPhoto } from "@/lib/upload";
import { cn } from "@/lib/utils";

/** Peças de interface do app (questionário e painel), sempre na paleta do app */

export const inputClass =
  "h-12 w-full rounded-xl border border-rule bg-bg px-4 outline-none transition-colors placeholder:text-muted/70 focus:border-ink";

export const textareaClass =
  "w-full resize-none rounded-xl border border-rule bg-bg px-4 py-3 outline-none transition-colors placeholder:text-muted/70 focus:border-ink";

export function Chip({
  active,
  children,
  onClick,
  disabled,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-colors",
        active ? "border-ink bg-ink text-bg" : "border-rule bg-bg hover:border-ink",
        disabled && "cursor-not-allowed opacity-50 hover:border-rule",
      )}
    >
      {children}
    </button>
  );
}

export function Primary({
  children,
  onClick,
  disabled,
  type = "button",
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 font-medium text-bg transition-opacity hover:opacity-85 disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Skip({ onClick, children = "Pular" }: { onClick: () => void; children?: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="h-12 px-4 text-sm text-muted hover:text-ink">
      {children}
    </button>
  );
}

export function ProBadge() {
  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-on-accent">
      <Lock className="h-3 w-3" /> PRO
    </span>
  );
}

export function PaletteSwatch({ id }: { id: string }) {
  const p = getPalette(id);
  return (
    <span className="flex h-9 w-14 shrink-0 overflow-hidden rounded-lg border border-rule" aria-hidden="true">
      <span className="flex-[2]" style={{ background: p.bg }} />
      <span className="flex-1" style={{ background: p.ink }} />
      <span className="flex-1" style={{ background: p.accent }} />
    </span>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors",
        checked ? "bg-accent" : "bg-rule",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-bg shadow transition-transform",
          checked ? "translate-x-[1.375rem]" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

/** Botão de foto: sobe na hora para o Storage e devolve a URL pública */
export function PhotoPicker({
  userId,
  value,
  onChange,
  label,
  round,
  maxSide,
}: {
  userId: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  label: string;
  round?: boolean;
  maxSide?: number;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      onChange(await uploadPhoto(userId, file, maxSide));
    } catch {
      setErr("Não consegui enviar essa foto. Tente outra (JPG ou PNG).");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <label
          className={cn(
            "relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden border border-dashed border-rule bg-surface text-muted transition-colors hover:border-ink",
            round ? "rounded-full" : "rounded-2xl",
          )}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : busy ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImagePlus className="h-6 w-6" />
          )}
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        </label>
        <div className="text-sm">
          <p className="font-medium">{label}</p>
          {value && (
            <button type="button" onClick={() => onChange(undefined)} className="mt-1 text-muted hover:text-ink">
              Remover
            </button>
          )}
        </div>
      </div>
      {err && <p className="mt-2 text-sm text-[#b42318]">{err}</p>}
    </div>
  );
}
