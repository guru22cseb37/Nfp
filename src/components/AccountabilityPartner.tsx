'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link2, Copy, Check, Shield } from 'lucide-react';

interface Props {
  userId: string;
}

export default function AccountabilityPartner({ userId }: Props) {
  const [copied, setCopied] = useState(false);
  const trackLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/track/${userId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(trackLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, var(--bg-card), rgba(155,89,182,0.05))', border: '1.5px solid rgba(155,89,182,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Shield size={20} color="#9b59b6" />
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Accountability Partner</h3>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>
        Share this private, anonymous link with a trusted mentor. They can track your streak and progress without seeing your personal data.
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, padding: '12px 16px', borderRadius: 12, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {trackLink}
        </div>
        <button onClick={copyToClipboard} className="btn-primary" style={{ padding: '0 20px', background: copied ? '#2ecc71' : '#9b59b6' }}>
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>
    </div>
  );
}
