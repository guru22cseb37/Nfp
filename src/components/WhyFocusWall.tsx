'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Edit2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  initialWhy: string;
  userId: string;
}

export default function WhyFocusWall({ initialWhy, userId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [why, setWhy] = useState(initialWhy);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from('profiles').update({ why_statement: why }).eq('id', userId);
    setLoading(false);
    setIsEditing(false);
  };

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24, position: 'relative', border: '1.5px solid rgba(107,163,190,0.3)', background: 'linear-gradient(135deg, var(--bg-card), rgba(107,163,190,0.08))' }}>
      <div style={{ position: 'absolute', top: -12, left: 24, padding: '4px 12px', borderRadius: 20, background: 'var(--navy-600)', border: '1px solid var(--sky-calm)', color: 'var(--sky-calm)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
        My "Why"
      </div>

      <div style={{ marginTop: 8 }}>
        {isEditing ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <textarea
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              className="input-field"
              style={{ minHeight: 80, fontSize: 15, background: 'rgba(0,0,0,0.2)' }}
              placeholder="Why are you doing this?"
            />
            <button onClick={handleSave} className="btn-primary" style={{ padding: '0 20px' }}>
              {loading ? '...' : <Check size={20} />}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <Quote size={20} color="var(--sky-calm)" style={{ opacity: 0.5, flexShrink: 0 }} />
              <p style={{ fontSize: 18, fontStyle: 'italic', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.6 }}>
                &ldquo;{why}&rdquo;
              </p>
            </div>
            <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <Edit2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
