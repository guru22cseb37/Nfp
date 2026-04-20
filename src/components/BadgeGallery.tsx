'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Shield, Zap, Crown, Flame } from 'lucide-react';

interface Props {
  currentStreak: number;
}

const BADGES = [
  { id: 'start', name: 'Seedling', days: 1, icon: Star, color: '#4a7c59' },
  { id: 'week', name: 'Survivor', days: 7, icon: Zap, color: '#6ba3be' },
  { id: 'month', name: 'Warrior', days: 30, icon: Shield, color: '#f0a500' },
  { id: '90', name: 'Reborn', days: 90, icon: Flame, color: '#e74c3c' },
  { id: 'year', name: 'Legend', days: 365, icon: Crown, color: '#9b59b6' },
];

export default function BadgeGallery({ currentStreak }: Props) {
  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Trophy size={20} color="var(--sage-400)" />
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Milestone Badges</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: 16 }}>
        {BADGES.map((badge) => {
          const isUnlocked = currentStreak >= badge.days;
          const Icon = badge.icon;

          return (
            <motion.div
              key={badge.id}
              initial={false}
              animate={{ opacity: isUnlocked ? 1 : 0.3, filter: isUnlocked ? 'grayscale(0%)' : 'grayscale(100%)' }}
              style={{ textAlign: 'center' }}
            >
              <div style={{ 
                width: 56, 
                height: 56, 
                borderRadius: '18px', 
                background: isUnlocked ? `${badge.color}20` : 'rgba(255,255,255,0.05)', 
                border: `1.5px solid ${isUnlocked ? badge.color : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 8px',
                position: 'relative'
              }}>
                <Icon size={24} color={isUnlocked ? badge.color : 'var(--text-muted)'} />
                {!isUnlocked && (
                  <div style={{ position: 'absolute', bottom: -4, right: -4, fontSize: 10, padding: '2px 6px', background: 'var(--bg-elevated)', borderRadius: 6, border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    {badge.days}d
                  </div>
                )}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>{badge.name}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
