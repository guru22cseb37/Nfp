'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Flame, TrendingUp, Calendar, Mail, Award, LogOut, RefreshCcw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { Profile, DailyCheckin } from '@/lib/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checkins, setCheckins] = useState<DailyCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReset, setShowReset] = useState(false);
  const [resetting, setResetting] = useState(false);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('daily_checkins').select('*').eq('user_id', user.id),
    ]);

    if (p) setProfile(p as Profile);
    if (c) setCheckins(c as DailyCheckin[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleManualReset = async () => {
    if (!profile) return;
    setResetting(true);
    const supabase = createClient();
    await supabase.from('profiles').update({ current_streak: 0 }).eq('id', profile.id);
    await fetchData();
    setResetting(false);
    setShowReset(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[1, 2, 3].map(i => <div key={i} className="card shimmer" style={{ height: 100 }} />)}
      </div>
    );
  }

  if (!profile) return null;

  const successCount = checkins.filter(c => c.success).length;
  const totalDays = checkins.length;
  const successRate = totalDays > 0 ? Math.round((successCount / totalDays) * 100) : 0;
  const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const stats = [
    { icon: Flame, label: 'Current Streak', value: `${profile.current_streak} days`, color: '#f0a500' },
    { icon: Award, label: 'Longest Streak', value: `${profile.longest_streak} days`, color: 'var(--sage-300)' },
    { icon: TrendingUp, label: 'Success Rate', value: `${successRate}%`, color: 'var(--sky-calm)' },
    { icon: Calendar, label: 'Days Logged', value: `${totalDays}`, color: '#d4c4b5' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ padding: '28px 24px', textAlign: 'center' }}
      >
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #4a7c59, #3a6b4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 30px rgba(74,124,89,0.4)' }}>
          <User size={32} color="#fff" />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Recovery Champion</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 13 }}>
          <Mail size={13} />
          {profile.email || 'Anonymous Warrior'}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>Member since {memberSince}</div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}
      >
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card" style={{ padding: '18px 16px', textAlign: 'center' }}>
            <Icon size={22} color={color} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Motivational progress */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
        style={{ padding: '20px 24px' }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Your Journey</h2>
        <div style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>
          {profile.current_streak === 0 && (
            <p>Every champion started at day zero. Today is your day one. Begin again — with self-compassion. 🌱</p>
          )}
          {profile.current_streak >= 1 && profile.current_streak < 7 && (
            <p>You&apos;ve taken the first steps. Your brain is already beginning to respond. Stay the course — the hardest part is behind you. 💪</p>
          )}
          {profile.current_streak >= 7 && profile.current_streak < 30 && (
            <p>One week or more — your dopamine receptors are starting to recalibrate. You are building real, lasting neural pathways for freedom. 🔥</p>
          )}
          {profile.current_streak >= 30 && profile.current_streak < 90 && (
            <p>A month or more of freedom. The science says your brain is measurably healthier today than it was 30 days ago. You are extraordinary. ⚡</p>
          )}
          {profile.current_streak >= 90 && (
            <p>90+ days — you have achieved something most people only dream of. You are a living proof that freedom is possible. Lead by example. 👑</p>
          )}
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
        style={{ padding: '20px 24px' }}
      >
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Account</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="btn-ghost"
              style={{ justifyContent: 'flex-start', gap: 10, color: '#e07070', borderColor: 'rgba(192,57,43,0.25)' }}
            >
              <RefreshCcw size={16} />
              Manually reset streak
            </button>
          ) : (
            <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
                Are you sure? This will set your current streak to 0. Your history is preserved.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleManualReset} disabled={resetting} className="btn-danger" style={{ padding: '10px 16px', fontSize: 13 }}>
                  {resetting ? 'Resetting…' : 'Yes, reset'}
                </button>
                <button onClick={() => setShowReset(false)} className="btn-ghost" style={{ padding: '10px 16px', fontSize: 13 }}>Cancel</button>
              </div>
            </div>
          )}
          <button onClick={handleLogout} className="btn-ghost" style={{ justifyContent: 'flex-start', gap: 10 }}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </motion.div>

      {/* Crisis resources */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ padding: '16px 20px', borderRadius: 16, background: 'rgba(107,163,190,0.08)', border: '1px solid rgba(107,163,190,0.2)' }}
      >
        <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--sky-calm)' }}>Need more support?</strong><br />
          SAMHSA Helpline: <strong>1-800-662-4357</strong><br />
          Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong><br />
          Suicide & Crisis Lifeline: <strong>988</strong>
        </p>
      </motion.div>
    </div>
  );
}
