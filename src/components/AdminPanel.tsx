import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { THEMES } from '../themes';
import { invalidateThemeConfigCache } from '../lib/themeConfig';
import { Loader2, Users, ShieldCheck, ArrowLeft, ToggleLeft, ToggleRight, Crown } from 'lucide-react';
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

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [themeConfigs, setThemeConfigs] = useState<ThemeConfigRow[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'themes'>('users');
  const [saving, setSaving] = useState<string | null>(null);

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
          <div className="bg-white rounded-2xl border border-[#D9D9D9] shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f5f5] border-b border-[#D9D9D9]">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#BFBFBF] uppercase tracking-wider">Tema</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#BFBFBF] uppercase tracking-wider">Tipo</th>
                </tr>
              </thead>
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
                      <td className="px-4 py-3 text-center">
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
        )}
      </div>
    </div>
  );
}
