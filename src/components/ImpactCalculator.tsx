'use client';

import { motion } from 'framer-motion';
import { Clock, Zap, Heart, ShieldCheck } from 'lucide-react';

interface Props {
  streak: number;
}

export default function ImpactCalculator({ streak }: Props) {
  // Conservative estimates: 1.5 hours saved per day, 
  // $5 saved per day (optional/not shown for sensitivity), 
  // +2% energy per day
  const hoursSaved = streak * 1.5;
  const energyRegained = Math.min(streak * 2, 100);
  const healthBoost = Math.min(streak * 1.5, 100);

  const stats = [
    { label: 'Time Reclaimed', value: `${hoursSaved} hrs`, icon: Clock, color: 'var(--sky-calm)' },
    { label: 'Energy Level', value: `${energyRegained}%`, icon: Zap, color: 'var(--amber-glow)' },
    { label: 'Brain Recovery', value: `${healthBoost}%`, icon: Heart, color: '#e74c3c' },
  ];

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, var(--bg-card), rgba(107,163,190,0.05))' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <ShieldCheck size={20} color="var(--sky-calm)" />
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Your Impact</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '16px 8px', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
          >
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
              <stat.icon size={16} color={stat.color} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>
      
      <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 12, background: 'rgba(74,124,89,0.1)', border: '1px solid rgba(74,124,89,0.2)', fontSize: 13, color: 'var(--sage-300)', textAlign: 'center' }}>
        🔥 Your body is healing more every single day.
      </div>
    </div>
  );
}
