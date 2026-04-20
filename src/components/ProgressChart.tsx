'use client';

import { useMemo } from 'react';
import type { DailyCheckin } from '@/lib/types';

interface Props {
  checkins: DailyCheckin[];
}

function getLast30Days(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

export default function ProgressChart({ checkins }: Props) {
  const last30 = useMemo(() => getLast30Days(), []);

  const checkinMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    checkins.forEach((c) => { map[c.checkin_date] = c.success; });
    return map;
  }, [checkins]);

  const successCount = useMemo(
    () => last30.filter((d) => checkinMap[d] === true).length,
    [last30, checkinMap]
  );
  const totalLogged = useMemo(
    () => last30.filter((d) => d in checkinMap).length,
    [last30, checkinMap]
  );

  const today = new Date().toISOString().split('T')[0];

  const weeks: string[][] = [];
  for (let i = 0; i < last30.length; i += 7) {
    weeks.push(last30.slice(i, i + 7));
  }

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, padding: '14px 16px', borderRadius: 14, background: 'rgba(74,124,89,0.1)', border: '1px solid rgba(74,124,89,0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--sage-300)' }}>{successCount}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Clean days</div>
        </div>
        <div style={{ flex: 1, padding: '14px 16px', borderRadius: 14, background: 'rgba(240,165,0,0.08)', border: '1px solid rgba(240,165,0,0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: '#f0a500' }}>
            {totalLogged > 0 ? Math.round((successCount / totalLogged) * 100) : 0}%
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Success rate</div>
        </div>
        <div style={{ flex: 1, padding: '14px 16px', borderRadius: 14, background: 'rgba(107,163,190,0.08)', border: '1px solid rgba(107,163,190,0.2)', textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--sky-calm)' }}>{totalLogged}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Days logged</div>
        </div>
      </div>

      {/* Calendar grid */}
      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 500 }}>LAST 30 DAYS</p>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 5, flex: 1, minWidth: 32 }}>
            {week.map((day) => {
              const status = day in checkinMap
                ? checkinMap[day] ? 'success' : 'missed'
                : day > today ? 'future' : 'empty';
              const isToday = day === today;

              return (
                <div
                  key={day}
                  title={day}
                  className={`calendar-day ${status}`}
                  style={{
                    outline: isToday ? '2px solid var(--sage-400)' : 'none',
                    outlineOffset: 1,
                    cursor: 'default',
                  }}
                >
                  {isToday && (
                    <span style={{ fontSize: 9, fontWeight: 800 }}>•</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center' }}>
        {[
          { color: 'var(--sage-500)', label: 'Clean' },
          { color: 'rgba(192,57,43,0.4)', label: 'Relapse' },
          { color: 'var(--border)', label: 'Not logged' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
            {label}
          </div>
        ))}
      </div>

      {/* SVG bar chart */}
      <div style={{ marginTop: 24 }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 500 }}>WEEKLY OVERVIEW</p>
        <svg width="100%" height="80" viewBox={`0 0 ${weeks.length * 44} 80`} preserveAspectRatio="xMidYMid meet">
          {weeks.map((week, wi) => {
            const clean = week.filter((d) => checkinMap[d] === true).length;
            const barH = Math.max((clean / 7) * 60, 4);
            const x = wi * 44 + 6;
            return (
              <g key={wi}>
                <rect x={x} y={70 - barH} width={32} height={barH} rx={6}
                  fill={clean >= 5 ? '#4a7c59' : clean >= 3 ? '#f0a500' : clean > 0 ? '#6ba3be' : 'rgba(255,255,255,0.05)'}
                  opacity={0.85}
                />
                <text x={x + 16} y={78} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={9}>
                  W{wi + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
