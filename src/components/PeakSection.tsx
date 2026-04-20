'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, FastForward, Rewind, Maximize, PlayCircle } from 'lucide-react';

export default function PeakSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      }
    }
  };

  return (
    <div className="card" style={{ padding: 24, marginBottom: 24, background: 'linear-gradient(135deg, var(--bg-card), rgba(74,124,89,0.1))', border: '1.5px solid var(--sage-400)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <PlayCircle size={20} color="var(--sage-400)" />
        <h3 style={{ fontSize: 18, fontWeight: 700 }}>Peak Motivation</h3>
      </div>

      <div 
        style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#000', aspectRatio: '16/9', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onClick={togglePlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          playsInline
          muted
          preload="auto"
        >
          <source src="/peak_video.mp4?v=2" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Custom Overlay Controls */}
        <motion.div
          initial={false}
          animate={{ opacity: showControls || !isPlaying ? 1 : 0 }}
          style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent, rgba(0,0,0,0.4))',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          onClick={togglePlay}
        >
          {!isPlaying && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Play size={64} color="#fff" fill="#fff" style={{ opacity: 0.9 }} />
            </motion.div>
          )}

          <div 
            style={{ 
              position: 'absolute', 
              bottom: 20, 
              left: 20, 
              right: 20, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 24 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => skip(-10)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <Rewind size={24} />
            </button>
            
            <button onClick={togglePlay} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
              {isPlaying ? <Pause size={24} fill="#fff" /> : <Play size={24} fill="#fff" />}
            </button>

            <button onClick={() => skip(10)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <FastForward size={24} />
            </button>
            <button onClick={toggleFullScreen} style={{ position: 'absolute', right: 0, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <Maximize size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', fontStyle: 'italic' }}>
        "When you feel like quitting, remember why you started."
      </div>
    </div>
  );
}
