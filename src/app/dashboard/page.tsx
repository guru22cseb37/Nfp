'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Calendar, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import StreakCounter from '@/components/StreakCounter';
import ProgressChart from '@/components/ProgressChart';
import { useAppStore } from '@/lib/store';
import type { Profile, DailyCheckin } from '@/lib/types';

const MILESTONES = [
  { days: 1, emoji: '🌱', label: 'First Day' },
  { days: 3, emoji: '💧', label: '3 Days' },
  { days: 7, emoji: '🔥', label: '1 Week' },
  { days: 14, emoji: '⚡', label: '2 Weeks' },
  { days: 30, emoji: '🌊', label: '1 Month' },
  { days: 60, emoji: '💎', label: '2 Months' },
  { days: 90, emoji: '🏅', label: '90 Days' },
  { days: 180, emoji: '🏆', label: '6 Months' },
  { days: 365, emoji: '👑', label: '1 Year' },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checkins, setCheckins] = useState<DailyCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const { openChat } = useAppStore();

  const fetchData = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [{ data: profileData }, { data: checkinData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('daily_checkins').select('*').eq('user_id', user.id).order('checkin_date', { ascending: false }).limit(30),
    ]);

    if (profileData) setProfile(profileData as Profile);
    if (checkinData) setCheckins(checkinData as DailyCheckin[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="card shimmer" style={{ height: i === 1 ? 280 : 160 }} />
        ))}
      </div>
    );
  }

  if (!profile) return null;

  const nextMilestone = MILESTONES.find(m => m.days > profile.current_streak) ?? MILESTONES[MILESTONES.length - 1];
  const prevMilestone = [...MILESTONES].reverse().find(m => m.days <= profile.current_streak);
  const progress = prevMilestone
    ? Math.min(((profile.current_streak - prevMilestone.days) / (nextMilestone.days - prevMilestone.days)) * 100, 100)
    : (profile.current_streak / nextMilestone.days) * 100;
  const daysToNext = Math.max(nextMilestone.days - profile.current_streak, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Streak Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
        style={{
          padding: '36px 24px 28px',
          background: 'linear-gradient(145deg, var(--bg-card), rgba(74,124,89,0.06))',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow */}
        <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,124,89,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <StreakCounter profile={profile} onUpdate={fetchData} />
      </motion.div>

      {/* Next milestone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card"
        style={{ padding: '20px 24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Next Milestone</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {nextMilestone.emoji} {nextMilestone.label} — {daysToNext > 0 ? `${daysToNext} day${daysToNext !== 1 ? 's' : ''} away` : 'Achieved! 🎉'}
            </p>
          </div>
          <Award size={24} color="var(--sage-400)" />
        </div>

        {/* Progress bar */}
        <div style={{ height: 8, borderRadius: 99, background: 'var(--border)', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #4a7c59, #f0a500)' }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
          <span>Day {profile.current_streak}</span>
          <span>Day {nextMilestone.days}</span>
        </div>
      </motion.div>

      {/* AI Support Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        onClick={openChat}
        className="card"
        style={{
          padding: '20px 24px', cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(74,124,89,0.12), rgba(107,163,190,0.06))',
          border: '1px solid rgba(74,124,89,0.2)',
          transition: 'all 0.2s ease',
          display: 'flex', alignItems: 'center', gap: 16,
        }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'linear-gradient(135deg, #4a7c59, #3a6b4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 20px rgba(74,124,89,0.4)' }}>
          <MessageCircle size={22} color="#fff" />
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 3 }}>Feeling an urge?</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Your AI recovery coach is here. CBT, urge-surfing, breathing — tap to talk.
          </p>
        </div>
      </motion.div>

      {/* Progress chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="card"
        style={{ padding: '20px 24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <TrendingUp size={18} color="var(--sage-400)" />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Your Progress</h2>
        </div>
        <ProgressChart checkins={checkins} />
      </motion.div>

      {/* Milestones grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="card"
        style={{ padding: '20px 24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Calendar size={18} color="var(--sage-400)" />
          <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Milestones</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {MILESTONES.map((m) => {
            const achieved = profile.current_streak >= m.days;
            return (
              <div
                key={m.days}
                className={`milestone-card ${achieved ? 'achieved' : ''}`}
                style={{ opacity: achieved ? 1 : 0.4 }}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>{m.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: achieved ? 'var(--sage-300)' : 'var(--text-muted)' }}>Day {m.days}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.label}</div>
                {achieved && <div style={{ fontSize: 10, color: 'var(--sage-400)', marginTop: 3, fontWeight: 600 }}>✓ Achieved</div>}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Daily affirmation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          padding: '20px 24px', borderRadius: 20,
          background: 'linear-gradient(135deg, rgba(107,163,190,0.1), rgba(74,124,89,0.08))',
          border: '1px solid rgba(107,163,190,0.2)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 13, color: 'var(--sky-calm)', marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Daily Affirmation</p>
        <p style={{ fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.7, fontStyle: 'italic', fontWeight: 500 }}>
          &ldquo;Every moment I choose freedom, I am becoming the man I was created to be.&rdquo;
        </p>
      </motion.div>
    </div>
  );
}
