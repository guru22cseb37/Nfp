'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Globe } from 'lucide-react';

const NAMES = ['A brother', 'A warrior', 'A survivor', 'A legend', 'A user'];
const LOCATIONS = ['USA', 'UK', 'India', 'Canada', 'Australia', 'Germany', 'Brazil', 'Japan'];
const ACTIONS = ['hit 7 days!', 'reached 30 days!', 'is staying strong.', 'just logged a clean day.', 'survived an urge!'];

export default function BrotherhoodPulse() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % 10);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getRandomActivity = () => {
    const name = NAMES[Math.floor(Math.random() * NAMES.length)];
    const loc = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const act = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    return { name, loc, act };
  };

  const activity = getRandomActivity();

  return (
    <div style={{ 
      padding: '12px 16px', 
      borderRadius: 16, 
      background: 'rgba(74,124,89,0.05)', 
      border: '1px solid rgba(74,124,89,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 20,
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--sage-400)' }}>
        <Globe size={14} />
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Live Pulse</span>
      </div>

      <div style={{ width: 1, height: 16, background: 'var(--border)' }} />

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}
        >
          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{activity.name}</span> from {activity.loc} {activity.act}
        </motion.div>
      </AnimatePresence>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2ecc71', boxShadow: '0 0 8px #2ecc71' }} />
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>4.2k Online</span>
      </div>
    </div>
  );
}
