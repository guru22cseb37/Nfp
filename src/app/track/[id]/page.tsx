'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Flame, Award, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile, DailyCheckin } from '@/lib/types';
import ProgressChart from '@/components/ProgressChart';

export default function PublicTrackPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checkins, setCheckins] = useState<DailyCheckin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [{ data: profileData }, { data: checkinData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', id).single(),
        supabase.from('daily_checkins').select('*').eq('user_id', id).order('checkin_date', { ascending: false }).limit(30),
      ]);

      if (profileData) setProfile(profileData as Profile);
      if (checkinData) setCheckins(checkinData as DailyCheckin[]);
      setLoading(false);
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Loading Brotherhood Stats...</div>;
  if (!profile) return <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Profile Not Found</div>;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '40px 20px' }}>
      <main style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 80, height: 80, borderRadius: '24px', background: 'linear-gradient(135deg, #4a7c59, #3a6b4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 40px rgba(74,124,89,0.3)' }}>
            <Shield size={40} color="#fff" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Accountability Hub</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Tracking the progress of an anonymous warrior.</p>
        </div>

        <div className="card" style={{ padding: 40, textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
            <Flame size={32} color="#f0a500" fill="#f0a500" />
            <span style={{ fontSize: 48, fontWeight: 900, color: '#f0a500' }}>{profile.current_streak}</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Streak</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <Award size={24} color="var(--amber-glow)" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 20, fontWeight: 800 }}>{profile.longest_streak}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Longest Streak</div>
          </div>
          <div className="card" style={{ padding: 24, textAlign: 'center' }}>
            <Calendar size={24} color="var(--sky-calm)" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 20, fontWeight: 800 }}>{checkins.length}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Days Logged</div>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>30-Day Progress Map</h3>
          <ProgressChart checkins={checkins} />
        </div>

        <footer style={{ marginTop: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Join the journey at <span style={{ color: 'var(--sage-400)', fontWeight: 600 }}>FreedomPath</span>
          </p>
        </footer>
      </main>
    </div>
  );
}
