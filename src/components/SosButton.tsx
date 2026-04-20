'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import BreathingExercise from './BreathingExercise';

export default function SosButton() {
  const [showBreathing, setShowBreathing] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowBreathing(true)}
        style={{
          width: '100%',
          padding: '20px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
          color: '#fff',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          cursor: 'pointer',
          boxShadow: '0 8px 32px rgba(192, 57, 43, 0.4)',
          marginBottom: 24,
        }}
      >
        <div style={{ width: 40, height: 40, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertCircle size={24} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>URGE EMERGENCY</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Get immediate help to stay clean</div>
        </div>
      </motion.button>

      <BreathingExercise isOpen={showBreathing} onClose={() => setShowBreathing(false)} />
    </>
  );
}
