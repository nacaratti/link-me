"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { PhotoPicker, Primary, Toggle, inputClass, textareaClass } from "@/components/ui";
import { saveProfile, type ProfileInput } from "../actions";
import type { PanelCtx } from "../Painel";

export default function ProfileTab({ userId, profile, setProfile, toast }: PanelCtx) {
  const [form, setForm] = useState<ProfileInput>({
    display_name: profile.display_name,
    headline: profile.headline,
    bio: profile.bio,
    avatar_url: profile.avatar_url,
    photos: profile.photos,
    whatsapp_number: profile.whatsapp_number,
    whatsapp_enabled: profile.whatsapp_enabled,
  });
  const [saving, setSaving] = useState(false);

  // A prévia ao lado acompanha a digitação
  const set = (patch: Partial<ProfileInput>) => {
    const next = { ...form, ...patch };
    setForm(next);
    setProfile({ ...profile, ...next });
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await saveProfile(form);
    setSaving(false);
    toast(res.ok ? "Perfil salvo." : res.error, res.ok ? "ok" : "error");
  }

  return (
    <form onSubmit={submit} className="space-y-10">
      <section className="space-y-3">
        <h1 className="t-title">Sobre você</h1>
        <input value={form.display_name} onChange={(e) => set({ display_name: e.target.value })} placeholder="Nome" className={inputClass} maxLength={60} required />
        <input value={form.headline} onChange={(e) => set({ headline: e.target.value })} placeholder="O que você faz, em uma linha" className={inputClass} maxLength={60} />
        <textarea value={form.bio} onChange={(e) => set({ bio: e.target.value })} placeholder="Uma ou duas frases" rows={3} maxLength={160} className={textareaClass} />
        <p className="t-caption text-right">{form.bio.length}/160</p>
      </section>

      <section className="space-y-5">
        <h2 className="t-title">Fotos</h2>
        <PhotoPicker userId={userId} value={form.avatar_url || undefined} onChange={(url) => set({ avatar_url: url ?? "" })} label="Foto de perfil" round maxSide={600} />
        <div>
          <p className="mb-3 text-sm font-medium">
            Capa <span className="font-normal text-muted">(até 4; nos modelos Editorial e Vitrine elas se alternam no topo)</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {form.photos.map((url, i) => (
              <div key={url} className="relative h-24 w-24 overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => set({ photos: form.photos.filter((_, j) => j !== i) })}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                  aria-label="Remover foto"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            {form.photos.length < 4 && (
              <PhotoPicker userId={userId} onChange={(url) => url && set({ photos: [...form.photos, url] })} label={form.photos.length ? "Mais uma" : "Adicionar"} />
            )}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="t-title">Botão do WhatsApp</h2>
            <p className="text-sm text-muted">Fica flutuando no canto da página, na cor da sua paleta.</p>
          </div>
          <Toggle checked={form.whatsapp_enabled} onChange={(v) => set({ whatsapp_enabled: v })} label="Mostrar botão do WhatsApp" />
        </div>
        {form.whatsapp_enabled && (
          <input value={form.whatsapp_number} onChange={(e) => set({ whatsapp_number: e.target.value })} placeholder="(21) 99999-0000" inputMode="tel" className={inputClass} />
        )}
      </section>

      <Primary type="submit" disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar perfil"}
      </Primary>
    </form>
  );
}
