import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Reorder } from 'motion/react';
import {
  Plus, Trash2, GripVertical, ExternalLink, Settings,
  Link as LinkIcon, Layout, Loader2, LogOut, Eye, EyeOff, Save,
  Check, Palette, X, Smartphone, ShieldCheck, Camera, Tag,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { loadGoogleFont } from '../lib/fonts';
import { useAuth } from '../contexts/AuthContext';
import { ICON_MAP, FONT_OPTIONS, BUTTON_STYLE_OPTIONS, getButtonRadius, STATUS_TAGS, STATUS_TAG_SIZES, STATUS_TAG_POSITIONS, STATUS_TAG_ICONS, type Profile, type Link } from '../types';
import { THEMES, getTheme } from '../themes';
import ThemeBackground from '../themes/ThemeBackground';
import logo from '../assets/images/logo.png';
import { linkLimitReached, linkBlockMessage, canUseTheme } from '../lib/plans';
import { fetchThemeConfigs, isThemePro, invalidateThemeConfigCache, type ThemeConfig } from '../lib/themeConfig';
import { fetchCustomThemes, type CustomTheme } from '../lib/customThemes';
import WhatsappFloatingButton from './WhatsappFloatingButton';

type Tab = 'links' | 'theme' | 'appearance' | 'profile' | 'preview';

// ─── Status Tag components ────────────────────────────────────────────────────

type TagDef = typeof STATUS_TAGS[number];

interface StatusTagDisplayProps {
  tag: TagDef;
  profile: Pick<Profile, 'status_tag_color' | 'status_tag_bg' | 'status_tag_size' | 'status_tag_font' | 'status_tag_icon' | 'status_tag_custom_label'>;
  previewSize?: 'xs' | 'sm';
}

function StatusTagDisplay({ tag, profile, previewSize }: StatusTagDisplayProps) {
  const size = previewSize ?? profile.status_tag_size ?? 'md';
  const sizeClass = size === 'sm' || size === 'xs'
    ? 'px-2 py-0.5 text-[9px] gap-1'
    : size === 'lg'
    ? 'px-4 py-2 text-sm gap-2'
    : 'px-3 py-1.5 text-xs gap-1.5';
  const dotClass = size === 'sm' || size === 'xs' ? 'w-1 h-1' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-1.5 h-1.5';
  const color = profile.status_tag_color ?? tag.color;
  const bg    = profile.status_tag_bg    ?? tag.bg;
  const icon  = profile.status_tag_icon  ?? 'dot';
  const font  = profile.status_tag_font;
  const label = profile.status_tag_custom_label?.trim() || tag.label;
  return (
    <span
      className={`tag-fade-in inline-flex items-center font-semibold rounded-full backdrop-blur-sm shadow-sm ${sizeClass}`}
      style={{ color, backgroundColor: bg, border: `1px solid ${color}40`, fontFamily: font ? `'${font}', sans-serif` : undefined }}
    >
      {icon === 'dot'
        ? <span className={`rounded-full flex-shrink-0 tag-dot-pulse ${dotClass}`} style={{ backgroundColor: color }} />
        : <span className="leading-none">{icon}</span>
      }
      {label}
    </span>
  );
}

function StatusTagCard({ profile, onProfileChange }: { profile: Profile; onProfileChange: (p: Profile) => void }) {
  const [saving, setSaving] = useState(false);

  async function handleToggle() {
    const newEnabled = !profile.status_tag_enabled;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ status_tag_enabled: newEnabled }).eq('id', profile.id);
    if (!error) onProfileChange({ ...profile, status_tag_enabled: newEnabled });
    setSaving(false);
  }

  async function handleSelect(tagId: string) {
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ status_tag: tagId }).eq('id', profile.id);
    if (!error) onProfileChange({ ...profile, status_tag: tagId });
    setSaving(false);
  }

  const enabled = profile.status_tag_enabled ?? false;

  return (
    <div className="bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[#333333]">Tag de status</h3>
          <p className="text-xs text-[#BFBFBF] mt-0.5">Aparece acima dos links no seu perfil</p>
        </div>
        <button
          type="button"
          onClick={handleToggle}
          disabled={saving}
          style={{ touchAction: 'manipulation' }}
          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-[#0B76A0]' : 'bg-[#D9D9D9]'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${enabled ? 'left-[22px]' : 'left-0.5'}`} />
        </button>
      </div>

      {enabled && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold text-[#BFBFBF] uppercase tracking-wider">Escolha o status</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_TAGS.map(tag => {
              const active = profile.status_tag === tag.id;
              return (
                <button
                  key={tag.id}
                  onClick={() => handleSelect(tag.id)}
                  style={{
                    color: active ? tag.color : '#888',
                    backgroundColor: active ? tag.bg : '#f5f5f5',
                    borderColor: active ? tag.color : 'transparent',
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? 'tag-dot-pulse' : ''}`}
                    style={{ backgroundColor: active ? tag.color : '#bbb' }} />
                  {tag.label}
                  {active && <Check className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}
          </div>
          {/* Texto customizado */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-[#BFBFBF] uppercase tracking-wider">Texto personalizado</p>
            <div className="relative">
              <input
                type="text"
                maxLength={28}
                placeholder={STATUS_TAGS.find(t => t.id === profile.status_tag)?.label ?? 'Ex: Freelancer'}
                value={profile.status_tag_custom_label ?? ''}
                onChange={e => onProfileChange({ ...profile, status_tag_custom_label: e.target.value || null })}
                onBlur={async e => {
                  const val = e.target.value.trim() || null;
                  await supabase.from('profiles').update({ status_tag_custom_label: val }).eq('id', profile.id);
                }}
                className="w-full px-3 py-2 text-sm border border-[#D9D9D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B76A0] pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#BFBFBF]">
                {(profile.status_tag_custom_label ?? '').length}/28
              </span>
            </div>
            <p className="text-[10px] text-[#BFBFBF]">Deixe vazio para usar o texto padrão</p>
          </div>
          <p className="text-[10px] text-[#BFBFBF]">Personalize cor, tamanho e posição na aba <strong>Aparência</strong></p>
        </div>
      )}
    </div>
  );
}

// ─── Mobile Full Preview (tab preview no celular) ────────────────────────────

function MobileFullPreview({ profile }: { profile: Profile }) {
  const [customTheme, setCustomTheme] = useState<CustomTheme | null>(null);

  useEffect(() => {
    if (profile.font_family) loadGoogleFont(profile.font_family);
  }, [profile.font_family]);

  useEffect(() => {
    if (profile.theme_id?.startsWith('custom_')) {
      fetchCustomThemes().then(list => setCustomTheme(list.find(t => t.id === profile.theme_id) ?? null));
    } else {
      setCustomTheme(null);
    }
  }, [profile.theme_id]);

  const theme = getTheme(profile.theme_id ?? 'default');
  const btnRadius = getButtonRadius(profile.button_style);
  const btnBorderWidth = parseInt(profile.button_border_width ?? '0');
  const btnBorderStyle = btnBorderWidth > 0
    ? { border: `${btnBorderWidth}px solid ${profile.button_border_color ?? profile.button_text_color}` }
    : {};

  return (
    <div
      className="relative min-h-full"
      style={{ backgroundColor: profile.bg_color, fontFamily: `'${profile.font_family}', sans-serif` }}
    >
      <ThemeBackground
        Background={customTheme ? undefined : theme.Background}
        mediaUrl={customTheme?.media_url}
        mediaType={customTheme?.media_type}
        themeId={profile.theme_id ?? 'default'}
      />
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
        {/* Status tag — acima dos links (posições "above-*") */}
        {profile.status_tag_enabled && profile.status_tag && (() => {
          const tag = STATUS_TAGS.find(t => t.id === profile.status_tag);
          const pos = profile.status_tag_position ?? 'above-left';
          if (!tag || !pos.startsWith('above')) return null;
          const align = pos === 'above-center' ? 'items-center' : pos === 'above-right' ? 'items-end' : 'items-start';
          return (
            <div className={`w-full max-w-sm flex flex-col ${align} mb-3`}>
              <StatusTagDisplay tag={tag} profile={profile} previewSize="sm" />
            </div>
          );
        })()}
        <div className="w-full max-w-sm flex flex-col gap-3">
          {profile.links.filter(l => l.is_active).map(link => {
            const Icon = ICON_MAP[link.icon_type] ?? ICON_MAP.link;
            return (
              <div
                key={link.id}
                className="flex items-center gap-3 px-4"
                style={{
                  backgroundColor: profile.button_color,
                  color: profile.button_text_color,
                  borderRadius: btnRadius,
                  minHeight: '52px',
                  ...btnBorderStyle,
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
      {/* Status tag — posições fixas */}
      {profile.status_tag_enabled && profile.status_tag && (() => {
        const tag = STATUS_TAGS.find(t => t.id === profile.status_tag);
        const pos = profile.status_tag_position ?? 'above-left';
        if (!tag || !pos.startsWith('fixed')) return null;
        const cls = pos === 'fixed-tr' ? 'absolute top-4 right-4 z-20' : 'absolute top-4 left-4 z-20';
        return <div className={cls}><StatusTagDisplay tag={tag} profile={profile} previewSize="sm" /></div>;
      })()}
      {profile.whatsapp_enabled && profile.whatsapp_number && (
        <WhatsappFloatingButton
          number={profile.whatsapp_number}
          bgColor={profile.whatsapp_bg_color || '#25D366'}
          iconColor={profile.whatsapp_icon_color || '#ffffff'}
          size={profile.whatsapp_size || 'normal'}
          animation={profile.whatsapp_animation || 'none'}
        />
      )}
    </div>
  );
}

// ─── Mobile Preview (painel desktop) ─────────────────────────────────────────

function MobilePreview({ profile }: { profile: Profile }) {
  const [customTheme, setCustomTheme] = useState<CustomTheme | null>(null);

  useEffect(() => {
    if (profile.font_family) loadGoogleFont(profile.font_family);
  }, [profile.font_family]);

  useEffect(() => {
    if (profile.theme_id?.startsWith('custom_')) {
      fetchCustomThemes().then(list => setCustomTheme(list.find(t => t.id === profile.theme_id) ?? null));
    } else {
      setCustomTheme(null);
    }
  }, [profile.theme_id]);

  const theme = getTheme(profile.theme_id ?? 'default');
  const btnRadius = getButtonRadius(profile.button_style);
  const btnBorderWidth = parseInt(profile.button_border_width ?? '0');
  const btnBorderStyle = btnBorderWidth > 0
    ? { border: `${btnBorderWidth}px solid ${profile.button_border_color ?? profile.button_text_color}` }
    : {};

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        backgroundColor: profile.bg_color,
        backgroundImage: profile.bg_image_url ? `url(${profile.bg_image_url})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: profile.bg_position ?? 'center',
        fontFamily: `'${profile.font_family}', sans-serif`,
      }}
    >
      <ThemeBackground
        Background={customTheme ? undefined : theme.Background}
        mediaUrl={customTheme?.media_url}
        mediaType={customTheme?.media_type}
        themeId={profile.theme_id ?? 'default'}
      />
      <div className="relative h-full overflow-y-auto" style={{ zIndex: 1 }}>
        <div className="flex flex-col items-center py-10 px-4">
          <img
            src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
            className="w-16 h-16 rounded-full border-4 border-white/20 shadow-md mb-2 object-cover"
            referrerPolicy="no-referrer"
          />
          <h1
            className="font-bold text-base text-center mb-1"
            style={{
              color: profile.title_color || profile.text_color,
              fontFamily: profile.title_font ? `'${profile.title_font}', sans-serif` : undefined,
            }}
          >
            {profile.display_name || profile.username}
          </h1>
          {profile.bio && (
            <p
              className="text-xs text-center opacity-70 mb-4 max-w-[200px]"
              style={{
                color: profile.subtitle_color || profile.text_color,
                fontFamily: profile.subtitle_font ? `'${profile.subtitle_font}', sans-serif` : undefined,
              }}
            >
              {profile.bio}
            </p>
          )}
          {/* Status tag — acima dos links */}
          {profile.status_tag_enabled && profile.status_tag && (() => {
            const tag = STATUS_TAGS.find(t => t.id === profile.status_tag);
            const pos = profile.status_tag_position ?? 'above-left';
            if (!tag || !pos.startsWith('above')) return null;
            const align = pos === 'above-center' ? 'items-center' : pos === 'above-right' ? 'items-end' : 'items-start';
            return (
              <div className={`w-full flex flex-col ${align} mb-2`}>
                <StatusTagDisplay tag={tag} profile={profile} previewSize="xs" />
              </div>
            );
          })()}
          <div className="w-full flex flex-col gap-2.5">
            {profile.links.filter(l => l.is_active).map(link => {
              const Icon = ICON_MAP[link.icon_type] ?? ICON_MAP.link;
              return (
                <div
                  key={link.id}
                  className="flex items-center gap-2 p-2.5 backdrop-blur-sm"
                  style={{
                    backgroundColor: profile.button_color,
                    color: profile.button_text_color,
                    borderRadius: btnRadius,
                    fontFamily: profile.button_font ? `'${profile.button_font}', sans-serif` : undefined,
                    ...btnBorderStyle,
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
      {/* Status tag — posições fixas */}
      {profile.status_tag_enabled && profile.status_tag && (() => {
        const tag = STATUS_TAGS.find(t => t.id === profile.status_tag);
        const pos = profile.status_tag_position ?? 'above-left';
        if (!tag || !pos.startsWith('fixed')) return null;
        const cls = pos === 'fixed-tr' ? 'absolute top-3 right-3 z-20' : 'absolute top-3 left-3 z-20';
        return <div className={cls}><StatusTagDisplay tag={tag} profile={profile} previewSize="xs" /></div>;
      })()}
      {profile.whatsapp_enabled && profile.whatsapp_number && (
        <WhatsappFloatingButton
          number={profile.whatsapp_number}
          bgColor={profile.whatsapp_bg_color || '#25D366'}
          iconColor={profile.whatsapp_icon_color || '#ffffff'}
          size={profile.whatsapp_size || 'normal'}
          animation={profile.whatsapp_animation || 'none'}
          preview
        />
      )}
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
  const [waNumber, setWaNumber] = useState(profile.whatsapp_number ?? '');
  const [waSaving, setWaSaving] = useState(false);
  const [waSaved, setWaSaved] = useState(false);

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

  async function handleWaToggle() {
    const newEnabled = !profile.whatsapp_enabled;
    const { error } = await supabase.from('profiles').update({ whatsapp_enabled: newEnabled }).eq('id', profile.id);
    if (!error) onProfileChange({ ...profile, whatsapp_enabled: newEnabled });
  }

  async function handleWaSave(e: React.FormEvent) {
    e.preventDefault();
    setWaSaving(true);
    const { error } = await supabase.from('profiles').update({ whatsapp_number: waNumber }).eq('id', profile.id);
    if (!error) {
      onProfileChange({ ...profile, whatsapp_number: waNumber });
      setWaSaved(true);
      setTimeout(() => setWaSaved(false), 2000);
    }
    setWaSaving(false);
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

      {/* Status Tag */}
      <StatusTagCard profile={profile} onProfileChange={onProfileChange} />

      {/* WhatsApp flutuante */}
      <div className={`bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm space-y-4 ${(profile.plan ?? 'free') !== 'pro' ? 'opacity-70' : ''}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-[#333333]">Botão flutuante do WhatsApp</h3>
              {(profile.plan ?? 'free') !== 'pro' && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-400 text-[8px] font-black text-black leading-tight">PRO</span>
              )}
            </div>
            <p className="text-xs text-[#BFBFBF] mt-0.5">Aparece no canto inferior direito do seu perfil</p>
          </div>
          {(profile.plan ?? 'free') === 'pro' ? (
            <button
              type="button"
              onClick={handleWaToggle}
              style={{ touchAction: 'manipulation' }}
              className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                profile.whatsapp_enabled ? 'bg-[#25D366]' : 'bg-[#D9D9D9]'
              }`}
              aria-label="Ativar botão do WhatsApp"
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                  profile.whatsapp_enabled ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </button>
          ) : (
            <span className="text-lg">🔒</span>
          )}
        </div>

        {(profile.plan ?? 'free') !== 'pro' && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Faça upgrade para o plano PRO para ativar o botão flutuante do WhatsApp.
          </p>
        )}

        {(profile.plan ?? 'free') === 'pro' && profile.whatsapp_enabled && (
          <form onSubmit={handleWaSave} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-[#555555] block mb-1.5">Número do WhatsApp</label>
              <input
                type="tel"
                placeholder="+55 11 99999-9999"
                value={waNumber}
                onChange={e => setWaNumber(e.target.value)}
                className="w-full px-4 py-3 text-base border border-[#D9D9D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                required
              />
              <p className="text-[11px] text-[#BFBFBF] mt-1">Com código do país, ex: +5511999999999</p>
            </div>
            <button
              type="submit"
              disabled={waSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white text-sm font-medium rounded-xl hover:bg-[#1da851] disabled:opacity-50 transition-colors"
            >
              {waSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : waSaved ? <Check className="w-4 h-4" /> : null}
              {waSaved ? 'Salvo!' : 'Salvar número'}
            </button>
          </form>
        )}
      </div>

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

function compressImage(file: File, maxWidth = 1920, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidth / img.naturalWidth);
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      canvas.toBlob(b => b ? resolve(b) : reject(new Error('toBlob failed')), 'image/webp', quality);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function BgPositionModal({ imageUrl, initialPosition, onConfirm, onClose }: {
  imageUrl: string;
  initialPosition: string;
  onConfirm: (position: string) => void;
  onClose: () => void;
}) {
  const parsePos = (pos: string) => {
    const [x, y] = pos.split(' ').map(v => parseFloat(v) || 50);
    return { x, y };
  };
  const [pos, setPos] = useState(() => parsePos(initialPosition));
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const lastPtr = useRef({ x: 0, y: 0 });

  function onPointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    lastPtr.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || !containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const dx = e.clientX - lastPtr.current.x;
    const dy = e.clientY - lastPtr.current.y;
    lastPtr.current = { x: e.clientX, y: e.clientY };
    setPos(prev => ({
      x: Math.min(100, Math.max(0, prev.x - (dx / width) * 100)),
      y: Math.min(100, Math.max(0, prev.y - (dy / height) * 100)),
    }));
  }

  function onPointerUp() { dragging.current = false; }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-[#111]">Reposicionar foto de fundo</h3>
          <p className="text-xs text-[#BFBFBF] mt-0.5">Arraste para escolher o enquadramento</p>
        </div>

        {/* Preview */}
        <div className="flex justify-center">
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl ring-2 ring-[#0B76A0] ring-offset-2"
            style={{ width: 220, height: 390, cursor: dragging.current ? 'grabbing' : 'grab', touchAction: 'none' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <img
              src={imageUrl}
              draggable={false}
              className="w-full h-full select-none"
              style={{ objectFit: 'cover', objectPosition: `${pos.x}% ${pos.y}%`, userSelect: 'none' }}
            />
            {/* crosshair */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-6 h-px bg-white/60" />
              <div className="absolute w-px h-6 bg-white/60" />
            </div>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#555] w-16 shrink-0">Horizontal</span>
            <input type="range" min={0} max={100} value={Math.round(pos.x)}
              onChange={e => setPos(p => ({ ...p, x: parseInt(e.target.value) }))}
              className="flex-1 h-2 rounded-full accent-[#0B76A0] cursor-pointer"
            />
            <span className="text-xs font-mono text-[#555] w-8 text-right">{Math.round(pos.x)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#555] w-16 shrink-0">Vertical</span>
            <input type="range" min={0} max={100} value={Math.round(pos.y)}
              onChange={e => setPos(p => ({ ...p, y: parseInt(e.target.value) }))}
              className="flex-1 h-2 rounded-full accent-[#0B76A0] cursor-pointer"
            />
            <span className="text-xs font-mono text-[#555] w-8 text-right">{Math.round(pos.y)}%</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-[#D9D9D9] rounded-xl text-sm text-[#555] hover:bg-[#F5F5F5] transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => { onConfirm(`${Math.round(pos.x)}% ${Math.round(pos.y)}%`); onClose(); }}
            className="flex-1 py-2.5 bg-[#0B76A0] rounded-xl text-sm text-white font-medium hover:bg-[#095f7d] transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function FontPickerButton({ value, placeholder, onClick }: { value: string; placeholder?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-between px-3 py-2.5 border-2 border-[#D9D9D9] rounded-xl hover:border-[#0B76A0] transition-colors text-left min-w-0"
    >
      <span className="text-sm text-[#111] truncate" style={{ fontFamily: `'${value}', sans-serif` }}>
        {value || placeholder}
      </span>
      <svg className="w-4 h-4 text-[#888] shrink-0 ml-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

type FontTarget = 'title_font' | 'subtitle_font' | 'button_font';

const FONT_TARGET_LABELS: Record<FontTarget, string> = {
  title_font: 'Fonte do título',
  subtitle_font: 'Fonte do subtítulo',
  button_font: 'Fonte dos botões',
};

function AppearanceTab({ profile, onProfileChange }: { profile: Profile; onProfileChange: (p: Profile) => void }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fontModalTarget, setFontModalTarget] = useState<FontTarget | null>(null);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [bgPositionModal, setBgPositionModal] = useState(false);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    FONT_OPTIONS.forEach(opt => loadGoogleFont(opt.value));
  }, []);

  const [btnHex, btnAlpha] = colorToHexAndAlpha(profile.button_color ?? '#ffffff');

  async function handleSave() {
    setSaving(true);
    await supabase.from('profiles').update({
      bg_color: profile.bg_color,
      bg_image_url: profile.bg_image_url ?? null,
      bg_position: profile.bg_position ?? null,
      text_color: profile.text_color,
      button_color: profile.button_color,
      button_text_color: profile.button_text_color,
      button_style: profile.button_style,
      button_border_width: profile.button_border_width ?? '0',
      button_border_color: profile.button_border_color ?? null,
      font_family: profile.font_family,
      title_color: profile.title_color ?? null,
      title_font: profile.title_font ?? null,
      subtitle_color: profile.subtitle_color ?? null,
      subtitle_font: profile.subtitle_font ?? null,
      button_font: profile.button_font ?? null,
      whatsapp_bg_color: profile.whatsapp_bg_color ?? null,
      whatsapp_icon_color: profile.whatsapp_icon_color ?? null,
      whatsapp_size: profile.whatsapp_size ?? null,
      whatsapp_animation: profile.whatsapp_animation ?? null,
      status_tag_color: profile.status_tag_color ?? null,
      status_tag_bg: profile.status_tag_bg ?? null,
      status_tag_size: profile.status_tag_size ?? 'md',
      status_tag_position: profile.status_tag_position ?? 'above-left',
      status_tag_font: profile.status_tag_font ?? null,
      status_tag_icon: profile.status_tag_icon ?? 'dot',
      status_tag_custom_label: profile.status_tag_custom_label ?? null,
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

  async function handleBgUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (bgFileInputRef.current) bgFileInputRef.current.value = '';
    setUploadingBg(true);
    try {
      const blob = await compressImage(file);
      const path = `${profile.id}/bg.webp`;
      const { error } = await supabase.storage
        .from('backgrounds')
        .upload(path, blob, { upsert: true, contentType: 'image/webp' });
      if (error) throw error;
      const { data } = supabase.storage.from('backgrounds').getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      onProfileChange({ ...profile, bg_image_url: url, bg_position: '50% 50%' });
    } catch {
      // silently fail — user can retry
    } finally {
      setUploadingBg(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* Fundo */}
      <div className="bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-[#333333]">Fundo</h3>
        <label className="flex flex-col gap-2 cursor-pointer">
          <span className="text-xs font-medium text-[#555555]">Cor de fundo</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={profile.bg_color?.startsWith('#') ? profile.bg_color : '#ffffff'}
              onChange={e => update('bg_color', e.target.value)}
              className="w-10 h-10 rounded-lg border border-[#D9D9D9] cursor-pointer p-0.5 shrink-0"
            />
            <input
              type="text"
              value={profile.bg_color ?? ''}
              onChange={e => update('bg_color', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0] font-mono min-w-0"
            />
          </div>
        </label>

        {/* Foto de fundo — PRO */}
        {profile.plan === 'pro' ? (
          <div className="space-y-2">
            <span className="text-xs font-medium text-[#555555]">Foto de fundo</span>
            {profile.bg_image_url && (
              <div className="relative w-full h-24 rounded-xl overflow-hidden border border-[#D9D9D9]">
                <img
                  src={profile.bg_image_url}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: profile.bg_position ?? '50% 50%' }}
                />
                <button
                  onClick={() => onProfileChange({ ...profile, bg_image_url: '', bg_position: undefined })}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white text-xs hover:bg-black/80"
                >✕</button>
              </div>
            )}
            <input ref={bgFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
            <div className="flex gap-2">
              <button
                onClick={() => bgFileInputRef.current?.click()}
                disabled={uploadingBg}
                className="flex-1 py-2 px-4 border-2 border-dashed border-[#D9D9D9] rounded-xl text-sm text-[#555] hover:border-[#0B76A0] hover:text-[#0B76A0] transition-colors disabled:opacity-50"
              >
                {uploadingBg ? 'Comprimindo…' : profile.bg_image_url ? 'Trocar foto' : 'Carregar foto de fundo'}
              </button>
              {profile.bg_image_url && (
                <button
                  onClick={() => setBgPositionModal(true)}
                  className="py-2 px-3 border-2 border-[#D9D9D9] rounded-xl text-sm text-[#555] hover:border-[#0B76A0] hover:text-[#0B76A0] transition-colors"
                >
                  Reposicionar
                </button>
              )}
            </div>

            {bgPositionModal && profile.bg_image_url && (
              <BgPositionModal
                imageUrl={profile.bg_image_url}
                initialPosition={profile.bg_position ?? '50% 50%'}
                onConfirm={pos => onProfileChange({ ...profile, bg_position: pos })}
                onClose={() => setBgPositionModal(false)}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-amber-500 text-lg">🔒</span>
            <div>
              <p className="text-xs font-semibold text-amber-700">Foto de fundo — PRO</p>
              <p className="text-xs text-amber-600">Faça upgrade para usar uma imagem de fundo personalizada.</p>
            </div>
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-[#333333]">Botões</h3>

        {/* Formato */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#555]">Formato</span>
          <div className="grid grid-cols-3 gap-2">
            {BUTTON_STYLE_OPTIONS.map(opt => {
              const selected = profile.button_style === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => update('button_style', opt.value)}
                  className={`flex flex-col items-center gap-1.5 py-3 px-2 border-2 rounded-xl transition-colors ${
                    selected ? 'border-[#0B76A0] bg-[#e8f4f8]' : 'border-[#E8E8E8] hover:border-[#BFBFBF]'
                  }`}
                >
                  {/* Mini botão visual */}
                  <div
                    className="w-full h-5"
                    style={{
                      backgroundColor: selected ? '#0B76A0' : '#CBD5E1',
                      borderRadius: opt.radius,
                    }}
                  />
                  <span className={`text-[10px] leading-tight ${selected ? 'text-[#095f7d] font-semibold' : 'text-[#666]'}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fundo dos botões */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#555]">Fundo</span>
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
              onChange={e => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) updateButtonColor(e.target.value, btnAlpha); }}
              className="w-full px-3 py-2 text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0] font-mono min-w-0"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#555] shrink-0">Opacidade</span>
            <input
              type="range" min={0} max={100}
              value={Math.round(btnAlpha * 100)}
              onChange={e => updateButtonColor(btnHex, parseInt(e.target.value) / 100)}
              className="flex-1 h-2 rounded-full accent-[#0B76A0] cursor-pointer"
            />
            <span className="text-xs font-mono text-[#555] w-8 text-right shrink-0">{Math.round(btnAlpha * 100)}%</span>
          </div>
        </div>

        {/* Cor do texto dos botões */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#555]">Cor do texto</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={profile.button_text_color?.startsWith('#') ? profile.button_text_color : '#ffffff'}
              onChange={e => update('button_text_color', e.target.value)}
              className="w-10 h-10 rounded-lg border border-[#D9D9D9] cursor-pointer p-0.5 shrink-0"
            />
            <input
              type="text"
              value={profile.button_text_color ?? ''}
              onChange={e => update('button_text_color', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0] font-mono min-w-0"
            />
          </div>
        </div>

        {/* Borda */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#555]">Borda</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#555] shrink-0">Espessura</span>
            <input
              type="range" min={0} max={4}
              value={parseInt(profile.button_border_width ?? '0')}
              onChange={e => update('button_border_width', e.target.value)}
              className="flex-1 h-2 rounded-full accent-[#0B76A0] cursor-pointer"
            />
            <span className="text-xs font-mono text-[#555] w-8 text-right shrink-0">
              {profile.button_border_width ?? '0'}px
            </span>
          </div>
          {parseInt(profile.button_border_width ?? '0') > 0 && (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={profile.button_border_color?.startsWith('#') ? profile.button_border_color : profile.button_text_color?.startsWith('#') ? profile.button_text_color : '#000000'}
                onChange={e => update('button_border_color', e.target.value)}
                className="w-10 h-10 rounded-lg border border-[#D9D9D9] cursor-pointer p-0.5 shrink-0"
              />
              <input
                type="text"
                value={profile.button_border_color ?? ''}
                onChange={e => update('button_border_color', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0] font-mono min-w-0"
                placeholder="Cor da borda"
              />
            </div>
          )}
        </div>

        {/* Fonte dos botões */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#555]">Fonte</span>
          <div className="flex items-center gap-2">
            <FontPickerButton
              value={profile.button_font || profile.font_family}
              onClick={() => setFontModalTarget('button_font')}
            />
            {profile.button_font && (
              <button onClick={() => update('button_font', '')} className="text-xs text-[#999] hover:text-red-400 shrink-0">✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Tipografia */}
      <div className="bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-[#333333]">Tipografia</h3>

        {/* Título */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#555]">Título</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={profile.title_color?.startsWith('#') ? profile.title_color : (profile.text_color?.startsWith('#') ? profile.text_color : '#000000')}
              onChange={e => update('title_color', e.target.value)}
              className="w-10 h-10 rounded-lg border border-[#D9D9D9] cursor-pointer p-0.5 shrink-0"
            />
            <FontPickerButton
              value={profile.title_font || profile.font_family}
              onClick={() => setFontModalTarget('title_font')}
            />
            {profile.title_font && (
              <button onClick={() => update('title_font', '')} className="text-xs text-[#999] hover:text-red-400 shrink-0">✕</button>
            )}
          </div>
        </div>

        {/* Subtítulo */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-[#555]">Subtítulo / Bio</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={profile.subtitle_color?.startsWith('#') ? profile.subtitle_color : (profile.text_color?.startsWith('#') ? profile.text_color : '#000000')}
              onChange={e => update('subtitle_color', e.target.value)}
              className="w-10 h-10 rounded-lg border border-[#D9D9D9] cursor-pointer p-0.5 shrink-0"
            />
            <FontPickerButton
              value={profile.subtitle_font || profile.font_family}
              onClick={() => setFontModalTarget('subtitle_font')}
            />
            {profile.subtitle_font && (
              <button onClick={() => update('subtitle_font', '')} className="text-xs text-[#999] hover:text-red-400 shrink-0">✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Font picker modal */}
      {fontModalTarget && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setFontModalTarget(null)}
        >
          <div
            className="bg-white w-full sm:w-[420px] rounded-t-3xl sm:rounded-2xl shadow-2xl p-5 max-h-[70vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[#111]">{FONT_TARGET_LABELS[fontModalTarget]}</h3>
              <button
                onClick={() => setFontModalTarget(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#F0F0F0] hover:bg-[#E0E0E0] transition-colors text-[#555]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto grid grid-cols-2 gap-2 pr-1">
              {FONT_OPTIONS.map(opt => {
                const current = (profile[fontModalTarget] as string) || profile.font_family;
                const selected = current === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      update(fontModalTarget, opt.value);
                      loadGoogleFont(opt.value);
                      setFontModalTarget(null);
                    }}
                    className={`flex flex-col items-start px-4 py-3 rounded-xl border-2 transition-colors text-left ${
                      selected ? 'border-[#0B76A0] bg-[#e8f4f8]' : 'border-[#E8E8E8] hover:border-[#BFBFBF]'
                    }`}
                  >
                    <span
                      className="text-xl leading-none mb-1"
                      style={{ fontFamily: `'${opt.value}', sans-serif`, color: selected ? '#095f7d' : '#111' }}
                    >
                      Aa
                    </span>
                    <span className={`text-xs ${selected ? 'text-[#095f7d] font-medium' : 'text-[#666]'}`}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp — só aparece se o botão estiver ativado na aba Links */}
      {profile.whatsapp_enabled && (
        <div className="bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <h3 className="text-sm font-semibold text-[#333333]">Botão WhatsApp</h3>
          </div>

          {/* Cor do botão */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-[#555]">Cor do botão</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={profile.whatsapp_bg_color?.startsWith('#') ? profile.whatsapp_bg_color : '#25D366'}
                onChange={e => update('whatsapp_bg_color', e.target.value)}
                className="w-10 h-10 rounded-lg border border-[#D9D9D9] cursor-pointer p-0.5 shrink-0"
              />
              <input
                type="text"
                value={profile.whatsapp_bg_color ?? '#25D366'}
                onChange={e => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) update('whatsapp_bg_color', e.target.value); }}
                className="w-full px-3 py-2 text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] font-mono min-w-0"
              />
            </div>
          </div>

          {/* Cor do ícone */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-[#555]">Cor do ícone</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={profile.whatsapp_icon_color?.startsWith('#') ? profile.whatsapp_icon_color : '#ffffff'}
                onChange={e => update('whatsapp_icon_color', e.target.value)}
                className="w-10 h-10 rounded-lg border border-[#D9D9D9] cursor-pointer p-0.5 shrink-0"
              />
              <input
                type="text"
                value={profile.whatsapp_icon_color ?? '#ffffff'}
                onChange={e => { if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) update('whatsapp_icon_color', e.target.value); }}
                className="w-full px-3 py-2 text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#25D366] font-mono min-w-0"
              />
            </div>
          </div>

          {/* Tamanho */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-[#555]">Tamanho</span>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'normal', label: 'Normal', px: 56 },
                { value: 'large',  label: 'Grande', px: 68 },
              ] as const).map(opt => {
                const selected = (profile.whatsapp_size ?? 'normal') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update('whatsapp_size', opt.value)}
                    className={`flex flex-col items-center gap-2 py-3 border-2 rounded-xl transition-colors ${
                      selected ? 'border-[#25D366] bg-[#e8f8ed]' : 'border-[#E8E8E8] hover:border-[#BFBFBF]'
                    }`}
                  >
                    <div
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: opt.px * 0.55,
                        height: opt.px * 0.55,
                        backgroundColor: profile.whatsapp_bg_color ?? '#25D366',
                      }}
                    >
                      <svg width={opt.px * 0.28} height={opt.px * 0.28} viewBox="0 0 24 24" fill={profile.whatsapp_icon_color ?? '#ffffff'}>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <span className={`text-xs ${selected ? 'text-[#1a8a46] font-semibold' : 'text-[#666]'}`}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animação */}
          <div className="space-y-2">
            <span className="text-xs font-medium text-[#555]">Animação</span>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'none',   label: 'Nenhuma' },
                { value: 'pulse',  label: 'Pulsar'  },
                { value: 'bounce', label: 'Saltar'  },
                { value: 'shake',  label: 'Chacoalhar' },
              ] as const).map(opt => {
                const selected = (profile.whatsapp_animation ?? 'none') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => update('whatsapp_animation', opt.value)}
                    className={`py-2.5 px-3 border-2 rounded-xl text-xs transition-colors ${
                      selected ? 'border-[#25D366] bg-[#e8f8ed] text-[#1a8a46] font-semibold' : 'border-[#E8E8E8] hover:border-[#BFBFBF] text-[#666]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Tag de status ─────────────────────────────────────────── */}
      {profile.status_tag_enabled && profile.status_tag && (() => {
        const tag = STATUS_TAGS.find(t => t.id === profile.status_tag)!;
        if (!tag) return null;
        return (
          <div className="bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#333333]">Tag de status</h3>
              <StatusTagDisplay tag={tag} profile={profile} previewSize="sm" />
            </div>

            {/* Cor do texto */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[#555]">Cor do texto</span>
              <div className="flex items-center gap-3">
                <input type="color"
                  value={profile.status_tag_color ?? tag.color}
                  onChange={e => update('status_tag_color', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-[#D9D9D9] cursor-pointer p-0.5"
                />
                <button onClick={() => update('status_tag_color', tag.color)}
                  className="text-xs text-[#BFBFBF] hover:text-[#555] transition-colors">
                  Restaurar padrão
                </button>
              </div>
            </div>

            {/* Cor do fundo */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[#555]">Cor do fundo</span>
              <div className="flex items-center gap-3">
                <input type="color"
                  value={profile.status_tag_bg
                    ? profile.status_tag_bg.startsWith('rgba')
                      ? tag.color
                      : profile.status_tag_bg
                    : tag.color}
                  onChange={e => update('status_tag_bg', e.target.value + '26')}
                  className="w-10 h-10 rounded-lg border border-[#D9D9D9] cursor-pointer p-0.5"
                />
                <button onClick={() => update('status_tag_bg', tag.bg)}
                  className="text-xs text-[#BFBFBF] hover:text-[#555] transition-colors">
                  Restaurar padrão
                </button>
              </div>
            </div>

            {/* Tamanho */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[#555]">Tamanho</span>
              <div className="flex gap-2">
                {STATUS_TAG_SIZES.map(s => {
                  const active = (profile.status_tag_size ?? 'md') === s.id;
                  return (
                    <button key={s.id} onClick={() => update('status_tag_size', s.id)}
                      className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold transition-colors ${
                        active ? 'border-[#0B76A0] bg-[#e8f4f8] text-[#0B76A0]' : 'border-[#E8E8E8] text-[#888] hover:border-[#BFBFBF]'
                      }`}>
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ícone */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[#555]">Ícone</span>
              <div className="flex flex-wrap gap-2">
                {STATUS_TAG_ICONS.map(ic => {
                  const active = (profile.status_tag_icon ?? 'dot') === ic.id;
                  return (
                    <button key={ic.id} onClick={() => update('status_tag_icon', ic.id)}
                      className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-base transition-colors ${
                        active ? 'border-[#0B76A0] bg-[#e8f4f8]' : 'border-[#E8E8E8] hover:border-[#BFBFBF]'
                      }`}>
                      {ic.id === 'dot'
                        ? <span className="w-2.5 h-2.5 rounded-full bg-[#0B76A0]" />
                        : ic.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fonte */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[#555]">Fonte</span>
              <select
                value={profile.status_tag_font ?? ''}
                onChange={e => update('status_tag_font', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-[#D9D9D9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B76A0] bg-white"
              >
                <option value="">Padrão do perfil</option>
                {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>

            {/* Posição */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-[#555]">Posição</span>
              <div className="grid grid-cols-1 gap-2">
                {STATUS_TAG_POSITIONS.map(pos => {
                  const active = (profile.status_tag_position ?? 'above-left') === pos.id;
                  return (
                    <button key={pos.id} onClick={() => update('status_tag_position', pos.id)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl border-2 text-sm transition-colors ${
                        active ? 'border-[#0B76A0] bg-[#e8f4f8] text-[#0B76A0]' : 'border-[#E8E8E8] text-[#555] hover:border-[#BFBFBF]'
                      }`}>
                      <span className="font-medium">{pos.label}</span>
                      <span className="text-xs opacity-60">{pos.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

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
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);
  const originalProfileRef = useRef<Profile | null>(null);
  const onProfileChangeRef = useRef(onProfileChange);
  useEffect(() => { onProfileChangeRef.current = onProfileChange; });

  // Restore original profile when tab unmounts while in preview mode
  useEffect(() => {
    return () => {
      if (originalProfileRef.current) {
        onProfileChangeRef.current(originalProfileRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const unique = [...new Set(THEMES.map(t => t.defaults.font_family))];
    unique.forEach(loadGoogleFont);
    fetchThemeConfigs().then(setThemeConfigs);
    fetchCustomThemes().then(setCustomThemes);
  }, []);

  function cancelPreview() {
    if (originalProfileRef.current) {
      onProfileChange(originalProfileRef.current);
      originalProfileRef.current = null;
    }
    setPreviewThemeId(null);
  }

  async function handleSelect(themeId: string) {
    const theme = THEMES.find(t => t.id === themeId);
    const customTheme = customThemes.find(t => t.id === themeId);
    if (!theme && !customTheme) return;

    const isPro = theme ? isThemePro(themeConfigs, themeId, theme) : (customTheme!.media_type === 'video');
    const isLocked = !canUseTheme(isPro, profile.plan ?? 'free');

    const defaults = theme
      ? theme.defaults
      : {
          bg_color: customTheme!.preview_color,
          text_color: customTheme!.text_color,
          button_color: customTheme!.button_color,
          button_text_color: customTheme!.button_text_color,
          button_style: customTheme!.button_style,
          font_family: customTheme!.font_family,
        };

    if (isLocked) {
      // Preview only: apply visually but don't save
      if (!previewThemeId) {
        originalProfileRef.current = profile;
      }
      setPreviewThemeId(themeId);

      onProfileChange({ ...profile, theme_id: themeId, ...defaults });
      return;
    }

    // Selecting a free theme: clear preview mode first
    if (previewThemeId) {
      setPreviewThemeId(null);
      originalProfileRef.current = null;
    }

    const updated: Profile = { ...profile, theme_id: themeId, ...defaults };
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
      {/* Banner de preview de tema PRO */}
      {previewThemeId && (
        <div className="flex items-center justify-between gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 shrink-0" />
            <span>Você está <strong>visualizando</strong> um tema PRO. Faça upgrade para aplicar.</span>
          </div>
          <button
            onClick={cancelPreview}
            className="text-xs underline whitespace-nowrap hover:text-amber-900"
          >
            Cancelar
          </button>
        </div>
      )}

      {(['static', 'animated'] as const).map(group => {
        const groupThemes = THEMES.filter(t => (t.group ?? (t.Background ? 'animated' : 'static')) === group);
        if (groupThemes.length === 0) return null;
        return (
          <div key={group} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#BFBFBF]">
                {group === 'static' ? 'Estáticos' : 'Animados'}
              </span>
              <div className="flex-1 h-px bg-[#E8E8E8]" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-4">
              {groupThemes.map(theme => {
                const isPro = isThemePro(themeConfigs, theme.id, theme);
                const locked = isPro && !canUseTheme(isPro, profile.plan ?? 'free');
                const isPreviewing = previewThemeId === theme.id;
                const isSelected = !previewThemeId
                  ? profile.theme_id === theme.id
                  : originalProfileRef.current?.theme_id === theme.id;
                const d = theme.defaults;
                const btnRadius = getButtonRadius(d.button_style);
                return (
                  <div key={theme.id} className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => handleSelect(theme.id)}
                      title={theme.description}
                      className={`relative w-full rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none ${
                        isPreviewing
                          ? 'ring-2 ring-amber-400 ring-offset-2 shadow-lg scale-[1.04]'
                          : isSelected
                          ? 'ring-2 ring-[#0B76A0] ring-offset-2 shadow-lg scale-[1.04]'
                          : locked && !isPreviewing
                          ? 'opacity-60 hover:opacity-80 hover:scale-[1.03] ring-1 ring-black/10'
                          : 'hover:scale-[1.03] hover:shadow-md ring-1 ring-black/10'
                      }`}
                      style={{ aspectRatio: '3/4' }}
                    >
                      {/* Card body */}
                      {themeConfigs[theme.id]?.preview_url ? (
                        <img
                          src={themeConfigs[theme.id]!.preview_url}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3"
                          style={theme.previewStyle as React.CSSProperties}
                        >
                          {/* "Aa" typography sample */}
                          <span
                            className="font-bold leading-none select-none"
                            style={{
                              fontSize: 'clamp(22px, 6vw, 30px)',
                              color: d.text_color,
                              fontFamily: `'${d.font_family}', sans-serif`,
                            }}
                          >
                            Aa
                          </span>

                          {/* Mini button */}
                          <div
                            className="w-4/5"
                            style={{
                              height: '18px',
                              backgroundColor: d.button_color,
                              borderRadius: btnRadius,
                            }}
                          />
                        </div>
                      )}

                      {/* PRO badge */}
                      {isPro && (
                        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-400 text-[8px] font-black text-black leading-tight shadow">
                          PRO
                        </div>
                      )}

                      {/* Lock overlay (only when not previewing this card) */}
                      {locked && !isPreviewing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/25 rounded-2xl">
                          <span className="text-lg">🔒</span>
                        </div>
                      )}

                      {/* Preview eye icon */}
                      {isPreviewing && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow">
                          <Eye className="w-3 h-3 text-black" />
                        </div>
                      )}

                      {/* Selected checkmark */}
                      {isSelected && !locked && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#0B76A0] flex items-center justify-center shadow">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>

                    {/* Theme name below card */}
                    <p
                      className={`text-[11px] text-center leading-tight truncate w-full ${
                        isPreviewing ? 'font-semibold text-amber-600' :
                        isSelected ? 'font-semibold text-[#0B76A0]' : 'text-gray-500'
                      }`}
                    >
                      {theme.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* ── Temas estáticos (imagem) ── */}
      {customThemes.filter(t => t.media_type === 'image').length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#BFBFBF]">Estáticos</span>
            <div className="flex-1 h-px bg-[#E8E8E8]" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-4">
            {customThemes.filter(t => t.media_type === 'image').map(theme => {
              const isVideoPro = false;
              const locked = isVideoPro && !canUseTheme(isVideoPro, profile.plan ?? 'free');
              const isPreviewing = previewThemeId === theme.id;
              const isSelected = !previewThemeId
                ? profile.theme_id === theme.id
                : originalProfileRef.current?.theme_id === theme.id;
              return (
                <div key={theme.id} className="flex flex-col items-center gap-1.5">
                  <button
                    onClick={() => handleSelect(theme.id)}
                    title={theme.description}
                    className={`relative w-full rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none ${
                      isPreviewing
                        ? 'ring-2 ring-amber-400 ring-offset-2 shadow-lg scale-[1.04]'
                        : isSelected
                        ? 'ring-2 ring-[#0B76A0] ring-offset-2 shadow-lg scale-[1.04]'
                        : locked && !isPreviewing
                        ? 'opacity-60 hover:opacity-80 hover:scale-[1.03] ring-1 ring-black/10'
                        : 'hover:scale-[1.03] hover:shadow-md ring-1 ring-black/10'
                    }`}
                    style={{ aspectRatio: '3/4' }}
                  >
                    <img src={theme.media_url} className="absolute inset-0 w-full h-full object-cover" />
                    {locked && !isPreviewing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25 rounded-2xl">
                        <span className="text-lg">🔒</span>
                      </div>
                    )}
                    {isPreviewing && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow">
                        <Eye className="w-3 h-3 text-black" />
                      </div>
                    )}
                    {isSelected && !locked && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#0B76A0] flex items-center justify-center shadow">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                  <p className={`text-[11px] text-center leading-tight truncate w-full ${
                    isPreviewing ? 'font-semibold text-amber-600' :
                    isSelected ? 'font-semibold text-[#0B76A0]' : 'text-gray-500'
                  }`}>
                    {theme.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Temas de vídeo ── */}
      {customThemes.filter(t => t.media_type === 'video').length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-[#BFBFBF]">Vídeo</span>
            <div className="flex-1 h-px bg-[#E8E8E8]" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-4">
            {customThemes.filter(t => t.media_type === 'video').map(theme => {
              const isVideoPro = true; // vídeos sempre PRO
              const locked = isVideoPro && !canUseTheme(isVideoPro, profile.plan ?? 'free');
              const isPreviewing = previewThemeId === theme.id;
              const isSelected = !previewThemeId
                ? profile.theme_id === theme.id
                : originalProfileRef.current?.theme_id === theme.id;
              return (
                <div key={theme.id} className="flex flex-col items-center gap-1.5">
                  <button
                    onClick={() => handleSelect(theme.id)}
                    title={theme.description}
                    className={`relative w-full rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none ${
                      isPreviewing
                        ? 'ring-2 ring-amber-400 ring-offset-2 shadow-lg scale-[1.04]'
                        : isSelected
                        ? 'ring-2 ring-[#0B76A0] ring-offset-2 shadow-lg scale-[1.04]'
                        : locked && !isPreviewing
                        ? 'opacity-60 hover:opacity-80 hover:scale-[1.03] ring-1 ring-black/10'
                        : 'hover:scale-[1.03] hover:shadow-md ring-1 ring-black/10'
                    }`}
                    style={{ aspectRatio: '3/4' }}
                  >
                    {theme.thumbnail_url
                      ? <img src={theme.thumbnail_url} className="absolute inset-0 w-full h-full object-cover" />
                      : <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: theme.preview_color }} />
                    }
                    {/* Ícone de play — indica que é vídeo */}
                    <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow pointer-events-none">
                      <span className="text-[8px] leading-none pl-px">▶</span>
                    </div>
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-amber-400 text-[8px] font-black text-black leading-tight shadow">
                      PRO
                    </div>
                    {locked && !isPreviewing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25 rounded-2xl">
                        <span className="text-lg">🔒</span>
                      </div>
                    )}
                    {isPreviewing && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow">
                        <Eye className="w-3 h-3 text-black" />
                      </div>
                    )}
                    {isSelected && !locked && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#0B76A0] flex items-center justify-center shadow">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                  <p className={`text-[11px] text-center leading-tight truncate w-full ${
                    isPreviewing ? 'font-semibold text-amber-600' :
                    isSelected ? 'font-semibold text-[#0B76A0]' : 'text-gray-500'
                  }`}>
                    {theme.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
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

const INITIAL_AVATAR_SEEDS = [
  'Felix','Luna','Milo','Zoe','Leo','Aria',
  'Kai','Nova','Axel','Iris','Max','Nora',
  'Rex','Vera','Finn','Maya',
];

function dicebearUrl(seed: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
}

function randomSeeds(count: number): string[] {
  return Array.from({ length: count }, () =>
    Math.random().toString(36).slice(2, 10)
  );
}

function ProfileTab({ profile, onProfileChange }: { profile: Profile; onProfileChange: (p: Profile) => void }) {
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [cropFile, setCropFile]     = useState<File | null>(null);
  const [avatarSeeds, setAvatarSeeds] = useState<string[]>(INITIAL_AVATAR_SEEDS);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  async function handleSelectPreset(seed: string) {
    const url = dicebearUrl(seed);
    await supabase.from('profiles').update({ avatar_url: url }).eq('id', profile.id);
    onProfileChange({ ...profile, avatar_url: url });
  }

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
            {profile.plan === 'pro' && (
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
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          {profile.plan === 'pro' ? (
            <>
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
            </>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 w-full">
              <span className="text-amber-500 text-lg">🔒</span>
              <div>
                <p className="text-xs font-semibold text-amber-700">Foto de perfil — PRO</p>
                <p className="text-xs text-amber-600">Faça upgrade para usar uma foto personalizada.</p>
              </div>
            </div>
          )}
        </div>

        {/* Preset avatar picker — available to all plans */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#555555]">Escolher avatar</span>
            <button
              type="button"
              onClick={() => setAvatarSeeds(randomSeeds(16))}
              className="flex items-center gap-1 text-xs text-[#0B76A0] hover:underline"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Gerar novos
            </button>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {avatarSeeds.map(seed => {
              const url = dicebearUrl(seed);
              const selected = profile.avatar_url === url;
              return (
                <button
                  key={seed}
                  type="button"
                  title={seed}
                  onClick={() => handleSelectPreset(seed)}
                  className={`rounded-full overflow-hidden transition-all focus:outline-none ${
                    selected
                      ? 'ring-2 ring-[#0B76A0] ring-offset-2 scale-110'
                      : 'ring-1 ring-black/10 hover:scale-110 hover:ring-[#0B76A0]/50'
                  }`}
                >
                  <img
                    src={url}
                    alt={seed}
                    className="w-full h-full object-cover bg-[#f0f4f8]"
                    draggable={false}
                  />
                </button>
              );
            })}
          </div>
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
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#555555]">Bio</span>
            <span className={`text-[11px] tabular-nums ${(profile.bio?.length ?? 0) >= 80 ? 'text-red-400 font-semibold' : 'text-[#BFBFBF]'}`}>
              {profile.bio?.length ?? 0}/80
            </span>
          </div>
          <textarea
            className="px-3 py-2 text-base md:text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0] resize-none"
            rows={2}
            maxLength={80}
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
