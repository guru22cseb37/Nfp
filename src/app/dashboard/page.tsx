'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Calendar, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import StreakCounter from '@/components/StreakCounter';
import ProgressChart from '@/components/ProgressChart';
import SosButton from '@/components/SosButton';
import BadgeGallery from '@/components/BadgeGallery';
import { useAppStore } from '@/lib/store';
import type { Profile, DailyCheckin } from '@/lib/types';

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Emergency SOS Button */}
      <SosButton />

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
        <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,124,89,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <StreakCounter profile={profile} onUpdate={fetchData} />
      </motion.div>

      {/* Badge Gallery */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <BadgeGallery currentStreak={profile.current_streak} />
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
