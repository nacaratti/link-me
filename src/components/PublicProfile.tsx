import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ICON_MAP, type Profile } from '../types';
import { ExternalLink, AlertCircle } from 'lucide-react';

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profiles/${username}`);
        if (!res.ok) throw new Error('Profile not found');
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

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
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Profile not found</h1>
        <p className="text-slate-600">The user @{username} doesn't exist or has been reserved.</p>
      </div>
    );
  }

  const { theme_config } = profile;

  return (
    <div className={clsx("min-h-screen flex flex-col items-center py-16 px-4", theme_config.bg)}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[580px] flex flex-col items-center"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <img 
            src={profile.avatar_url} 
            alt={profile.display_name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 object-cover"
            referrerPolicy="no-referrer"
          />
          <h1 className={clsx("text-xl font-bold mb-2", theme_config.text)}>
            {profile.display_name}
          </h1>
          <p className={clsx("text-sm opacity-80 max-w-[300px]", theme_config.text)}>
            {profile.bio}
          </p>
        </div>

        {/* Links */}
        <div className="w-full flex flex-col gap-4">
          {profile.links.map((link, index) => {
            const Icon = ICON_MAP[link.icon_type] || ExternalLink;
            return (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={clsx(
                  "flex items-center justify-between p-4 rounded-xl shadow-sm border border-black/5 transition-all group",
                  theme_config.button,
                  theme_config.buttonText || "text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-black/5 group-hover:bg-black/10 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{link.title}</span>
                </div>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-40 transition-opacity" />
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <a href="/" className={clsx("text-xs font-bold uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity", theme_config.text)}>
            LinkHub
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function clsx(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
