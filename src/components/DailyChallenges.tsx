'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sword, CheckCircle2, Circle } from 'lucide-react';

const CHALLENGES = [
  "Take a 2-minute cold shower.",
  "Go for a 15-minute walk outside.",
  "Write down 3 things you are grateful for.",
  "Drink 2 liters of water today.",
  "No social media for the next 2 hours.",
  "Meditate for 5 minutes.",
  "Call a friend or family member just to say hello.",
];

export default function DailyChallenges() {
  const [challenge, setChallenge] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const day = new Date().getDate();
    setChallenge(CHALLENGES[day % CHALLENGES.length]);
    const saved = localStorage.getItem(`challenge_${new Date().toISOString().split('T')[0]}`);
    if (saved) setCompleted(true);
  }, []);

  const handleComplete = () => {
    setCompleted(true);
    localStorage.setItem(`challenge_${new Date().toISOString().split('T')[0]}`, 'true');
  };

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, var(--bg-card), rgba(74,124,89,0.05))' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Sword size={20} color="var(--sage-400)" />
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Daily Quest</h3>
      </div>

      <div 
        onClick={!completed ? handleComplete : undefined}
        style={{ 
          padding: '20px', 
          borderRadius: 16, 
          background: completed ? 'rgba(74,124,89,0.1)' : 'rgba(255,255,255,0.03)',
          border: `1.5px solid ${completed ? 'var(--sage-400)' : 'var(--border)'}`,
          cursor: completed ? 'default' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          transition: 'all 0.2s ease'
        }}
      >
        {completed ? (
          <CheckCircle2 size={24} color="var(--sage-400)" />
        ) : (
          <Circle size={24} color="var(--text-muted)" />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: completed ? 'var(--sage-300)' : 'var(--text-primary)' }}>
            {challenge}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            {completed ? 'Quest Completed! +50 Focus XP' : 'Tap to complete this challenge'}
          </div>
        </div>
      </div>
    </div>
  );
}
