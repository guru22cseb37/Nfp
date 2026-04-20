'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, AlertTriangle } from 'lucide-react';
import type { DailyCheckin } from '@/lib/types';

interface Props {
  checkins: DailyCheckin[];
}

export default function TriggerAnalytics({ checkins }: Props) {
  const triggerStats = useMemo(() => {
    const stats: Record<string, number> = {};
    checkins.forEach((c) => {
      if (c.trigger) {
        stats[c.trigger] = (stats[c.trigger] || 0) + 1;
      }
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [checkins]);

  if (triggerStats.length === 0) return null;

  const topTrigger = triggerStats[0][0];

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <BarChart3 size={20} color="var(--amber-glow)" />
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Trigger Analytics</h3>
      </div>

      <div style={{ padding: '16px', borderRadius: 16, background: 'rgba(240,165,0,0.08)', border: '1px solid rgba(240,165,0,0.2)', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
        <AlertTriangle size={24} color="#f0a500" />
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Top Risk Factor</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#f0a500' }}>{topTrigger}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {triggerStats.map(([name, count]) => {
          const percentage = (count / checkins.length) * 100;
          return (
            <div key={name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{name}</span>
                <span style={{ fontWeight: 700 }}>{count} times</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  style={{ height: '100%', background: 'var(--sage-400)' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
