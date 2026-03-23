import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { THEMES } from '../themes';
import { invalidateThemeConfigCache } from '../lib/themeConfig';
import { fetchCustomThemes, invalidateCustomThemeCache, type CustomTheme } from '../lib/customThemes';
import { FONT_OPTIONS, BUTTON_STYLE_OPTIONS } from '../types';
import { Loader2, Users, ShieldCheck, ArrowLeft, ToggleLeft, ToggleRight, Crown, Plus, Trash2, Image, Video } from 'lucide-react';
import logo from '../assets/images/logo.png';

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
}

const EMPTY_FORM = {
  name: '', description: '',
  text_color: '#ffffff', button_color: 'rgba(255,255,255,0.15)',
  button_text_color: '#ffffff', button_style: 'rounded',
  font_family: 'Inter', preview_color: '#0a0a0a', is_pro: false,
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

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
        .select('id, is_pro')
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

  async function handleCreateTheme() {
    if (!mediaFile || !form.name.trim()) return;
    setUploading(true);
    setUploadError(null);
    try {
      const ext = mediaFile.name.split('.').pop();
      const id = `custom_${Date.now()}`;
      const path = `${id}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('theme-media')
        .upload(path, mediaFile, { upsert: true, contentType: mediaFile.type });
      if (upErr) throw upErr;
      const { data: urlData } = supabase.storage.from('theme-media').getPublicUrl(path);
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
        is_pro: form.is_pro,
      });
      if (dbErr) throw dbErr;
      invalidateCustomThemeCache();
      const updated = await fetchCustomThemes();
      setCustomThemes(updated);
      setForm(EMPTY_FORM);
      setMediaFile(null);
      setMediaPreview(null);
      setShowForm(false);
    } catch (err: any) {
      setUploadError(err.message ?? 'Erro ao criar tema.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteCustomTheme(theme: CustomTheme) {
    if (!confirm(`Excluir o tema "${theme.name}"? Esta ação não pode ser desfeita.`)) return;
    setSaving(theme.id);
    // Extrair path do storage da URL pública
    const path = theme.media_url.split('/theme-media/')[1];
    if (path) await supabase.storage.from('theme-media').remove([path]);
    await supabase.from('custom_themes').delete().eq('id', theme.id);
    invalidateCustomThemeCache();
    setCustomThemes(prev => prev.filter(t => t.id !== theme.id));
    setSaving(null);
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalUsers = profiles.length;
  const proUsers   = profiles.filter(p => p.plan === 'pro').length;
  const freeUsers  = totalUsers - proUsers;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0B76A0]" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="bg-white border-b border-[#D9D9D9] px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-[#f5f5f5] rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#555555]" />
        </button>
        <img src={logo} alt="linqu.es" className="h-8 w-auto" />
        <div className="flex items-center gap-2 ml-2">
          <ShieldCheck className="w-4 h-4 text-[#0B76A0]" />
          <span className="text-sm font-semibold text-[#000000]">Painel Admin</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total de usuários', value: totalUsers, icon: Users, color: 'text-[#0B76A0]', bg: 'bg-[#e8f4f8]' },
            { label: 'Plano PRO',         value: proUsers,   icon: Crown,  color: 'text-amber-600', bg: 'bg-amber-50' },
            { label: 'Plano Free',        value: freeUsers,  icon: Users,  color: 'text-[#555555]', bg: 'bg-[#f5f5f5]' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-[#D9D9D9] p-5 shadow-sm">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-[#000000]">{stat.value}</p>
              <p className="text-xs text-[#BFBFBF] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-[#ebebeb] rounded-xl p-1">
          {(['users', 'themes'] as const).map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === t ? 'bg-white shadow text-[#000000]' : 'text-[#BFBFBF] hover:text-[#555555]'
              }`}
            >
              {t === 'users' ? 'Usuários' : 'Temas'}
            </button>
          ))}
        </div>

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f5f5] border-b border-[#D9D9D9]">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#BFBFBF] uppercase tracking-wider">Usuário</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#BFBFBF] uppercase tracking-wider">Links</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#BFBFBF] uppercase tracking-wider">Criado em</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#BFBFBF] uppercase tracking-wider">Plano</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9]">
                {profiles.map(p => (
                  <tr key={p.id} className="hover:bg-[#f5f5f5] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-[#000000]">{p.display_name || p.username}</p>
                          <p className="text-xs text-[#BFBFBF]">@{p.username}</p>
                        </div>
                        {p.role === 'admin' && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-[#0B76A0] text-white leading-tight">ADMIN</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[#555555]">{p.link_count}</td>
                    <td className="px-4 py-3 text-[#BFBFBF]">
                      {new Date(p.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => togglePlan(p)}
                        disabled={saving === p.id || p.role === 'admin'}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                        style={{
                          background: p.plan === 'pro' ? '#fef3c7' : '#f5f5f5',
                          color: p.plan === 'pro' ? '#92400e' : '#555555',
                        }}
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
            <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#D9D9D9] bg-[#f5f5f5]">
                <span className="text-xs font-semibold text-[#BFBFBF] uppercase tracking-wider">Temas personalizados</span>
                <button
                  onClick={() => { setShowForm(v => !v); setUploadError(null); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B76A0] text-white text-xs font-medium rounded-lg hover:bg-[#095f7d] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Criar tema
                </button>
              </div>

              {/* Formulário de criação */}
              {showForm && (
                <div className="p-5 border-b border-[#D9D9D9] space-y-4 bg-[#fafafa]">
                  {/* Upload de mídia */}
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-[#555]">Imagem ou vídeo de fundo</span>
                    <input
                      ref={mediaInputRef}
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleMediaPick}
                    />
                    {mediaPreview ? (
                      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-[#D9D9D9]">
                        {mediaType === 'video'
                          ? <video src={mediaPreview} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                          : <img src={mediaPreview} className="w-full h-full object-cover" />
                        }
                        <div className="absolute top-2 right-2 flex gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-semibold flex items-center gap-1">
                            {mediaType === 'video' ? <Video className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                            {mediaType === 'video' ? 'Vídeo' : 'Imagem'}
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
                        className="w-full h-24 border-2 border-dashed border-[#D9D9D9] rounded-xl text-sm text-[#888] hover:border-[#0B76A0] hover:text-[#0B76A0] transition-colors flex flex-col items-center justify-center gap-1"
                      >
                        <span className="flex gap-3 text-xl">🖼️ 🎬</span>
                        <span>Clique para selecionar imagem ou vídeo</span>
                      </button>
                    )}
                  </div>

                  {/* Nome e descrição */}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-[#555]">Nome *</span>
                      <input
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Ex: Praia"
                        className="px-3 py-2 text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0]"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-[#555]">Descrição</span>
                      <input
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Breve descrição"
                        className="px-3 py-2 text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0]"
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
                        <span className="text-[10px] font-medium text-[#555] text-center">{label}</span>
                        <input
                          type="color"
                          value={form[key].startsWith('rgba') ? '#ffffff' : form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-10 h-10 rounded-lg border border-[#D9D9D9] cursor-pointer p-0.5"
                        />
                      </label>
                    ))}
                  </div>

                  {/* Estilo do botão e fonte */}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-[#555]">Estilo do botão</span>
                      <select
                        value={form.button_style}
                        onChange={e => setForm(f => ({ ...f, button_style: e.target.value }))}
                        className="px-3 py-2 text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0]"
                      >
                        {BUTTON_STYLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-[#555]">Fonte</span>
                      <select
                        value={form.font_family}
                        onChange={e => setForm(f => ({ ...f, font_family: e.target.value }))}
                        className="px-3 py-2 text-sm border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B76A0]"
                      >
                        {FONT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </label>
                  </div>

                  {/* PRO toggle */}
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={form.is_pro}
                      onChange={e => setForm(f => ({ ...f, is_pro: e.target.checked }))}
                      className="w-4 h-4 accent-[#0B76A0]"
                    />
                    <span className="text-sm text-[#555]">Tema exclusivo PRO</span>
                  </label>

                  {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}

                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setMediaFile(null); setMediaPreview(null); }}
                      className="flex-1 py-2.5 border border-[#D9D9D9] rounded-xl text-sm text-[#555] hover:bg-[#f5f5f5] transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateTheme}
                      disabled={uploading || !mediaFile || !form.name.trim()}
                      className="flex-1 py-2.5 bg-[#0B76A0] text-white text-sm font-medium rounded-xl hover:bg-[#095f7d] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {uploading ? 'Enviando…' : 'Criar tema'}
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de temas custom */}
              {customThemes.length === 0 && !showForm ? (
                <p className="px-4 py-6 text-sm text-[#BFBFBF] text-center">Nenhum tema personalizado criado ainda.</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-[#D9D9D9]">
                    {customThemes.map(theme => (
                      <tr key={theme.id} className="hover:bg-[#f5f5f5] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-[#D9D9D9]">
                              {theme.media_type === 'video'
                                ? <video src={theme.media_url} muted className="w-full h-full object-cover" />
                                : <img src={theme.media_url} className="w-full h-full object-cover" />
                              }
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-[#000000]">{theme.name}</p>
                                {theme.is_pro && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[9px] font-black">PRO</span>
                                )}
                                <span className="px-1.5 py-0.5 rounded-md bg-[#f0f0f0] text-[#888] text-[9px] font-medium uppercase">
                                  {theme.media_type === 'video' ? 'Vídeo' : 'Imagem'}
                                </span>
                              </div>
                              {theme.description && <p className="text-xs text-[#BFBFBF]">{theme.description}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteCustomTheme(theme)}
                            disabled={saving === theme.id}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {saving === theme.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* ── Temas do sistema ── */}
            <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#D9D9D9] bg-[#f5f5f5]">
                <span className="text-xs font-semibold text-[#BFBFBF] uppercase tracking-wider">Temas do sistema</span>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[#D9D9D9]">
                  {THEMES.map(theme => {
                    const config = themeConfigs.find(t => t.id === theme.id);
                    const isPro = config?.is_pro ?? false;
                    return (
                      <tr key={theme.id} className="hover:bg-[#f5f5f5] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex-shrink-0" style={theme.previewStyle as React.CSSProperties} />
                            <div>
                              <p className="font-medium text-[#000000]">{theme.name}</p>
                              <p className="text-xs text-[#BFBFBF]">{theme.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => toggleThemePro(theme.id, isPro)}
                            disabled={saving === theme.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                            style={{
                              background: isPro ? '#fef3c7' : '#f5f5f5',
                              color: isPro ? '#92400e' : '#555555',
                            }}
                          >
                            {saving === theme.id
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : isPro ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />
                            }
                            {isPro ? 'PRO' : 'Grátis'}
                          </button>
                        </td>
                      </tr>
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
