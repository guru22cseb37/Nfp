'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Flame, Shield, Brain, BookOpen, MessageCircle, ChevronRight,
  Star, Heart, Zap
} from 'lucide-react';

const features = [
  {
    icon: Flame,
    title: 'Streak Tracking',
    desc: 'Visual, calming day counter with daily check-ins and progress milestones.',
    color: 'amber',
  },
  {
    icon: Brain,
    title: 'AI Urge Support',
    desc: 'Real-time chat powered by evidence-based CBT and urge-surfing techniques.',
    color: 'sky',
  },
  {
    icon: BookOpen,
    title: 'Education Hub',
    desc: 'Science-backed content on neurological impact, dopamine reset, and recovery.',
    color: 'sage',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    desc: 'End-to-end secure with Supabase RLS. Your journey is yours alone.',
    color: 'sage',
  },
];

const milestones = [
  { days: 1, label: 'First Day', emoji: '🌱' },
  { days: 7, label: 'One Week', emoji: '🔥' },
  { days: 30, label: 'One Month', emoji: '⚡' },
  { days: 90, label: 'Three Months', emoji: '💎' },
  { days: 180, label: 'Half Year', emoji: '🏆' },
  { days: 365, label: 'One Year', emoji: '👑' },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-dvh" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-dvh flex flex-col items-center justify-center px-6 py-20 text-center">
        {/* Background glows */}
        <div
          style={{
            position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,124,89,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '-5%', right: '-10%',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(107,163,190,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
              style={{
                width: 52, height: 52, borderRadius: 16,
                background: 'linear-gradient(135deg, #4a7c59, #3a6b4a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(74,124,89,0.4)',
              }}
            >
              <Flame size={28} color="#fff" />
            </div>
            <span style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              FreedomPath
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(36px, 7vw, 72px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              marginBottom: 24,
            }}
          >
            <span style={{ color: 'var(--text-primary)' }}>Reclaim your</span>{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #76ab87, #4a7c59, #f0a500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              freedom.
            </span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: 560,
              margin: '0 auto 40px',
            }}
          >
            A compassionate, science-backed digital rehabilitation center. Track your recovery,
            manage urges with AI support, and build the life you deserve.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/register">
              <button className="btn-primary" style={{ fontSize: 16, padding: '16px 36px', borderRadius: 16 }}>
                Start Your Journey
                <ChevronRight size={18} />
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="btn-ghost" style={{ fontSize: 15, padding: '15px 28px' }}>
                Sign In
              </button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-2 mt-10" style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="#f0a500" color="#f0a500" />
            ))}
            <span style={{ marginLeft: 6 }}>Trusted by thousands on their recovery journey</span>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800,
              textAlign: 'center', marginBottom: 12, letterSpacing: '-1px',
              color: 'var(--text-primary)',
            }}
          >
            Everything you need to recover
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: 56, fontSize: 16 }}>
            Built with compassion and clinical evidence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card"
                style={{ padding: 28 }}
              >
                <div
                  style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: f.color === 'amber'
                      ? 'rgba(240,165,0,0.15)'
                      : f.color === 'sky'
                      ? 'rgba(107,163,190,0.15)'
                      : 'rgba(74,124,89,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <f.icon
                    size={22}
                    color={f.color === 'amber' ? '#f0a500' : f.color === 'sky' ? '#6ba3be' : '#76ab87'}
                  />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 17, marginBottom: 8, color: 'var(--text-primary)' }}>
                  {f.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Milestones */}
      <section style={{ padding: '60px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800,
              textAlign: 'center', marginBottom: 40, letterSpacing: '-0.5px',
              color: 'var(--text-primary)',
            }}
          >
            Recovery milestones to celebrate
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {milestones.map((m, i) => (
              <motion.div
                key={m.days}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="milestone-card"
                style={{ padding: '20px 12px' }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{m.emoji}</div>
                <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--sage-300)', marginBottom: 4 }}>
                  {m.days}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {m.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px 80px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: 600, margin: '0 auto',
            padding: '48px 32px',
            background: 'linear-gradient(135deg, rgba(74,124,89,0.15), rgba(107,163,190,0.08))',
            border: '1px solid rgba(74,124,89,0.25)',
            borderRadius: 28,
          }}
        >
          <Heart size={36} color="#76ab87" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, marginBottom: 12, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
            You are not alone
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.7 }}>
            Recovery is a journey, not a destination. Every day is a new opportunity to grow.
            We&apos;re here with you — compassionate, non-judgmental, always.
          </p>
          <Link href="/auth/register">
            <button className="btn-primary">
              <Zap size={18} />
              Begin Recovery Today
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
        <p>FreedomPath &copy; {new Date().getFullYear()} — A safe, private space for recovery. Not a substitute for professional medical advice.</p>
      </footer>
    </main>
  );
}
