'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/lib/types';

interface Props {
  profile: Profile;
  onUpdate: () => void;
}

const MILESTONES = [1, 3, 7, 14, 30, 60, 90, 180, 365];

const motivationalMessages = [
  "Every journey begins with a single step. You just took yours. 🌱",
  "Three days — your brain is already beginning to heal.",
  "A week strong! Dopamine receptors are starting to reset.",
  "Two weeks of clarity. Keep going.",
  "One month! Your reward circuits are rebuilding. 🔥",
  "60 days of freedom. You're rewriting your story.",
  "90 days — a new neural baseline. You did this. ⚡",
  "Half a year of freedom. You are an inspiration.",
  "365 days. A full year. You are extraordinary. 👑",
];

const relapseMessages = [
  "Relapse is a part of recovery, not the end of it. Be kind to yourself.",
  "You fell, and you're already getting back up. That's strength.",
  "One stumble doesn't erase your progress. Your brain remembers every day you chose well.",
  "Recovery isn't linear. What matters is that you're still here, still trying.",
  "Self-compassion is a recovery tool. Breathe. Start again. We're proud of you.",
];

export default function StreakCounter({ profile, onUpdate }: Props) {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [todaySuccess, setTodaySuccess] = useState<boolean | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'reset' | ''>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const streak = profile.current_streak;
  const longest = profile.longest_streak;

  useEffect(() => {
    checkTodayStatus();
  }, [profile.id]);

  const checkTodayStatus = async () => {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('daily_checkins')
      .select('*')
      .eq('user_id', profile.id)
      .eq('checkin_date', today)
      .single();

    if (data) {
      setHasCheckedIn(true);
      setTodaySuccess(data.success);
    }
  };

  const triggerConfetti = () => {
    if (typeof window === 'undefined') return;
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
    const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
    myConfetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#4a7c59', '#76ab87', '#f0a500', '#6ba3be', '#a8cdb5'],
    });
    setTimeout(() => {
      myConfetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#4a7c59', '#f0a500'] });
      myConfetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#76ab87', '#6ba3be'] });
    }, 400);
    setTimeout(() => { document.body.removeChild(canvas); }, 4000);
  };

  const handleCheckin = async (success: boolean) => {
    if (loading || hasCheckedIn) return;
    if (!success && !showResetConfirm) {
      setShowResetConfirm(true);
      return;
    }
    setShowResetConfirm(false);
    setLoading(true);

    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];

    // Insert checkin
    await supabase.from('daily_checkins').upsert({
      user_id: profile.id,
      checkin_date: today,
      success,
    });

    // Update streak
    let newStreak = success ? streak + 1 : 0;
    let newLongest = Math.max(longest, newStreak);

    await supabase
      .from('profiles')
      .update({ current_streak: newStreak, longest_streak: newLongest })
      .eq('id', profile.id);

    setHasCheckedIn(true);
    setTodaySuccess(success);
    setLoading(false);

    if (success) {
      triggerConfetti();
      const milestone = MILESTONES.indexOf(newStreak);
      const msg = milestone >= 0
        ? motivationalMessages[milestone]
        : `Day ${newStreak} — You're doing amazing. Keep building. 🔥`;
      setMessage(msg);
      setMessageType('success');
    } else {
      const idx = Math.floor(Math.random() * relapseMessages.length);
      setMessage(relapseMessages[idx]);
      setMessageType('reset');
    }

    onUpdate();
    setTimeout(() => { setMessage(''); setMessageType(''); }, 8000);
  };

  const flameScale = Math.min(1 + streak * 0.01, 1.5);

  return (
    <div style={{ textAlign: 'center' }}>
      {/* Streak Number */}
      <motion.div
        key={streak}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        style={{ marginBottom: 8 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 4 }}>
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <Flame size={40} color="#f0a500" fill="#f0a500" style={{ filter: 'drop-shadow(0 0 16px rgba(240,165,0,0.6))' }} />
          </motion.div>
          <span className="streak-number">{streak}</span>
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [3, -3, 3] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.5 }}
          >
            <Flame size={40} color="#f0a500" fill="#f0a500" style={{ filter: 'drop-shadow(0 0 16px rgba(240,165,0,0.6))' }} />
          </motion.div>
        </div>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          {streak === 1 ? 'Day Clean' : 'Days Clean'}
        </p>
      </motion.div>

      {/* Longest streak */}
      {longest > 0 && (
        <div style={{ marginBottom: 28, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 14px', borderRadius: 99, background: 'rgba(240,165,0,0.1)', border: '1px solid rgba(240,165,0,0.25)' }}>
          <span style={{ fontSize: 13, color: '#f0a500', fontWeight: 600 }}>🏆 Best: {longest} days</span>
        </div>
      )}

      {/* Reset confirm dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ marginBottom: 20, padding: '16px 20px', borderRadius: 16, background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.25)', textAlign: 'left' }}
          >
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
              It takes courage to be honest. Are you sure you want to log today as a relapse? Remember — this is for your healing, and honesty is strength.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => handleCheckin(false)} className="btn-danger" style={{ padding: '10px 18px', fontSize: 13 }}>
                Yes, reset my streak
              </button>
              <button onClick={() => setShowResetConfirm(false)} className="btn-ghost" style={{ padding: '10px 18px', fontSize: 13 }}>
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            style={{
              marginBottom: 24, padding: '16px 20px', borderRadius: 16,
              background: messageType === 'success' ? 'rgba(74,124,89,0.15)' : 'rgba(107,163,190,0.12)',
              border: `1px solid ${messageType === 'success' ? 'rgba(74,124,89,0.3)' : 'rgba(107,163,190,0.25)'}`,
              color: messageType === 'success' ? 'var(--sage-200)' : 'var(--sky-calm)',
              fontSize: 14, lineHeight: 1.6, textAlign: 'left',
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Check-in buttons */}
      {!hasCheckedIn ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 4 }}>How was your day?</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              id="checkin-success-btn"
              onClick={() => handleCheckin(true)}
              disabled={loading}
              className="btn-primary"
              style={{ gap: 8, padding: '14px 28px' }}
            >
              <CheckCircle2 size={18} />
              I stayed clean ✨
            </button>
            <button
              id="checkin-relapse-btn"
              onClick={() => handleCheckin(false)}
              disabled={loading}
              className="btn-ghost"
              style={{ gap: 8, padding: '14px 20px', borderColor: 'rgba(192,57,43,0.3)', color: '#e07070' }}
            >
              <XCircle size={18} />
              I relapsed
            </button>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 20px', borderRadius: 14,
              background: todaySuccess ? 'rgba(74,124,89,0.12)' : 'rgba(107,163,190,0.1)',
              border: `1px solid ${todaySuccess ? 'rgba(74,124,89,0.3)' : 'rgba(107,163,190,0.2)'}`,
              color: todaySuccess ? 'var(--sage-300)' : 'var(--sky-calm)',
              fontSize: 14, fontWeight: 500,
            }}
          >
            {todaySuccess ? <CheckCircle2 size={18} /> : <RefreshCcw size={18} />}
            {todaySuccess ? "Today's check-in logged ✓" : "Today logged — keep going 💙"}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Come back tomorrow for your next check-in</p>
        </motion.div>
      )}
    </div>
  );
}
