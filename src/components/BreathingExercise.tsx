'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wind } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PHASES = [
  { text: 'Inhale', duration: 4, scale: 1.5, color: 'var(--sage-400)' },
  { text: 'Hold', duration: 4, scale: 1.5, color: 'var(--sage-500)' },
  { text: 'Exhale', duration: 4, scale: 1, color: 'var(--sky-calm)' },
  { text: 'Hold', duration: 4, scale: 1, color: 'var(--navy-600)' },
];

export default function BreathingExercise({ isOpen, onClose }: Props) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    let startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const currentPhase = PHASES[phaseIndex];
      
      if (elapsed >= currentPhase.duration) {
        setPhaseIndex((prev) => (prev + 1) % PHASES.length);
        startTime = Date.now();
        setProgress(0);
      } else {
        setProgress((elapsed / currentPhase.duration) * 100);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isOpen, phaseIndex]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(7, 11, 20, 0.9)', backdropFilter: 'blur(8px)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="card"
          style={{ width: '90%', maxWidth: 400, padding: 40, textAlign: 'center', position: 'relative' }}
        >
          <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>

          <Wind size={32} color="var(--sage-400)" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Box Breathing</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 40 }}>Focus on the circle. Calm your mind.</p>

          <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* Animated Circle */}
            <motion.div
              animate={{
                scale: PHASES[phaseIndex].scale,
                backgroundColor: PHASES[phaseIndex].color,
              }}
              transition={{ duration: 4, ease: 'easeInOut' }}
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                boxShadow: `0 0 60px ${PHASES[phaseIndex].color}`,
                opacity: 0.6,
              }}
            />

            {/* Phase Text */}
            <div style={{ position: 'absolute', fontSize: 20, fontWeight: 700, color: '#fff' }}>
              {PHASES[phaseIndex].text}
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: 4, background: 'var(--border)', borderRadius: 2, marginTop: 40, overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: PHASES[phaseIndex].color, transition: 'width 0.1s linear' }} />
          </div>

          <p style={{ marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
            Repeat for 3-5 minutes to significantly lower urge intensity.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
