import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { loadGoogleFont } from '../lib/fonts';
import { getTheme } from '../themes';
import { ICON_MAP, getButtonRadius, STATUS_TAGS, FONT_OPTIONS } from '../types';
import ThemeBackground from '../themes/ThemeBackground';
import { fetchCustomThemes, type CustomTheme } from '../lib/customThemes';
import { ExternalLink, AlertCircle } from 'lucide-react';
import type { Profile } from '../types';
import WhatsappFloatingButton from './WhatsappFloatingButton';

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [customTheme, setCustomTheme] = useState<CustomTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*, links(*)')
        .eq('username', username)
        .maybeSingle();

      if (err || !data) {
        setError('Perfil não encontrado');
      } else {
        const sorted: Profile = {
          ...data,
          theme_id: data.theme_id ?? 'default',
          links: (data.links ?? [])
            .filter((l: any) => l.is_active)
            .sort((a: any, b: any) => a.sort_order - b.sort_order),
        };
        setProfile(sorted);
        if (data.font_family) loadGoogleFont(data.font_family);
        if (data.title_font) loadGoogleFont(data.title_font);
        if (data.subtitle_font) loadGoogleFont(data.subtitle_font);
        if (data.button_font) loadGoogleFont(data.button_font);
        // Carregar tema custom se aplicável
        if (data.theme_id?.startsWith('custom_')) {
          const customs = await fetchCustomThemes();
          const ct = customs.find(t => t.id === data.theme_id) ?? null;
          setCustomTheme(ct);
        }
      }
      setLoading(false);
    }
    fetchProfile();
  }, [username]);

  function handleLinkClick(linkId: number) {
    supabase.rpc('increment_link_clicks', { link_id: linkId });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-slate-200 rounded-full" />
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-48 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Perfil não encontrado</h1>
        <p className="text-slate-600">O usuário @{username} não existe.</p>
      </div>
    );
  }

  const theme = getTheme(profile.theme_id);
  const btnRadius = getButtonRadius(profile.button_style);
  const btnBorderWidth = parseInt(profile.button_border_width ?? '0');
  const btnBorderStyle = btnBorderWidth > 0
    ? { border: `${btnBorderWidth}px solid ${profile.button_border_color ?? profile.button_text_color}` }
    : {};

  return (
    <div
      className="min-h-screen relative overflow-hidden flex flex-col items-center py-10 sm:py-16 px-4"
      style={{
        backgroundColor: profile.bg_color,
        fontFamily: `'${profile.font_family}', sans-serif`,
      }}
    >
      {/* Background image — centralizada na coluna de conteúdo no desktop */}
      {profile.bg_image_url && (
        <>
          {/* Mobile: imagem cobre tudo */}
          <div
            className="absolute inset-0 sm:hidden"
            style={{
              backgroundImage: `url(${profile.bg_image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: profile.bg_position ?? 'center',
            }}
          />
          {/* Desktop: imagem centralizada com largura limitada + degradê nas laterais */}
          <div className="absolute inset-0 hidden sm:flex items-stretch justify-center">
            <div
              className="w-full max-w-[580px] flex-shrink-0 my-4 rounded-[2.5rem] overflow-hidden shadow-2xl"
              style={{
                backgroundImage: `url(${profile.bg_image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: profile.bg_position ?? 'center',
              }}
            />
          </div>
          {/* Gradientes laterais — só desktop */}
          <div
            className="absolute inset-y-0 left-0 hidden sm:block pointer-events-none"
            style={{
              width: 'calc((100% - 580px) / 2 + 60px)',
              background: `linear-gradient(to right, ${profile.bg_color} 50%, transparent 100%)`,
            }}
          />
          <div
            className="absolute inset-y-0 right-0 hidden sm:block pointer-events-none"
            style={{
              width: 'calc((100% - 580px) / 2 + 60px)',
              background: `linear-gradient(to left, ${profile.bg_color} 50%, transparent 100%)`,
            }}
          />
        </>
      )}

      {/* Video background — desktop-aware layout (mirrors bg_image_url pattern) */}
      {customTheme?.media_type === 'video' && (
        <>
          {/* Mobile: video covers the full page */}
          <video
            src={customTheme.media_url}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            poster={customTheme.thumbnail_url}
            className="absolute inset-0 sm:hidden w-full h-full object-cover pointer-events-none"
            style={{ zIndex: 0 }}
          />
          {/* Desktop: video constrained in centred column */}
          <div className="absolute inset-0 hidden sm:flex items-stretch justify-center" style={{ zIndex: 0 }}>
            <div className="w-full max-w-[580px] flex-shrink-0 my-4 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <video
                src={customTheme.media_url}
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                poster={customTheme.thumbnail_url}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Desktop gradient fades — left and right */}
          <div
            className="absolute inset-y-0 left-0 hidden sm:block pointer-events-none"
            style={{
              width: 'calc((100% - 580px) / 2 + 60px)',
              background: `linear-gradient(to right, ${profile.bg_color} 50%, transparent 100%)`,
              zIndex: 2,
            }}
          />
          <div
            className="absolute inset-y-0 right-0 hidden sm:block pointer-events-none"
            style={{
              width: 'calc((100% - 580px) / 2 + 60px)',
              background: `linear-gradient(to left, ${profile.bg_color} 50%, transparent 100%)`,
              zIndex: 2,
            }}
          />
        </>
      )}

      {/* Theme background layer */}
      <ThemeBackground
        Background={customTheme ? undefined : theme.Background}
        mediaUrl={customTheme?.media_type !== 'video' ? customTheme?.media_url : undefined}
        mediaType={customTheme?.media_type}
        thumbnailUrl={customTheme?.thumbnail_url}
        themeId={profile.theme_id}
      />

      {/* Status tag — posições fixas */}
      {profile.status_tag_enabled && profile.status_tag && (() => {
        const tag = STATUS_TAGS.find(t => t.id === profile.status_tag);
        const pos = profile.status_tag_position ?? 'above-left';
        if (!tag || !pos.startsWith('fixed')) return null;
        const posClass = pos === 'fixed-tr' ? 'fixed top-4 right-4 z-50' : 'fixed top-4 left-4 z-50';
        const color = profile.status_tag_color ?? tag.color;
        const bg    = profile.status_tag_bg    ?? tag.bg;
        const size  = profile.status_tag_size  ?? 'md';
        const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-[10px] gap-1' : size === 'lg' ? 'px-4 py-2 text-sm gap-2' : 'px-3 py-1.5 text-xs gap-1.5';
        const dotClass  = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';
        const icon  = profile.status_tag_icon ?? 'dot';
        const font  = profile.status_tag_font;
        return (
          <motion.div initial={{ opacity: 0, x: pos === 'fixed-tr' ? 12 : -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 24 }} className={posClass}>
            <span className={`inline-flex items-center font-semibold rounded-full backdrop-blur-md shadow-lg ${sizeClass}`}
              style={{ color, backgroundColor: bg, border: `1px solid ${color}50`,
                fontFamily: font ? `'${font}', sans-serif` : undefined }}>
              {icon === 'dot'
                ? <span className={`rounded-full flex-shrink-0 tag-dot-pulse ${dotClass}`} style={{ backgroundColor: color }} />
                : <span className="leading-none">{icon}</span>}
              {profile.status_tag_custom_label?.trim() || tag.label}
            </span>
          </motion.div>
        );
      })()}

      {/* Content layer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-[580px] flex flex-col items-center"
        style={{ zIndex: 1 }}
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <img
            src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
            alt={profile.display_name}
            className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg mb-4 object-cover"
            referrerPolicy="no-referrer"
          />
          <h1
            className="text-xl font-bold mb-1"
            style={{
              color: profile.title_color || profile.text_color,
              fontFamily: profile.title_font ? `'${profile.title_font}', sans-serif` : undefined,
            }}
          >
            {profile.display_name}
          </h1>
          {profile.bio && (
            <p
              className="text-sm max-w-[300px] opacity-75 line-clamp-2"
              style={{
                color: profile.subtitle_color || profile.text_color,
                fontFamily: profile.subtitle_font ? `'${profile.subtitle_font}', sans-serif` : undefined,
              }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Status tag — acima dos links */}
        {profile.status_tag_enabled && profile.status_tag && (() => {
          const tag = STATUS_TAGS.find(t => t.id === profile.status_tag);
          const pos = profile.status_tag_position ?? 'above-left';
          if (!tag || !pos.startsWith('above')) return null;
          const color = profile.status_tag_color ?? tag.color;
          const bg    = profile.status_tag_bg    ?? tag.bg;
          const size  = profile.status_tag_size  ?? 'md';
          const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-[10px] gap-1' : size === 'lg' ? 'px-4 py-2 text-sm gap-2' : 'px-3 py-1.5 text-xs gap-1.5';
          const dotClass  = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2';
          const icon  = profile.status_tag_icon ?? 'dot';
          const font  = profile.status_tag_font;
          const justify = pos === 'above-center' ? 'justify-center' : pos === 'above-right' ? 'justify-end' : 'justify-start';
          return (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 24 }}
              className={`w-full sm:w-[420px] flex ${justify} mb-2`}>
              <span className={`tag-fade-in inline-flex items-center font-semibold rounded-full backdrop-blur-sm shadow-sm ${sizeClass}`}
                style={{ color, backgroundColor: bg, border: `1px solid ${color}40`,
                  fontFamily: font ? `'${font}', sans-serif` : undefined }}>
                {icon === 'dot'
                  ? <span className={`rounded-full flex-shrink-0 tag-dot-pulse ${dotClass}`} style={{ backgroundColor: color }} />
                  : <span className="leading-none">{icon}</span>}
                {profile.status_tag_custom_label?.trim() || tag.label}
              </span>
            </motion.div>
          );
        })()}

        <div className="w-full sm:w-[420px] flex flex-col gap-3">
          {profile.links.map((link, index) => {
            const Icon = ICON_MAP[link.icon_type] ?? ExternalLink;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between px-4 py-3 shadow-sm transition-all group backdrop-blur-sm"
                style={{
                  minHeight: '50px',
                  backgroundColor: profile.button_color,
                  color: profile.button_text_color,
                  borderRadius: btnRadius,
                  ...btnBorderStyle,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className="font-medium"
                    style={{ fontFamily: profile.button_font ? `'${profile.button_font}', sans-serif` : undefined }}
                  >
                    {link.title}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 opacity-20 group-hover:opacity-50 transition-opacity flex-shrink-0" />
              </motion.a>
            );
          })}
        </div>

        <div className="mt-16 text-center" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <a
            href="/entrar"
            className="inline-block opacity-30 hover:opacity-70 transition-opacity"
          >
            <img src="/logo.png" alt="linqu.es" style={{ height: 35, width: 'auto' }} />
          </a>
        </div>
      </motion.div>

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
