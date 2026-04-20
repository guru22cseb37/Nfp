'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer } from 'lucide-react';

interface Props {
  lastRelapseAt: string | null;
}

export default function LiveTimer({ lastRelapseAt }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!lastRelapseAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const last = new Date(lastRelapseAt).getTime();
      const diff = now - last;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastRelapseAt]);

  if (!lastRelapseAt) return null;

  const TimeUnit = ({ label, value }: { label: string; value: number }) => (
    <div style={{ textAlign: 'center' }}>
      <motion.div
        key={value}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', tabularNums: true }}
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>
        {label}
      </div>
    </div>
  );

  return (
    <div style={{ marginTop: 24, padding: '16px 20px', borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--sage-400)' }}>
        <Timer size={18} />
        <span style={{ fontSize: 11, fontWeight: 700 }}>LIVE</span>
      </div>
      
      <div style={{ display: 'flex', gap: 16 }}>
        {timeLeft.days > 0 && <TimeUnit label="Days" value={timeLeft.days} />}
        <TimeUnit label="Hrs" value={timeLeft.hours} />
        <TimeUnit label="Min" value={timeLeft.minutes} />
        <TimeUnit label="Sec" value={timeLeft.seconds} />
      </div>
    </div>
  );
}
