'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  age: number;
  bio: string;
  avatar_url: string;
  aura_type: string;
  is_ai: boolean;
}

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfiles() {
      const { data } = await supabase.from('profiles').select('*');
      if (data) setProfiles(data);
      setLoading(false);
    }
    fetchProfiles();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-slate-900 text-white">Načítám Aura Match...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <header className="max-w-4xl mx-auto flex justify-between items-center pb-8 border-b border-slate-800">
        <h1 className="text-3xl font-extrabold tracking-wider text-purple-400">✨ Aura Match</h1>
        <div className="bg-slate-800 px-4 py-2 rounded-full text-sm font-semibold text-purple-300 border border-purple-500/30">
          Kredity: 20 💎
        </div>
      </header>

      <main className="max-w-4xl mx-auto mt-10">
        <h2 className="text-xl font-medium text-slate-400 mb-6">Doporučené profily ve tvém okolí</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-purple-500/50 transition">
              <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: `url(${profile.avatar_url})` }}>
                <span className="absolute top-3 right-3 bg-purple-900/80 text-purple-200 text-xs px-3 py-1 rounded-full backdrop-blur-md">
                  {profile.aura_type || 'Profil'}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold">{profile.full_name}, {profile.age}</h3>
                <p className="text-slate-400 text-sm mt-2 line-clamp-2">{profile.bio}</p>
                <button className="w-full mt-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-xl transition">
                  {profile.is_ai ? 'Napsat AI společníkovi 💬' : 'Prohlédnout profil'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

