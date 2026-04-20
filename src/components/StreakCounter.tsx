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
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState('');
  const [trigger, setTrigger] = useState('');

  const MOODS = [
    { label: 'Happy', emoji: '😊' },
    { label: 'Neutral', emoji: '😐' },
    { label: 'Sad', emoji: '😔' },
    { label: 'Angry', emoji: '😠' },
    { label: 'Anxious', emoji: '😰' },
  ];

  const TRIGGERS = ['Boredom', 'Stress', 'Loneliness', 'Fatigue', 'Social Media', 'Other'];

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
      mood: mood || null,
      trigger: trigger || null,
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
    setStep(1);
    setTimeout(() => { setMessage(''); setMessageType(''); }, 8000);
  };

  return (
    <div className="card" style={{ padding: '40px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.05)' }}>
        <motion.div animate={{ width: hasCheckedIn ? '100%' : `${(step / 3) * 100}%` }} style={{ height: '100%', background: 'var(--sage-400)' }} />
      </div>

      <AnimatePresence mode="wait">
        {!hasCheckedIn ? (
          <motion.div key="checkin-flow" style={{ width: '100%' }}>
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
                  <Flame size={40} color="#f0a500" fill="#f0a500" />
                  <span className="streak-number">{streak}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>DAY CLEAN</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button onClick={() => setStep(2)} className="btn-primary" style={{ width: '100%' }}>
                    Start Daily Check-in
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 24 }}>How are you feeling?</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 32 }}>
                  {MOODS.map((m) => (
                    <button key={m.label} onClick={() => setMood(m.label)} style={{ 
                      background: mood === m.label ? 'rgba(74,124,89,0.2)' : 'rgba(255,255,255,0.05)',
                      border: `1.5px solid ${mood === m.label ? 'var(--sage-400)' : 'transparent'}`,
                      borderRadius: 16, padding: '12px 0', cursor: 'pointer', transition: 'all 0.2s', color: 'inherit'
                    }}>
                      <div style={{ fontSize: 28 }}>{m.emoji}</div>
                      <div style={{ fontSize: 10, marginTop: 4, fontWeight: 600 }}>{m.label}</div>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(3)} className="btn-primary" style={{ width: '100%' }} disabled={!mood}>Next</button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>Did you stay clean?</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <button onClick={() => handleCheckin(true)} className="btn-primary" style={{ padding: 18 }}>
                    Yes, I stayed strong! 🌿
                  </button>
                  
                  <div style={{ marginTop: 8 }}>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Any specific trigger?</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                      {TRIGGERS.map(t => (
                        <button key={t} onClick={() => setTrigger(t)} style={{ 
                          padding: '6px 14px', borderRadius: 20, fontSize: 12, 
                          background: trigger === t ? 'rgba(107,163,190,0.2)' : 'transparent',
                          border: `1px solid ${trigger === t ? 'var(--sky-calm)' : 'var(--border)'}`,
                          color: trigger === t ? 'var(--sky-calm)' : 'var(--text-muted)',
                          cursor: 'pointer'
                        }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => handleCheckin(false)} className="btn-ghost" style={{ color: '#e74c3c' }}>
                    I relapsed
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div key="done-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(74,124,89,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={32} color="var(--sage-400)" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Day {streak} Logged ✓</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{message || 'Stay strong. You got this.'}</p>
            </div>
            <div className="badge badge-amber">🏆 Best: {longest} days</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Confirmation Overlay */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(7, 11, 20, 0.95)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div>
              <XCircle size={48} color="#e74c3c" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>It's okay to stumble</h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.5 }}>
                Resetting your streak is an act of honesty and courage. It's the first step in starting again stronger.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => handleCheckin(false)} className="btn-danger" style={{ width: '100%' }}>Yes, Reset Streak</button>
                <button onClick={() => setShowResetConfirm(false)} className="btn-ghost" style={{ width: '100%' }}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
