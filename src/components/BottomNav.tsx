'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Flame, BookOpen, MessageCircle, User, LayoutDashboard, PlayCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/peak', label: 'Peak', icon: PlayCircle },
  { href: '/dashboard/education', label: 'Learn', icon: BookOpen },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { openChat } = useAppStore();

  return (
    <nav className="bottom-nav">
      {navItems.slice(0, 2).map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={`nav-item ${pathname === href ? 'active' : ''}`}>
          <Icon size={22} />
          <span>{label}</span>
        </Link>
      ))}

      {/* Center Chat Button */}
      <button
        id="open-ai-chat-btn"
        onClick={openChat}
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #4a7c59, #3a6b4a)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(74,124,89,0.5)',
          transform: 'translateY(-8px)',
          transition: 'all 0.2s ease',
          flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(-8px) scale(1)')}
      >
        <MessageCircle size={24} color="#fff" />
      </button>

      {navItems.slice(2).map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={`nav-item ${pathname === href ? 'active' : ''}`}>
          <Icon size={22} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
