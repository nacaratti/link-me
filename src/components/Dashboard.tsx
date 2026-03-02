import React, { useEffect, useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { Plus, Trash2, GripVertical, ExternalLink, Settings, User, Layout, Link as LinkIcon, Loader2 } from 'lucide-react';
import { ICON_MAP, type Profile, type Link } from '../types';

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [newLink, setNewLink] = useState({ title: '', url: '', icon_type: 'link' });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchMe();
  }, []);

  async function fetchMe() {
    try {
      const res = await fetch('/api/me');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setIsAdding(true);
    try {
      await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newLink, profile_id: profile.id }),
      });
      setNewLink({ title: '', url: '', icon_type: 'link' });
      fetchMe();
    } finally {
      setIsAdding(false);
    }
  }

  async function handleDeleteLink(id: number) {
    if (!confirm('Are you sure?')) return;
    await fetch(`/api/links/${id}`, { method: 'DELETE' });
    fetchMe();
  }

  async function handleReorder(newLinks: Link[]) {
    setProfile(prev => prev ? { ...prev, links: newLinks } : null);
    const updates = newLinks.map((l, i) => ({ id: l.id, sort_order: i }));
    await fetch('/api/links/reorder', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ links: updates }),
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile) return <div>Error loading profile</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
          <span className="font-bold text-slate-900">LinkHub</span>
        </div>
        
        <nav className="flex-1 space-y-1">
          <NavItem icon={LinkIcon} label="Links" active />
          <NavItem icon={Layout} label="Appearance" />
          <NavItem icon={Settings} label="Settings" />
        </nav>

        <div className="mt-auto p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-3">
            <img src={profile.avatar_url} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{profile.display_name}</p>
              <p className="text-xs text-slate-500 truncate">@{profile.username}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Links</h1>
              <p className="text-slate-500">Manage your public profile links</p>
            </div>
            <a 
              href={`/${profile.username}`} 
              target="_blank" 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Public Page
            </a>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Link Editor */}
            <div className="lg:col-span-2 space-y-6">
              {/* Add New Link Form */}
              <form onSubmit={handleAddLink} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Add New Link</h3>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Title (e.g. My Portfolio)" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newLink.title}
                    onChange={e => setNewLink(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                  <input 
                    type="url" 
                    placeholder="URL (https://...)" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newLink.url}
                    onChange={e => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                    required
                  />
                  <div className="flex items-center gap-4">
                    <select 
                      className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={newLink.icon_type}
                      onChange={e => setNewLink(prev => ({ ...prev, icon_type: e.target.value }))}
                    >
                      <option value="link">Default Link</option>
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="globe">Website</option>
                    </select>
                    <button 
                      type="submit" 
                      disabled={isAdding}
                      className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Add
                    </button>
                  </div>
                </div>
              </form>

              {/* Links List */}
              <Reorder.Group axis="y" values={profile.links} onReorder={handleReorder} className="space-y-3">
                {profile.links.map(link => (
                  <Reorder.Item 
                    key={link.id} 
                    value={link}
                    className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4 group"
                  >
                    <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 truncate">{link.title}</h4>
                      <p className="text-xs text-slate-500 truncate">{link.url}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </div>

            {/* Preview (Mobile Mockup) */}
            <div className="hidden lg:block">
              <div className="sticky top-10">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider text-center">Live Preview</h3>
                <div className="w-[320px] h-[640px] bg-white rounded-[3rem] border-[8px] border-slate-900 shadow-2xl mx-auto overflow-hidden relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-10" />
                  <iframe 
                    src={`/${profile.username}`} 
                    className="w-full h-full pointer-events-none"
                    title="Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <button className={clsx(
      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
      active ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    )}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
