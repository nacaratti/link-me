import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { THEMES } from '../themes';
import { invalidateThemeConfigCache } from '../lib/themeConfig';
import { fetchCustomThemes, invalidateCustomThemeCache, type CustomTheme } from '../lib/customThemes';
import { FONT_OPTIONS, BUTTON_STYLE_OPTIONS } from '../types';
import { Loader2, Users, ShieldCheck, ArrowLeft, ToggleLeft, ToggleRight, Crown, Plus, Trash2, Image, Video, Pencil, X, Check } from 'lucide-react';
import AdaptiveLogo from './AdaptiveLogo';

interface AdminProfile {
  id: string;
  username: string;
  display_name: string;
  plan: 'free' | 'pro';
  role: 'user' | 'admin';
  created_at: string;
  link_count: number;
}

interface ThemeConfigRow {
  id: string;
  is_pro: boolean;
  preview_url?: string;
}

const EMPTY_FORM = {
  name: '', description: '',
  text_color: '#ffffff', button_color: 'rgba(255,255,255,0.15)',
  button_text_color: '#ffffff', button_style: 'rounded',
  font_family: 'Inter', preview_color: '#0a0a0a',
};

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [themeConfigs, setThemeConfigs] = useState<ThemeConfigRow[]>([]);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'themes'>('users');
  const [saving, setSaving] = useState<string | null>(null);

  // ── Criar tema custom ──────────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // ── Editar tema custom ─────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editThumbFile, setEditThumbFile] = useState<File | null>(null);
  const [editThumbPreview, setEditThumbPreview] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const editThumbInputRef = useRef<HTMLInputElement>(null);

  // ── Editar preview de tema do sistema ─────────────────────────────────────
  const [editPreviewId, setEditPreviewId] = useState<string | null>(null);
  const [editPreviewFile, setEditPreviewFile] = useState<File | null>(null);
  const [editPreviewFilePreview, setEditPreviewFilePreview] = useState<string | null>(null);
  const [editPreviewSaving, setEditPreviewSaving] = useState(false);
  const [editPreviewError, setEditPreviewError] = useState<string | null>(null);
  const editPreviewInputRef = useRef<HTMLInputElement>(null);

  // ── Verificação de autorização (server-side via RLS) ─────────────────────
  const checkAndLoad = useCallback(async () => {
    if (!user) { navigate('/entrar', { replace: true }); return; }

    // Verificar role no banco (não confia no estado local)
    const { data: me } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!me || me.role !== 'admin') {
      navigate('/dashboard', { replace: true });
      return;
    }
    setAuthorized(true);

    // Carregar dados
    const [{ data: profileData }, { data: themeData }] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, username, display_name, plan, role, created_at, links(count)')
        .order('created_at', { ascending: false }),
      supabase
        .from('theme_config')
        .select('id, is_pro, preview_url')
        .order('id'),
    ]);

    if (profileData) {
      setProfiles(profileData.map((p: any) => ({
        ...p,
        link_count: p.links?.[0]?.count ?? 0,
      })));
    }
    if (themeData) setThemeConfigs(themeData);
    const custom = await fetchCustomThemes();
    setCustomThemes(custom);
    setLoading(false);
  }, [user, navigate]);

  useEffect(() => { checkAndLoad(); }, [checkAndLoad]);

  // ── Alterar plano de usuário ──────────────────────────────────────────────
  async function togglePlan(profile: AdminProfile) {
    const newPlan = profile.plan === 'free' ? 'pro' : 'free';
    setSaving(profile.id);
    const { error } = await supabase
      .from('profiles')
      .update({ plan: newPlan })
      .eq('id', profile.id);
    if (!error) {
      setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, plan: newPlan } : p));
    }
    setSaving(null);
  }

  // ── Alterar is_pro de tema ────────────────────────────────────────────────
  async function toggleThemePro(themeId: string, current: boolean) {
    setSaving(themeId);
    const { error } = await supabase
      .from('theme_config')
      .upsert({ id: themeId, is_pro: !current, updated_at: new Date().toISOString() });
    if (!error) {
      setThemeConfigs(prev => prev.map(t => t.id === themeId ? { ...t, is_pro: !current } : t));
      invalidateThemeConfigCache();
    }
    setSaving(null);
  }

  // ── Upload de mídia para tema custom ──────────────────────────────────────
  function handleMediaPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'image');
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
    if (mediaInputRef.current) mediaInputRef.current.value = '';
  }

  function handleThumbPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbFile(file);
    setThumbPreview(URL.createObjectURL(file));
    if (thumbInputRef.current) thumbInputRef.current.value = '';
  }

  async function handleCreateTheme() {
    if (!form.name.trim() || !mediaFile) return;

    setUploading(true);
    setUploadError(null);
    const MAX_MB = 50;
    if (mediaFile.size > MAX_MB * 1024 * 1024) {
      setUploadError(`Arquivo muito grande (${(mediaFile.size / 1024 / 1024).toFixed(0)} MB). Máximo: ${MAX_MB} MB. Comprima o vídeo antes de enviar.`);
      setUploading(false);
      return;
    }
    const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> =>
      Promise.race([
        promise,
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout ao fazer upload (${label}). Verifique as políticas do bucket theme-media no Supabase.`)), ms)
        ),
      ]);

    try {
      const id = `custom_${Date.now()}`;

      // Upload do vídeo/imagem principal
      const ext = mediaFile.name.split('.').pop();
      const path = `${id}.${ext}`;
      const { error: upErr } = await withTimeout(
        supabase.storage.from('theme-media').upload(path, mediaFile, { upsert: true, contentType: mediaFile.type }),
        30_000,
        'mídia principal'
      );
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('theme-media').getPublicUrl(path);

      // Upload da thumbnail (opcional)
      let thumbnailUrl: string | undefined;
      if (thumbFile) {
        const thumbExt = thumbFile.name.split('.').pop();
        const thumbPath = `${id}_thumb.${thumbExt}`;
        const { error: thumbErr } = await withTimeout(
          supabase.storage.from('theme-media').upload(thumbPath, thumbFile, { upsert: true, contentType: thumbFile.type }),
          15_000,
          'thumbnail'
        );
        if (thumbErr) throw thumbErr;
        const { data: thumbUrlData } = supabase.storage.from('theme-media').getPublicUrl(thumbPath);
        thumbnailUrl = thumbUrlData.publicUrl;
      }

      const isPro = mediaType === 'video';

      const { error: dbErr } = await supabase.from('custom_themes').insert({
        id,
        name: form.name.trim(),
        description: form.description.trim(),
        media_url: urlData.publicUrl,
        media_type: mediaType,
        preview_color: form.preview_color,
        text_color: form.text_color,
        button_color: form.button_color,
        button_text_color: form.button_text_color,
        button_style: form.button_style,
        font_family: form.font_family,
        is_pro: isPro,
        thumbnail_url: thumbnailUrl,
      });
      if (dbErr) throw dbErr;
      invalidateCustomThemeCache();
      const updated = await fetchCustomThemes();
      setCustomThemes(updated);
      setForm(EMPTY_FORM);
      setMediaFile(null);
      setMediaPreview(null);
      setThumbFile(null);
      setThumbPreview(null);
      setShowForm(false);
    } catch (err: any) {
      const msg = typeof err?.message === 'string' && err.message ? err.message : JSON.stringify(err) || 'Erro ao criar tema.';
      setUploadError(msg);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteCustomTheme(theme: CustomTheme) {
    if (!confirm(`Excluir o tema "${theme.name}"? Esta ação não pode ser desfeita.`)) return;
    setSaving(theme.id);
    const pathsToRemove: string[] = [];
    const mediaPath = theme.media_url.split('/theme-media/')[1];
    if (mediaPath) pathsToRemove.push(mediaPath);
    const thumbPath = theme.thumbnail_url?.split('/theme-media/')[1];
    if (thumbPath) pathsToRemove.push(thumbPath);
    if (pathsToRemove.length > 0) await supabase.storage.from('theme-media').remove(pathsToRemove);
    await supabase.from('custom_themes').delete().eq('id', theme.id);
    invalidateCustomThemeCache();
    setCustomThemes(prev => prev.filter(t => t.id !== theme.id));
    setSaving(null);
  }

  function openEdit(theme: CustomTheme) {
    setEditingId(theme.id);
    setEditThumbFile(null);
    setEditThumbPreview(theme.thumbnail_url ?? null);
    setEditError(null);
  }

  function closeEdit() {
    setEditingId(null);
    setEditThumbFile(null);
    setEditThumbPreview(null);
    setEditError(null);
  }

  function handleEditThumbPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditThumbFile(file);
    setEditThumbPreview(URL.createObjectURL(file));
    if (editThumbInputRef.current) editThumbInputRef.current.value = '';
  }

  async function handleSaveEdit(theme: CustomTheme) {
    if (!editThumbFile) return;
    setEditSaving(true);
    setEditError(null);
    try {
      // Apagar thumbnail antiga do Storage (se for do nosso bucket)
      const oldThumbPath = theme.thumbnail_url?.split('/theme-media/')[1];
      if (oldThumbPath) await supabase.storage.from('theme-media').remove([oldThumbPath]);

      // Upload da nova thumbnail
      const ext = editThumbFile.name.split('.').pop();
      const thumbPath = `${theme.id}_thumb.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('theme-media')
        .upload(thumbPath, editThumbFile, { upsert: true, contentType: editThumbFile.type });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('theme-media').getPublicUrl(thumbPath);
      const newThumbUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: dbErr } = await supabase
        .from('custom_themes')
        .update({ thumbnail_url: newThumbUrl })
        .eq('id', theme.id);
      if (dbErr) throw dbErr;

      invalidateCustomThemeCache();
      setCustomThemes(prev => prev.map(t =>
        t.id === theme.id ? { ...t, thumbnail_url: newThumbUrl } : t
      ));
      closeEdit();
    } catch (err: any) {
      setEditError(err.message ?? 'Erro ao salvar.');
    } finally {
      setEditSaving(false);
    }
  }

  // ── Editar preview de tema do sistema ─────────────────────────────────────
  function openEditPreview(themeId: string, currentUrl?: string) {
    setEditPreviewId(themeId);
    setEditPreviewFile(null);
    setEditPreviewFilePreview(currentUrl ?? null);
    setEditPreviewError(null);
  }

  function closeEditPreview() {
    setEditPreviewId(null);
    setEditPreviewFile(null);
    setEditPreviewFilePreview(null);
    setEditPreviewError(null);
  }

  function handleEditPreviewPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditPreviewFile(file);
    setEditPreviewFilePreview(URL.createObjectURL(file));
    if (editPreviewInputRef.current) editPreviewInputRef.current.value = '';
  }

  async function handleSaveThemePreview(themeId: string, currentPreviewUrl?: string) {
    if (!editPreviewFile) return;
    setEditPreviewSaving(true);
    setEditPreviewError(null);
    try {
      // Remove previous preview from storage if it was ours
      const oldPath = currentPreviewUrl?.split('/theme-media/')[1];
      if (oldPath) await supabase.storage.from('theme-media').remove([oldPath]);

      // Upload new preview
      const ext = editPreviewFile.name.split('.').pop();
      const path = `${themeId}_preview.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('theme-media')
        .upload(path, editPreviewFile, { upsert: true, contentType: editPreviewFile.type });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('theme-media').getPublicUrl(path);
      const newUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: dbErr } = await supabase
        .from('theme_config')
        .upsert({ id: themeId, preview_url: newUrl, updated_at: new Date().toISOString() });
      if (dbErr) throw dbErr;

      invalidateThemeConfigCache();
      setThemeConfigs(prev => prev.map(t =>
        t.id === themeId ? { ...t, preview_url: newUrl } : t
      ));
      closeEditPreview();
    } catch (err: any) {
      setEditPreviewError(err.message ?? 'Erro ao salvar.');
    } finally {
      setEditPreviewSaving(false);
    }
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalUsers = profiles.length;
  const proUsers   = profiles.filter(p => p.plan === 'pro').length;
  const freeUsers  = totalUsers - proUsers;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-muted rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <AdaptiveLogo className="h-8 w-auto" />
        <div className="flex items-center gap-2 ml-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Painel Admin</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total de usuários', value: totalUsers, icon: Users, color: 'text-primary', bg: 'bg-accent' },
            { label: 'Plano PRO',         value: proUsers,   icon: Crown,  color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Plano Free',        value: freeUsers,  icon: Users,  color: 'text-muted-foreground', bg: 'bg-muted' },
          ].map(stat => (
            <div key={stat.label} className="bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1">
          {(['users', 'themes'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === t ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-muted-foreground'
              }`}
            >
              {t === 'users' ? 'Usuários' : 'Temas'}
            </button>
          ))}
        </div>

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usuário</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Links</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Criado em</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plano</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {profiles.map(p => (
                  <tr key={p.id} className="hover:bg-muted transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-foreground">{p.display_name || p.username}</p>
                          <p className="text-xs text-muted-foreground">@{p.username}</p>
                        </div>
                        {p.role === 'admin' && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-primary text-white leading-tight">ADMIN</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.link_count}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => togglePlan(p)}
                        disabled={saving === p.id || p.role === 'admin'}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${p.plan === 'pro' ? 'bg-amber-100 text-amber-800' : 'bg-muted text-muted-foreground'}`}
                      >
                        {saving === p.id
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : p.plan === 'pro' ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />
                        }
                        {p.plan === 'pro' ? 'PRO' : 'Free'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Themes tab */}
        {activeTab === 'themes' && (
          <div className="space-y-4">

            {/* ── Temas personalizados ── */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Temas personalizados</span>
                <button
                  onClick={() => { setShowForm(v => !v); setUploadError(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/85 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Criar tema
                </button>
              </div>

              {/* Formulário de criação */}
              {showForm && (
                <div className="p-5 border-b border-border space-y-4 bg-muted">
                  {/* Upload de mídia principal */}
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">Imagem ou vídeo de fundo *</span>
                    <input
                      ref={mediaInputRef}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleMediaPick}
                    />
                    {mediaPreview ? (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border">
                        {mediaType === 'video'
                          ? <video src={mediaPreview} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                          : <img src={mediaPreview} className="w-full h-full object-cover" />
                        }
                        <div className="absolute top-2 right-2 flex gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold flex items-center gap-1">
                            {mediaType === 'video' ? <Video className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                            {mediaType === 'video' ? 'Vídeo · PRO' : 'Imagem · Grátis'}
                          </span>
                          <button
                            onClick={() => { setMediaFile(null); setMediaPreview(null); }}
                            className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] hover:bg-black/80"
                          >✕</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => mediaInputRef.current?.click()}
                        className="w-full h-24 border-2 border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors flex flex-col items-center justify-center gap-1"
                      >
                        <span className="flex gap-3 text-xl">🖼️ 🎬</span>
                        <span>Clique para selecionar imagem ou vídeo</span>
                      </button>
                    )}
                  </div>

                  {/* Upload de thumbnail (obrigatória para vídeo, opcional para imagem) */}
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Thumbnail {mediaType === 'video' ? '(recomendada para vídeo)' : '(opcional)'}
                    </span>
                    <input
                      ref={thumbInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbPick}
                    />
                    {thumbPreview ? (
                      <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-border">
                        <img src={thumbPreview} className="w-full h-full object-cover" />
                        <button
                          onClick={() => { setThumbFile(null); setThumbPreview(null); }}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center hover:bg-black/80"
                        >✕</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => thumbInputRef.current?.click()}
                        className="w-32 h-20 border-2 border-dashed border-border rounded-xl text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors flex flex-col items-center justify-center gap-1"
                      >
                        <Image className="w-4 h-4" />
                        <span>Thumbnail</span>
                      </button>
                    )}
                    <p className="text-[10px] text-muted-foreground">Exibida na galeria de temas no lugar do vídeo</p>
                  </div>

                  {/* Nome e descrição */}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground">Nome *</span>
                      <input
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Ex: Praia"
                        className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0]"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground">Descrição</span>
                      <input
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Breve descrição"
                        className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0]"
                      />
                    </label>
                  </div>

                  {/* Cores */}
                  <div className="grid grid-cols-4 gap-3">
                    {([
                      { key: 'preview_color', label: 'Cor de preview' },
                      { key: 'text_color',    label: 'Texto' },
                      { key: 'button_color',  label: 'Botão fundo' },
                      { key: 'button_text_color', label: 'Botão texto' },
                    ] as const).map(({ key, label }) => (
                      <label key={key} className="flex flex-col gap-1 items-center">
                        <span className="text-[10px] font-medium text-muted-foreground text-center">{label}</span>
                        <input
                          type="color"
                          value={form[key].startsWith('rgba') ? '#ffffff' : form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5"
                        />
                      </label>
                    ))}
                  </div>

                  {/* Estilo do botão e fonte */}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground">Estilo do botão</span>
                      <select
                        value={form.button_style}
                        onChange={e => setForm(f => ({ ...f, button_style: e.target.value }))}
                        className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0]"
                      >
                        {BUTTON_STYLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground">Fonte</span>
                      <select
                        value={form.font_family}
                        onChange={e => setForm(f => ({ ...f, font_family: e.target.value }))}
                        className="px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0]"
                      >
                        {FONT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </label>
                  </div>

                  {/* PRO é determinado automaticamente pelo tipo de mídia */}
                  <p className="text-xs text-muted-foreground">
                    ℹ️ Vídeos são sempre PRO. Imagens são sempre Grátis.
                  </p>

                  {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setForm(EMPTY_FORM);
                        setMediaFile(null);
                        setMediaPreview(null);
                        setThumbFile(null);
                        setThumbPreview(null);
                      }}
                      className="flex-1 py-2.5 border border-border rounded-xl text-sm text-muted-foreground hover:bg-muted transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateTheme}
                      disabled={uploading || !mediaFile || !form.name.trim()}
                      className="flex-1 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/85 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {uploading ? 'Enviando…' : 'Criar tema'}
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de temas custom */}
              {customThemes.length === 0 && !showForm ? (
                <p className="px-4 py-6 text-sm text-muted-foreground text-center">Nenhum tema personalizado criado ainda.</p>
              ) : (
                <>
                <input
                  ref={editThumbInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleEditThumbPick}
                />
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-border">
                    {customThemes.map(theme => (
                      <React.Fragment key={theme.id}>
                        <tr className="hover:bg-muted transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                                {theme.media_type === 'video'
                                  ? theme.thumbnail_url
                                    ? <img src={theme.thumbnail_url} className="w-full h-full object-cover" />
                                    : <video src={theme.media_url} muted className="w-full h-full object-cover" />
                                  : <img src={theme.media_url} className="w-full h-full object-cover" />
                                }
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-foreground">{theme.name}</p>
                                  {theme.is_pro && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[9px] font-black">PRO</span>
                                  )}
                                  <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[9px] font-medium uppercase">
                                    {theme.media_type === 'video' ? 'Vídeo' : 'Imagem'}
                                  </span>
                                </div>
                                {theme.description && <p className="text-xs text-muted-foreground">{theme.description}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => editingId === theme.id ? closeEdit() : openEdit(theme)}
                                className={`p-2 rounded-lg transition-colors ${
                                  editingId === theme.id
                                    ? 'bg-accent text-primary'
                                    : 'text-muted-foreground hover:text-primary hover:bg-accent'
                                }`}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCustomTheme(theme)}
                                disabled={saving === theme.id}
                                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {saving === theme.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Painel de edição inline */}
                        {editingId === theme.id && (
                          <tr>
                            <td colSpan={2} className="px-4 py-4 bg-card border-t border-border">
                              <div className="flex items-start gap-4">
                                {/* Thumbnail atual / nova */}
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Thumbnail</span>
                                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-border flex-shrink-0">
                                    {editThumbPreview
                                      ? <img src={editThumbPreview} className="w-full h-full object-cover" />
                                      : <div className="w-full h-full flex items-center justify-center bg-muted">
                                          <Image className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    }
                                    {editThumbFile && (
                                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-white" />
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => editThumbInputRef.current?.click()}
                                    className="text-[10px] text-primary hover:underline whitespace-nowrap"
                                  >
                                    {editThumbPreview ? 'Trocar imagem' : 'Selecionar imagem'}
                                  </button>
                                </div>

                                {/* Ações */}
                                <div className="flex-1 flex flex-col justify-between gap-3 pt-5">
                                  {editError && (
                                    <p className="text-xs text-red-500">{editError}</p>
                                  )}
                                  {!editThumbFile && (
                                    <p className="text-xs text-muted-foreground">Selecione uma nova imagem de thumbnail para substituir a atual.</p>
                                  )}
                                  <div className="flex gap-2">
                                    <button
                                      onClick={closeEdit}
                                      className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-xs text-muted-foreground hover:bg-muted transition-colors"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      Cancelar
                                    </button>
                                    <button
                                      onClick={() => handleSaveEdit(theme)}
                                      disabled={editSaving || !editThumbFile}
                                      className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-medium rounded-xl hover:bg-primary/85 disabled:opacity-50 transition-colors"
                                    >
                                      {editSaving
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        : <Check className="w-3.5 h-3.5" />
                                      }
                                      {editSaving ? 'Salvando…' : 'Salvar thumbnail'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                </>
              )}
            </div>

            {/* ── Temas do sistema ── */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Temas do sistema</span>
              </div>
              <input
                ref={editPreviewInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleEditPreviewPick}
              />
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border">
                  {THEMES.map(theme => {
                    const config = themeConfigs.find(t => t.id === theme.id);
                    const isPro = config?.is_pro ?? false;
                    const previewUrl = config?.preview_url;
                    return (
                      <React.Fragment key={theme.id}>
                        <tr className="hover:bg-muted transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex-shrink-0 overflow-hidden border border-border">
                                {theme.thumbnail
                                  ? <img src={theme.thumbnail} className="w-full h-full object-cover" />
                                  : <div className="w-full h-full" style={theme.previewStyle as React.CSSProperties} />
                                }
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{theme.name}</p>
                                <p className="text-xs text-muted-foreground">{theme.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => editPreviewId === theme.id ? closeEditPreview() : openEditPreview(theme.id, previewUrl)}
                                className={`p-2 rounded-lg transition-colors ${
                                  editPreviewId === theme.id
                                    ? 'bg-accent text-primary'
                                    : 'text-muted-foreground hover:text-primary hover:bg-accent'
                                }`}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleThemePro(theme.id, isPro)}
                                disabled={saving === theme.id}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${isPro ? 'bg-amber-100 text-amber-800' : 'bg-muted text-muted-foreground'}`}
                              >
                                {saving === theme.id
                                  ? <Loader2 className="w-3 h-3 animate-spin" />
                                  : isPro ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />
                                }
                                {isPro ? 'PRO' : 'Grátis'}
                              </button>
                            </div>
                          </td>
                        </tr>

                        {editPreviewId === theme.id && (
                          <tr>
                            <td colSpan={2} className="px-4 py-4 bg-card border-t border-border">
                              <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center gap-2">
                                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Preview</span>
                                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-border flex-shrink-0">
                                    {editPreviewFilePreview
                                      ? <img src={editPreviewFilePreview} className="w-full h-full object-cover" />
                                      : <div className="w-full h-full" style={theme.previewStyle as React.CSSProperties} />
                                    }
                                    {editPreviewFile && (
                                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                        <Check className="w-2.5 h-2.5 text-white" />
                                      </div>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => editPreviewInputRef.current?.click()}
                                    className="text-[10px] text-primary hover:underline whitespace-nowrap"
                                  >
                                    {editPreviewFilePreview ? 'Trocar imagem' : 'Selecionar imagem'}
                                  </button>
                                </div>

                                <div className="flex-1 flex flex-col justify-between gap-3 pt-5">
                                  {editPreviewError && <p className="text-xs text-red-500">{editPreviewError}</p>}
                                  {!editPreviewFile && (
                                    <p className="text-xs text-muted-foreground">Selecione uma imagem para substituir o preview gradiente do tema.</p>
                                  )}
                                  <div className="flex gap-2">
                                    <button
                                      onClick={closeEditPreview}
                                      className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-xl text-xs text-muted-foreground hover:bg-muted transition-colors"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                      Cancelar
                                    </button>
                                    <button
                                      onClick={() => handleSaveThemePreview(theme.id, previewUrl)}
                                      disabled={editPreviewSaving || !editPreviewFile}
                                      className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-medium rounded-xl hover:bg-primary/85 disabled:opacity-50 transition-colors"
                                    >
                                      {editPreviewSaving
                                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        : <Check className="w-3.5 h-3.5" />
                                      }
                                      {editPreviewSaving ? 'Salvando…' : 'Salvar preview'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
