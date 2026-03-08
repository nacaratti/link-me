import React, { useEffect, useState, useCallback } from 'react';
import { Reorder } from 'motion/react';
import {
  Plus, Trash2, GripVertical, ExternalLink, Settings,
  Link as LinkIcon, Layout, Loader2, LogOut, Eye, EyeOff, Save,
  Check, Palette, X, Smartphone,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { loadGoogleFont } from '../lib/fonts';
import { useAuth } from '../contexts/AuthContext';
import { ICON_MAP, FONT_OPTIONS, BUTTON_STYLE_OPTIONS, type Profile, type Link } from '../types';
import { THEMES, getTheme } from '../themes';
import ThemeBackground from '../themes/ThemeBackground';

type Tab = 'links' | 'theme' | 'appearance' | 'profile' | 'preview';

// ─── Mobile Full Preview (tab preview no celular) ────────────────────────────

function MobileFullPreview({ profile }: { profile: Profile }) {
  useEffect(() => {
    if (profile.font_family) loadGoogleFont(profile.font_family);
  }, [profile.font_family]);

  const theme = getTheme(profile.theme_id ?? 'default');
  const isOutline = profile.button_style === 'outline';
  const btnRadius = {
    rounded: 'rounded-xl', pill: 'rounded-full',
    square: 'rounded-none', outline: 'rounded-xl',
  }[profile.button_style] ?? 'rounded-xl';

  return (
    <div
      className="relative min-h-full"
      style={{ backgroundColor: profile.bg_color, fontFamily: `'${profile.font_family}', sans-serif` }}
    >
      <ThemeBackground Background={theme.Background} themeId={profile.theme_id ?? 'default'} />
      <div className="relative z-10 flex flex-col items-center py-14 px-5 pb-24">
        <img
          src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
          className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg mb-4 object-cover"
          referrerPolicy="no-referrer"
        />
        <h1 className="text-xl font-bold text-center mb-1" style={{ color: profile.text_color }}>
          {profile.display_name || profile.username}
        </h1>
        {profile.bio && (
          <p className="text-sm text-center opacity-75 mb-6 max-w-xs" style={{ color: profile.text_color }}>
            {profile.bio}
          </p>
        )}
        <div className="w-full max-w-sm flex flex-col gap-3 mt-2">
          {profile.links.filter(l => l.is_active).map(link => {
            const Icon = ICON_MAP[link.icon_type] ?? ICON_MAP.link;
            return (
              <div
                key={link.id}
                className={`flex items-center gap-3 px-4 ${btnRadius} ${isOutline ? 'border-2' : ''}`}
                style={{
                  backgroundColor: isOutline ? 'transparent' : profile.button_color,
                  color: profile.button_text_color,
                  borderColor: isOutline ? profile.button_text_color : undefined,
                  minHeight: '52px',
                }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-sm">{link.title}</span>
              </div>
            );
          })}
          {profile.links.filter(l => l.is_active).length === 0 && (
            <p className="text-sm text-center opacity-40 mt-8" style={{ color: profile.text_color }}>
              Nenhum link ativo
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Mobile Preview (painel desktop) ─────────────────────────────────────────

function MobilePreview({ profile }: { profile: Profile }) {
  useEffect(() => {
    if (profile.font_family) loadGoogleFont(profile.font_family);
  }, [profile.font_family]);

  const theme = getTheme(profile.theme_id ?? 'default');
  const isOutline = profile.button_style === 'outline';
  const btnRadius = {
    rounded: 'rounded-xl', pill: 'rounded-full',
    square: 'rounded-none', outline: 'rounded-xl',
  }[profile.button_style] ?? 'rounded-xl';

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ backgroundColor: profile.bg_color, fontFamily: `'${profile.font_family}', sans-serif` }}
    >
      {theme.isWebGL
        ? <div className="absolute inset-0" style={{ ...theme.previewStyle as React.CSSProperties, position: 'absolute', zIndex: 0 }} />
        : <ThemeBackground Background={theme.Background} themeId={profile.theme_id ?? 'default'} />
      }
      <div className="relative h-full overflow-y-auto" style={{ zIndex: 1 }}>
        <div className="flex flex-col items-center py-10 px-4">
          <img
            src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
            className="w-16 h-16 rounded-full border-4 border-white/20 shadow-md mb-2 object-cover"
            referrerPolicy="no-referrer"
          />
          <h1 className="font-bold text-base text-center mb-1" style={{ color: profile.text_color }}>
            {profile.display_name || profile.username}
          </h1>
          {profile.bio && (
            <p className="text-xs text-center opacity-70 mb-4 max-w-[200px]" style={{ color: profile.text_color }}>
              {profile.bio}
            </p>
          )}
          <div className="w-full flex flex-col gap-2.5">
            {profile.links.filter(l => l.is_active).map(link => {
              const Icon = ICON_MAP[link.icon_type] ?? ICON_MAP.link;
              return (
                <div
                  key={link.id}
                  className={`flex items-center gap-2 p-2.5 backdrop-blur-sm ${btnRadius} ${isOutline ? 'border-2' : ''}`}
                  style={{
                    backgroundColor: isOutline ? 'transparent' : profile.button_color,
                    color: profile.button_text_color,
                    borderColor: isOutline ? profile.button_text_color : undefined,
                  }}
                >
                  <div className="p-1 rounded-md bg-white/10">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-xs">{link.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Links Tab ───────────────────────────────────────────────────────────────

function LinksTab({ profile, onProfileChange }: { profile: Profile; onProfileChange: (p: Profile) => void }) {
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newIcon, setNewIcon] = useState('link');
  const [adding, setAdding] = useState(false);
  const [showSheet, setShowSheet] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    const maxOrder = profile.links.reduce((m, l) => Math.max(m, l.sort_order), -1);
    const { data, error } = await supabase.from('links').insert({
      profile_id: profile.id,
      title: newTitle,
      url: newUrl,
      icon_type: newIcon,
      sort_order: maxOrder + 1,
      is_active: true,
    }).select().single();
    if (!error && data) {
      onProfileChange({ ...profile, links: [...profile.links, data as Link] });
      setNewTitle('');
      setNewUrl('');
      setNewIcon('link');
      setShowSheet(false);
    }
    setAdding(false);
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from('links').delete().eq('id', id);
    if (!error) {
      onProfileChange({ ...profile, links: profile.links.filter(l => l.id !== id) });
    }
  }

  async function handleToggle(link: Link) {
    const updated = { ...link, is_active: !link.is_active };
    const { error } = await supabase.from('links').update({ is_active: updated.is_active }).eq('id', link.id);
    if (!error) {
      onProfileChange({ ...profile, links: profile.links.map(l => l.id === link.id ? updated : l) });
    }
  }

  async function handleReorder(newLinks: Link[]) {
    const reordered = newLinks.map((l, i) => ({ ...l, sort_order: i }));
    const previousLinks = profile.links;
    onProfileChange({ ...profile, links: reordered });
    const results = await Promise.all(
      reordered.map(l => supabase.from('links').update({ sort_order: l.sort_order }).eq('id', l.id))
    );
    if (results.some(r => r.error)) {
      onProfileChange({ ...profile, links: previousLinks });
    }
  }

  const addForm = (compact = false) => (
    <form onSubmit={handleAdd} className="space-y-3">
      <input
        className="w-full px-4 py-3 text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Título"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        required
      />
      <input
        className="w-full px-4 py-3 text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="URL (https://...)"
        type="url"
        value={newUrl}
        onChange={e => setNewUrl(e.target.value)}
        required
      />
      <div className={compact ? 'flex gap-2' : 'flex gap-2'}>
        <select
          className="flex-1 px-4 py-3 text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          value={newIcon}
          onChange={e => setNewIcon(e.target.value)}
        >
          {Object.keys(ICON_MAP).map(k => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={adding}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white text-base font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Adicionar
        </button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Inline form — desktop only */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Novo link</h3>
        {addForm()}
      </div>

      <Reorder.Group axis="y" values={profile.links} onReorder={handleReorder} className="space-y-2">
        {profile.links.map(link => {
          const Icon = ICON_MAP[link.icon_type] ?? ICON_MAP.link;
          return (
            <Reorder.Item
              key={link.id}
              value={link}
              className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-3 py-3 shadow-sm cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-5 h-5 text-slate-300 flex-shrink-0" />
              <div className="p-1.5 rounded-lg bg-slate-100">
                <Icon className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{link.title}</p>
                <p className="text-xs text-slate-400 truncate">{link.url}</p>
              </div>
              <button
                onClick={() => handleToggle(link)}
                style={{ touchAction: 'manipulation' }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {link.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(link.id)}
                style={{ touchAction: 'manipulation' }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* FAB — mobile only */}
      <button
        onClick={() => setShowSheet(true)}
        style={{ touchAction: 'manipulation', bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
        className="fixed right-4 z-40 md:hidden w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center transition-colors"
        aria-label="Adicionar link"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Bottom sheet — mobile only */}
      {showSheet && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSheet(false)} />
          <div className="relative bg-white rounded-t-3xl px-5 pt-4 shadow-2xl"
            style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
          >
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">Novo link</h3>
              <button
                onClick={() => setShowSheet(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {addForm()}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Appearance Tab ───────────────────────────────────────────────────────────

function AppearanceTab({ profile, onProfileChange }: { profile: Profile; onProfileChange: (p: Profile) => void }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await supabase.from('profiles').update({
      bg_color: profile.bg_color,
      text_color: profile.text_color,
      button_color: profile.button_color,
      button_text_color: profile.button_text_color,
      button_style: profile.button_style,
      font_family: profile.font_family,
    }).eq('id', profile.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function update(key: keyof Profile, value: string) {
    onProfileChange({ ...profile, [key]: value });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">Cores</h3>
        {[
          { label: 'Fundo da página', key: 'bg_color' },
          { label: 'Cor do texto', key: 'text_color' },
          { label: 'Fundo dos botões', key: 'button_color' },
          { label: 'Texto dos botões', key: 'button_text_color' },
        ].map(({ label, key }) => (
          <label key={key} className="flex flex-col gap-2 cursor-pointer">
            <span className="text-xs font-medium text-slate-600">{label}</span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={(profile as any)[key]?.startsWith('#') ? (profile as any)[key] : '#ffffff'}
                onChange={e => update(key as keyof Profile, e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={(profile as any)[key] ?? ''}
                onChange={e => update(key as keyof Profile, e.target.value)}
                className="flex-1 px-3 py-2 text-base md:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 font-mono"
              />
            </div>
          </label>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Estilo dos botões</h3>
        <div className="grid grid-cols-2 gap-2">
          {BUTTON_STYLE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => update('button_style', opt.value)}
              className={`py-2 px-3 text-sm border-2 transition-colors ${opt.class} ${
                profile.button_style === opt.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-slate-700">Fonte</h3>
        <div className="grid grid-cols-2 gap-2">
          {FONT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { update('font_family', opt.value); loadGoogleFont(opt.value); }}
              className={`py-2 px-3 text-sm border-2 rounded-lg transition-colors ${
                profile.font_family === opt.value
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
              style={{ fontFamily: `'${opt.value}', sans-serif` }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saved ? 'Salvo!' : 'Salvar aparência'}
      </button>
    </div>
  );
}

// ─── Theme Tab ────────────────────────────────────────────────────────────────

function ThemeTab({ profile, onProfileChange }: { profile: Profile; onProfileChange: (p: Profile) => void }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unique = [...new Set(THEMES.map(t => t.defaults.font_family))];
    unique.forEach(loadGoogleFont);
  }, []);

  async function handleSelect(themeId: string) {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return;
    const updated: Profile = {
      ...profile,
      theme_id: themeId,
      ...(theme.defaults ?? {}),
    };
    onProfileChange(updated);
    setSaving(true);
    await supabase.from('profiles').update({
      theme_id: themeId,
      bg_color: updated.bg_color,
      text_color: updated.text_color,
      button_color: updated.button_color,
      button_text_color: updated.button_text_color,
      button_style: updated.button_style,
      font_family: updated.font_family,
    }).eq('id', profile.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">Escolha um tema para aplicar cores e efeitos pré-definidos.</p>
      {saving && (
        <div className="flex items-center gap-2 text-sm text-indigo-600">
          <Loader2 className="w-4 h-4 animate-spin" /> Aplicando tema...
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="w-4 h-4" /> Tema aplicado!
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {THEMES.map(theme => {
          const selected = profile.theme_id === theme.id;
          const d = theme.defaults;
          return (
            <button
              key={theme.id}
              onClick={() => handleSelect(theme.id)}
              title={theme.description}
              className={`relative rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none shadow-sm ${
                selected
                  ? 'ring-2 ring-indigo-500 ring-offset-2 scale-[1.03] shadow-md'
                  : 'hover:scale-[1.03] hover:shadow-md'
              }`}
            >
              {/* Card background */}
              <div
                className="w-full flex flex-col items-center justify-center gap-1.5 px-2 pt-5 pb-8"
                style={theme.previewStyle as React.CSSProperties}
              >
                {/* Fake avatar */}
                <div
                  className="w-7 h-7 rounded-full"
                  style={{ backgroundColor: d.text_color, opacity: 0.28 }}
                />
                {/* Fake name line */}
                <div
                  className="h-1.5 rounded-full"
                  style={{ width: '55%', backgroundColor: d.text_color, opacity: 0.22 }}
                />
                {/* Fake bio line */}
                <div
                  className="h-1 rounded-full"
                  style={{ width: '38%', backgroundColor: d.text_color, opacity: 0.14 }}
                />
                {/* Fake button */}
                <div
                  className="h-4 mt-0.5"
                  style={{
                    width: '72%',
                    backgroundColor: d.button_style === 'outline' ? 'transparent' : d.button_color,
                    border: d.button_style === 'outline' ? `1.5px solid ${d.button_text_color}` : undefined,
                    borderRadius: d.button_style === 'pill' ? '9999px'
                      : d.button_style === 'square' ? '2px'
                      : '6px',
                  }}
                />
              </div>

              {/* Name label */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent pt-5 pb-2 px-1.5">
                <p
                  className="text-[11px] font-semibold text-white text-center leading-tight truncate"
                  style={{ fontFamily: `'${d.font_family}', sans-serif` }}
                >
                  {theme.name}
                </p>
              </div>

              {/* Selected badge */}
              {selected && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center shadow">
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({ profile, onProfileChange }: { profile: Profile; onProfileChange: (p: Profile) => void }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await supabase.from('profiles').update({
      display_name: profile.display_name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
    }).eq('id', profile.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function update(key: keyof Profile, value: string) {
    onProfileChange({ ...profile, [key]: value });
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-600">Nome de exibição</span>
          <input
            className="px-3 py-2 text-base md:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={profile.display_name ?? ''}
            onChange={e => update('display_name', e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-600">Bio</span>
          <textarea
            className="px-3 py-2 text-base md:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            rows={3}
            value={profile.bio ?? ''}
            onChange={e => update('bio', e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-600">URL do avatar</span>
          <input
            className="px-3 py-2 text-base md:text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="https://..."
            value={profile.avatar_url ?? ''}
            onChange={e => update('avatar_url', e.target.value)}
          />
        </label>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saved ? 'Salvo!' : 'Salvar perfil'}
      </button>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('links');

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*, links(*)')
      .eq('id', user.id)
      .maybeSingle();
    if (data) {
      setProfile({
        ...data,
        theme_id: data.theme_id ?? 'default',
        links: (data.links ?? []).sort((a: Link, b: Link) => a.sort_order - b.sort_order),
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!profile) return null;

  const desktopTabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'links', label: 'Links', icon: LinkIcon },
    { id: 'theme', label: 'Tema', icon: Layout },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'profile', label: 'Perfil', icon: Settings },
  ];
  const mobileTabs: { id: Tab; label: string; icon: any }[] = [
    ...desktopTabs,
    { id: 'preview', label: 'Preview', icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <a href="/" className="text-lg font-bold text-slate-900 tracking-tight">linqu.es</a>
          <p className="text-xs text-slate-400 mt-0.5">@{profile.username}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {desktopTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors mb-1"
          >
            <ExternalLink className="w-4 h-4" />
            Ver meu perfil
          </a>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-slate-200 flex z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {mobileTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{ touchAction: 'manipulation' }}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[10px] font-medium transition-colors ${
              tab === id ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <main className={`flex-1 overflow-y-auto ${tab === 'preview' ? '' : 'p-6 pb-28 md:pb-6'}`}>
          {tab === 'preview' ? (
            <MobileFullPreview profile={profile} />
          ) : (
            <div className="max-w-lg mx-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                {desktopTabs.find(t => t.id === tab)?.label}
              </h2>
              {tab === 'links' && <LinksTab profile={profile} onProfileChange={setProfile} />}
              {tab === 'theme' && <ThemeTab profile={profile} onProfileChange={setProfile} />}
              {tab === 'appearance' && <AppearanceTab profile={profile} onProfileChange={setProfile} />}
              {tab === 'profile' && <ProfileTab profile={profile} onProfileChange={setProfile} />}
            </div>
          )}
        </main>

        {/* Preview panel */}
        <div className="hidden lg:flex flex-col w-80 xl:w-96 border-l border-slate-200 bg-slate-100 p-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">Preview</p>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-64 h-[520px] rounded-[2.5rem] border-8 border-slate-800 shadow-2xl overflow-hidden bg-white relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-800 rounded-b-xl z-10" />
              <MobilePreview profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
