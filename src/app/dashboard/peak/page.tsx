'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, FastForward, Rewind, PlayCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function PeakPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
  };

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Link href="/dashboard" style={{ color: 'var(--text-muted)' }}>
          <ChevronLeft size={24} />
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Peak Motivation</h1>
      </div>

      <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', background: '#000', position: 'relative', borderRadius: 24 }}>
        <video
          ref={videoRef}
          src="/peak_video.mp4"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
        />

        {/* Controls Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: isPlaying ? 'transparent' : 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} onClick={togglePlay}>
          {!isPlaying && <Play size={64} color="#fff" fill="#fff" style={{ opacity: 0.8 }} />}
          
          <div style={{ position: 'absolute', bottom: 30, left: 20, right: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => skip(-10)} style={{ background: 'none', border: 'none', color: '#fff' }}>
              <Rewind size={32} />
            </button>
            <button onClick={togglePlay} style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              {isPlaying ? <Pause size={32} fill="#fff" /> : <Play size={32} fill="#fff" />}
            </button>
            <button onClick={() => skip(10)} style={{ background: 'none', border: 'none', color: '#fff' }}>
              <FastForward size={32} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, padding: 20, textAlign: 'center' }}>
        <p style={{ fontSize: 16, color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
          &ldquo;Success is not final, failure is not fatal: it is the courage to continue that counts.&rdquo;
        </p>
      </div>
    </div>
  );
}
