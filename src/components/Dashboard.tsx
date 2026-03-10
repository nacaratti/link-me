import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Reorder } from 'motion/react';
import {
  Plus, Trash2, GripVertical, ExternalLink, Settings,
  Link as LinkIcon, Layout, Loader2, LogOut, Eye, EyeOff, Save,
  Check, Palette, X, Smartphone, ShieldCheck, Camera,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { loadGoogleFont } from '../lib/fonts';
import { useAuth } from '../contexts/AuthContext';
import { ICON_MAP, FONT_OPTIONS, BUTTON_STYLE_OPTIONS, type Profile, type Link } from '../types';
import { THEMES, getTheme } from '../themes';
import ThemeBackground from '../themes/ThemeBackground';
import logo from '../assets/images/logo.png';
import { linkLimitReached, linkBlockMessage, canUseTheme, themeBlockMessage } from '../lib/plans';
import { fetchThemeConfigs, isThemePro, invalidateThemeConfigCache, type ThemeConfig } from '../lib/themeConfig';

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
      <ThemeBackground Background={theme.Background} themeId={profile.theme_id ?? 'default'} />
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

  const blocked = linkLimitReached(profile.links.length, profile.plan ?? 'free');

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (blocked) return;
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
        className="w-full px-4 py-3 text-base border border-[#D9D9D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B76A0]"
        placeholder="Título"
        value={newTitle}
        onChange={e => setNewTitle(e.target.value)}
        required
      />
      <input
        className="w-full px-4 py-3 text-base border border-[#D9D9D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B76A0]"
        placeholder="URL (https://...)"
        type="url"
        value={newUrl}
        onChange={e => setNewUrl(e.target.value)}
        required
      />
      <div className={compact ? 'flex gap-2' : 'flex gap-2'}>
        <select
          className="flex-1 px-4 py-3 text-base border border-[#D9D9D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B76A0] bg-white"
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
          className="flex items-center gap-2 px-5 py-3 bg-[#0B76A0] text-white text-base font-medium rounded-xl hover:bg-[#095f7d] disabled:opacity-50 transition-colors"
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
      <div className="hidden md:block bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-[#333333]">Novo link</h3>
        {blocked
          ? <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">{linkBlockMessage(profile.plan ?? 'free')}</p>
          : addForm()
        }
      </div>

      <Reorder.Group axis="y" values={profile.links} onReorder={handleReorder} className="space-y-2">
        {profile.links.map(link => {
          const Icon = ICON_MAP[link.icon_type] ?? ICON_MAP.link;
          return (
            <Reorder.Item
              key={link.id}
              value={link}
              className="flex items-center gap-3 bg-white rounded-xl border border-[#D9D9D9] px-3 py-3 shadow-sm cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-5 h-5 text-[#BFBFBF] flex-shrink-0" />
              <div className="p-1.5 rounded-lg bg-[#ebebeb]">
                <Icon className="w-4 h-4 text-[#555555]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111111] truncate">{link.title}</p>
                <p className="text-xs text-[#BFBFBF] truncate">{link.url}</p>
              </div>
              <button
                onClick={() => handleToggle(link)}
                style={{ touchAction: 'manipulation' }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-[#ebebeb] text-[#BFBFBF] hover:text-[#555555] transition-colors"
              >
                {link.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(link.id)}
                style={{ touchAction: 'manipulation' }}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-red-50 text-[#BFBFBF] hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      {/* Limite de links */}
      {blocked && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <span className="text-base">⚠️</span>
          <span>{linkBlockMessage(profile.plan ?? 'free')}</span>
        </div>
      )}

      {/* FAB — mobile only */}
      <button
        onClick={() => { if (!blocked) setShowSheet(true); }}
        disabled={blocked}
        style={{ touchAction: 'manipulation', bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
        className="fixed right-4 z-40 md:hidden w-14 h-14 bg-[#0B76A0] hover:bg-[#095f7d] disabled:opacity-40 text-white rounded-full shadow-xl flex items-center justify-center transition-colors"
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
            <div className="w-10 h-1 bg-[#D9D9D9] rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[#111111]">Novo link</h3>
              <button
                onClick={() => setShowSheet(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#ebebeb] text-[#BFBFBF]"
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

function colorToHexAndAlpha(color: string): [string, number] {
  const m = color.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/);
  if (m) {
    const r = parseInt(m[1]).toString(16).padStart(2, '0');
    const g = parseInt(m[2]).toString(16).padStart(2, '0');
    const b = parseInt(m[3]).toString(16).padStart(2, '0');
    return [`#${r}${g}${b}`, m[4] !== undefined ? parseFloat(m[4]) : 1];
  }
  if (color.startsWith('#') && color.length >= 7) return [color.slice(0, 7), 1];
  return ['#ffffff', 1];
}

function hexAlphaToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (alpha >= 1) return hex;
  return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
}

function AppearanceTab({ profile, onProfileChange }: { profile: Profile; onProfileChange: (p: Profile) => void }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    FONT_OPTIONS.forEach(opt => loadGoogleFont(opt.value));
  }, []);

  const [btnHex, btnAlpha] = colorToHexAndAlpha(profile.button_color ?? '#ffffff');

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

  function updateButtonColor(hex: string, alpha: number) {
    update('button_color', hexAlphaToRgba(hex, alpha));
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-[#333333]">Cores</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Fundo da página', key: 'bg_color' },
            { label: 'Cor do texto', key: 'text_color' },
            { label: 'Texto dos botões', key: 'button_text_color' },
          ].map(({ label, key }) => (
            <label key={key} className="flex flex-col gap-2 cursor-pointer">
              <span className="text-xs font-medium text-[#555555]">{label}</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={(profile as any)[key]?.startsWith('#') ? (profile as any)[key] : '#ffffff'}
                  onChange={e => update(key as keyof Profile, e.target.value)}
                  className="w-10 h-10 rounded-lg border border-[#D9D9D9] cursor-pointer p-0.5 shrink-0"
                />
                <input
                  type="text"
                  value={(profile as any)[key] ?? ''}
                  onChange={e => update(key as keyof Profile, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0] font-mono min-w-0"
                />
              </div>
            </label>
          ))}

          {/* Cor dos botões */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-[#555555]">Fundo dos botões</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={btnHex}
                onChange={e => updateButtonColor(e.target.value, btnAlpha)}
                className="w-10 h-10 rounded-lg border border-[#D9D9D9] cursor-pointer p-0.5 shrink-0"
              />
              <input
                type="text"
                value={btnHex}
                onChange={e => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{6}$/.test(v)) updateButtonColor(v, btnAlpha);
                }}
                className="w-full px-3 py-2 text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0] font-mono min-w-0"
              />
            </div>
          </div>

          {/* Opacidade — ocupa as 2 colunas */}
          <div className="col-span-2 flex items-center gap-3">
            <span className="text-xs font-medium text-[#555555] shrink-0">Opacidade dos botões</span>
            <input
              type="range"
              min={0} max={100}
              value={Math.round(btnAlpha * 100)}
              onChange={e => updateButtonColor(btnHex, parseInt(e.target.value) / 100)}
              className="flex-1 h-2 rounded-full accent-[#0B76A0] cursor-pointer"
            />
            <span className="text-xs font-mono text-[#555555] w-8 text-right shrink-0">
              {Math.round(btnAlpha * 100)}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-[#333333]">Estilo dos botões</h3>
        <div className="grid grid-cols-2 gap-2">
          {BUTTON_STYLE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => update('button_style', opt.value)}
              className={`py-2 px-3 text-sm border-2 transition-colors ${opt.class} ${
                profile.button_style === opt.value
                  ? 'border-[#0B76A0] bg-[#e8f4f8] text-[#095f7d] font-medium'
                  : 'border-[#D9D9D9] text-[#555555] hover:border-[#BFBFBF]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-semibold text-[#333333]">Fonte</h3>
        <div className="grid grid-cols-2 gap-2">
          {FONT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { update('font_family', opt.value); loadGoogleFont(opt.value); }}
              className={`py-2 px-3 text-sm border-2 rounded-lg transition-colors ${
                profile.font_family === opt.value
                  ? 'border-[#0B76A0] bg-[#e8f4f8] text-[#095f7d] font-medium'
                  : 'border-[#D9D9D9] text-[#555555] hover:border-[#BFBFBF]'
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
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#0B76A0] text-white font-medium rounded-xl hover:bg-[#095f7d] disabled:opacity-50 transition-colors"
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
  const [themeConfigs, setThemeConfigs] = useState<Record<string, ThemeConfig>>({});
  const [blocked, setBlocked] = useState<string | null>(null); // themeId que mostrou upsell

  useEffect(() => {
    const unique = [...new Set(THEMES.map(t => t.defaults.font_family))];
    unique.forEach(loadGoogleFont);
    fetchThemeConfigs().then(setThemeConfigs);
  }, []);

  async function handleSelect(themeId: string) {
    const theme = THEMES.find(t => t.id === themeId);
    if (!theme) return;
    const isPro = isThemePro(themeConfigs, themeId);
    if (!canUseTheme(isPro, profile.plan ?? 'free')) {
      setBlocked(themeId);
      return;
    }
    setBlocked(null);
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
      <p className="text-xs text-[#BFBFBF]">Escolha um tema para aplicar cores e efeitos pré-definidos.</p>
      {saving && (
        <div className="flex items-center gap-2 text-sm text-[#0B76A0]">
          <Loader2 className="w-4 h-4 animate-spin" /> Aplicando tema...
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Check className="w-4 h-4" /> Tema aplicado!
        </div>
      )}
      {/* Upsell de tema PRO */}
      {blocked && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <span className="text-base">🔒</span>
          <span>{themeBlockMessage()}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {THEMES.map(theme => {
          const selected = profile.theme_id === theme.id;
          const isPro = isThemePro(themeConfigs, theme.id);
          const locked = isPro && !canUseTheme(isPro, profile.plan ?? 'free');
          const d = theme.defaults;
          return (
            <button
              key={theme.id}
              onClick={() => handleSelect(theme.id)}
              title={theme.description}
              className={`relative rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none shadow-sm ${
                locked ? 'opacity-75' :
                selected
                  ? 'ring-2 ring-[#0B76A0] ring-offset-2 scale-[1.03] shadow-md'
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

              {/* PRO badge */}
              {isPro && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-400 text-[8px] font-black text-black leading-tight shadow">
                  PRO
                </div>
              )}

              {/* Lock overlay for locked themes */}
              {locked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="text-xl">🔒</span>
                </div>
              )}

              {/* Selected badge */}
              {selected && !locked && (
                <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0B76A0] flex items-center justify-center shadow">
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

// ─── Crop Modal ───────────────────────────────────────────────────────────────

const CROP_VIEWPORT = 272;
const CROP_OUTPUT   = 400;

function CropModal({ file, onConfirm, onCancel }: {
  file: File;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const [imgSrc, setImgSrc]         = useState('');
  const [natSize, setNatSize]       = useState({ w: 0, h: 0 });
  const [minScale, setMinScale]     = useState(1);
  const [scale, setScale]           = useState(1);
  const [offset, setOffset]         = useState({ x: 0, y: 0 });
  const [dragging, setDragging]     = useState(false);
  const dragStart                   = useRef({ x: 0, y: 0 });
  const imgRef                      = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    const w = img.naturalWidth, h = img.naturalHeight;
    const min = CROP_VIEWPORT / Math.min(w, h);
    setNatSize({ w, h });
    setMinScale(min);
    setScale(min);
    setOffset({ x: 0, y: 0 });
  }

  function clamp(off: { x: number; y: number }, s: number) {
    const dW = natSize.w * s, dH = natSize.h * s;
    const mX = Math.max(0, (dW - CROP_VIEWPORT) / 2);
    const mY = Math.max(0, (dH - CROP_VIEWPORT) / 2);
    return { x: Math.min(mX, Math.max(-mX, off.x)), y: Math.min(mY, Math.max(-mY, off.y)) };
  }

  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    setOffset(clamp({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y }, scale));
  }
  function onPointerUp() { setDragging(false); }

  function onZoom(e: React.ChangeEvent<HTMLInputElement>) {
    const newScale = parseFloat(e.target.value);
    // Escala o offset proporcionalmente para manter o ponto central do viewport fixo
    const factor = newScale / scale;
    setOffset(prev => clamp({ x: prev.x * factor, y: prev.y * factor }, newScale));
    setScale(newScale);
  }

  function handleConfirm() {
    const img = imgRef.current!;
    const renderedW = img.offsetWidth;
    const renderedH = img.offsetHeight;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = CROP_OUTPUT;
    const ctx = canvas.getContext('2d')!;
    const ratio = CROP_OUTPUT / CROP_VIEWPORT;
    // Mesma fórmula que o CSS: left=50%+offsetX → img top-left em (VP/2 + offsetX - renderedW/2)
    const left = (CROP_VIEWPORT / 2 + offset.x - renderedW / 2) * ratio;
    const top  = (CROP_VIEWPORT / 2 + offset.y - renderedH / 2) * ratio;
    ctx.beginPath();
    ctx.arc(CROP_OUTPUT / 2, CROP_OUTPUT / 2, CROP_OUTPUT / 2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, left, top, renderedW * ratio, renderedH * ratio);
    canvas.toBlob(b => { if (b) onConfirm(b); }, 'image/webp', 0.85);
  }

  const dW = natSize.w * scale, dH = natSize.h * scale;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-[#111]">Reposicionar foto</h3>
          <p className="text-xs text-[#BFBFBF] mt-0.5">Arraste para posicionar · Slider para zoom</p>
        </div>

        {/* Viewport circular */}
        <div className="flex justify-center">
          <div
            className="relative overflow-hidden rounded-full ring-2 ring-[#0B76A0] ring-offset-2"
            style={{
              width: CROP_VIEWPORT, height: CROP_VIEWPORT,
              background: '#ddd',
              cursor: dragging ? 'grabbing' : 'grab',
              touchAction: 'none',
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {imgSrc && (
              <div
                style={{
                  position: 'absolute',
                  width: dW || CROP_VIEWPORT,
                  height: dH || CROP_VIEWPORT,
                  left: dW ? CROP_VIEWPORT / 2 + offset.x - dW / 2 : 0,
                  top: dH ? CROP_VIEWPORT / 2 + offset.y - dH / 2 : 0,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt=""
                  draggable={false}
                  onLoad={onImageLoad}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#888] shrink-0 w-8">Zoom</span>
          <input
            type="range"
            min={minScale} max={minScale * 3} step={0.001}
            value={scale}
            onChange={onZoom}
            className="flex-1 accent-[#0B76A0]"
            disabled={natSize.w === 0}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-[#D9D9D9] rounded-xl text-sm text-[#555] hover:bg-[#f5f5f5] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 bg-[#0B76A0] rounded-xl text-sm text-white font-medium hover:bg-[#095f7d] transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({ profile, onProfileChange }: { profile: Profile; onProfileChange: (p: Profile) => void }) {
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [cropFile, setCropFile]     = useState<File | null>(null);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setCropFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleCropConfirm(blob: Blob) {
    setCropFile(null);
    setUploading(true);
    try {
      const path = `${profile.id}/avatar.webp`;
      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, blob, { upsert: true, contentType: 'image/webp' });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
      onProfileChange({ ...profile, avatar_url: publicUrl });
    } catch {
      setUploadError('Erro ao enviar imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    await supabase.from('profiles').update({
      display_name: profile.display_name,
      bio: profile.bio,
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
      {cropFile && (
        <CropModal
          file={cropFile}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropFile(null)}
        />
      )}

      <div className="bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm space-y-4">

        {/* Avatar upload */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#D9D9D9] shadow-sm"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 opacity-0 hover:opacity-100 transition-opacity text-white disabled:cursor-not-allowed"
            >
              {uploading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <Camera className="w-5 h-5" />
              }
              {!uploading && <span className="text-[10px] font-medium mt-0.5">Trocar</span>}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-xs text-[#0B76A0] hover:underline disabled:opacity-50"
          >
            {uploading ? 'Enviando…' : 'Alterar foto de perfil'}
          </button>
          {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
          <p className="text-[11px] text-[#BFBFBF] text-center">
            JPG, PNG ou WebP · Recorte circular 400×400 px
          </p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#555555]">Nome de exibição</span>
          <input
            className="px-3 py-2 text-base md:text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0]"
            value={profile.display_name ?? ''}
            onChange={e => update('display_name', e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-[#555555]">Bio</span>
          <textarea
            className="px-3 py-2 text-base md:text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0] resize-none"
            rows={3}
            value={profile.bio ?? ''}
            onChange={e => update('bio', e.target.value)}
          />
        </label>
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-3 bg-[#0B76A0] text-white font-medium rounded-xl hover:bg-[#095f7d] disabled:opacity-50 transition-colors"
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
        plan: data.plan ?? 'free',
        role: data.role ?? 'user',
        links: (data.links ?? []).sort((a: Link, b: Link) => a.sort_order - b.sort_order),
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B76A0]" />
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
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#D9D9D9] hidden md:flex flex-col">
        <div className="p-6 border-b border-[#ebebeb] flex flex-col items-center text-center">
          <a href="/"><img src={logo} alt="linqu.es" className="h-20 w-auto" /></a>
          <div className="flex items-center justify-center gap-2 mt-1">
            <p className="text-xs text-[#BFBFBF]">@{profile.username}</p>
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md leading-tight ${
              profile.plan === 'pro' ? 'bg-amber-400 text-black' : 'bg-[#D9D9D9] text-[#555555]'
            }`}>
              {profile.plan === 'pro' ? 'PRO' : 'FREE'}
            </span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {desktopTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === id ? 'bg-[#e8f4f8] text-[#095f7d]' : 'text-[#555555] hover:bg-[#f5f5f5]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#ebebeb]">
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm text-[#555555] hover:text-[#000000] hover:bg-[#f5f5f5] rounded-xl transition-colors mb-1"
          >
            <ExternalLink className="w-4 h-4" />
            Ver meu perfil
          </a>
          {profile.role === 'admin' && (
            <a
              href="/admin"
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#0B76A0] hover:bg-[#e8f4f8] rounded-xl transition-colors mb-1"
            >
              <ShieldCheck className="w-4 h-4" />
              Painel Admin
            </a>
          )}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#555555] hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile — ícone de perfil flutuante */}
      <a
        href={`/${profile.username}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ top: 'calc(0.75rem + env(safe-area-inset-top))', touchAction: 'manipulation' }}
        className="fixed right-4 z-50 md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white border border-[#D9D9D9] text-[#0B76A0] shadow-sm hover:bg-[#e8f4f8] transition-colors"
        aria-label="Ver meu perfil"
      >
        <ExternalLink className="w-4 h-4" />
      </a>

      {/* Mobile tab bar */}
      <div
        className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-[#D9D9D9] flex z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {mobileTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{ touchAction: 'manipulation' }}
            className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[10px] font-medium transition-colors ${
              tab === id ? 'text-[#0B76A0]' : 'text-[#BFBFBF]'
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
              <h2 className="text-xl font-bold text-[#000000] mb-6">
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
        <div className="hidden lg:flex flex-col w-80 xl:w-96 border-l border-[#D9D9D9] bg-[#ebebeb] p-6">
          <p className="text-xs font-semibold text-[#BFBFBF] uppercase tracking-wider mb-4 text-center">Preview</p>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-64 h-[520px] rounded-[2.5rem] border-8 border-[#111111] shadow-2xl overflow-hidden bg-white relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#111111] rounded-b-xl z-10" />
              <MobilePreview profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
