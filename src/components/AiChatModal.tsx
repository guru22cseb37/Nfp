'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Bot, Trash2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { createClient } from '@/lib/supabase/client';

const WELCOME_MSG = {
  role: 'assistant' as const,
  message: "Hey, I'm here with you. 💙 Whatever you're feeling right now — an urge, stress, or just needing to talk — I'm listening. What's going on?",
};

export default function AiChatModal() {
  const { isChatOpen, closeChat, chatMessages, addChatMessage, setChatMessages, isChatLoading, setChatLoading } = useAppStore();
  const [input, setInput] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, []);

  // Load chat history from Supabase on first open
  useEffect(() => {
    if (isChatOpen && userId && chatMessages.length === 0) {
      loadHistory();
    }
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isChatOpen, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  const loadHistory = async () => {
    if (!userId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('ai_chats')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(40);

    if (data && data.length > 0) {
      setChatMessages(data.map(d => ({ role: d.role, message: d.message, id: d.id })));
    } else {
      setChatMessages([WELCOME_MSG]);
    }
  };

  const clearHistory = async () => {
    if (!userId) return;
    const supabase = createClient();
    await supabase.from('ai_chats').delete().eq('user_id', userId);
    setChatMessages([WELCOME_MSG]);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isChatLoading) return;
    setInput('');

    const userMsg = { role: 'user' as const, message: text };
    addChatMessage(userMsg);
    setChatLoading(true);

    // Save user message to Supabase
    if (userId) {
      const supabase = createClient();
      await supabase.from('ai_chats').insert({ user_id: userId, role: 'user', message: text });
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map(m => ({ role: m.role, content: m.message })),
        }),
      });

      const data = await res.json();
      const aiMessage = data.message || "I'm here with you. Let's breathe through this together.";
      const aiMsg = { role: 'assistant' as const, message: aiMessage };
      addChatMessage(aiMsg);

      // Save AI response
      if (userId) {
        const supabase = createClient();
        await supabase.from('ai_chats').insert({ user_id: userId, role: 'assistant', message: aiMessage });
      }
    } catch {
      addChatMessage({ role: 'assistant', message: "I'm having trouble connecting right now. Please take a slow, deep breath. Inhale for 4 counts, hold for 4, exhale for 6. You've got this. 💙" });
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const displayMessages = chatMessages.length === 0 ? [WELCOME_MSG] : chatMessages;

  return (
    <AnimatePresence>
      {isChatOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeChat}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, backdropFilter: 'blur(4px)' }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: 0, left: 0, right: 0,
              zIndex: 101,
              maxWidth: 600,
              margin: '0 auto',
              background: 'var(--bg-secondary)',
              borderRadius: '24px 24px 0 0',
              border: '1px solid var(--border)',
              borderBottom: 'none',
              height: '85dvh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #4a7c59, #3a6b4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(74,124,89,0.35)' }}>
                <Bot size={20} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Recovery Coach</div>
                <div style={{ fontSize: 12, color: 'var(--sage-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4a7c59', display: 'inline-block' }} />
                  Always here for you
                </div>
              </div>
              <button id="clear-chat-btn" onClick={clearHistory} title="Clear history" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 8, borderRadius: 8 }}>
                <Trash2 size={16} />
              </button>
              <button id="close-chat-btn" onClick={closeChat} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 8, borderRadius: 8 }}>
                <X size={20} />
              </button>
            </div>

            {/* Disclaimer */}
            <div style={{ padding: '8px 20px', background: 'rgba(74,124,89,0.08)', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.5 }}>
                AI-powered support using CBT & urge-surfing techniques. Not a replacement for professional therapy.
              </p>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {displayMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  {msg.role === 'assistant' && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, paddingLeft: 4 }}>Recovery Coach</div>
                  )}
                  <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                    {msg.message}
                  </div>
                </motion.div>
              ))}

              {isChatLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, paddingLeft: 4 }}>Recovery Coach</div>
                  <div className="chat-bubble-ai" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '14px 18px' }}>
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'flex-end', background: 'var(--bg-secondary)', paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
              <textarea
                ref={inputRef}
                id="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share what's on your mind…"
                rows={1}
                style={{
                  flex: 1, background: 'var(--bg-card)', border: '1.5px solid var(--border)',
                  borderRadius: 16, padding: '12px 16px', color: 'var(--text-primary)',
                  fontSize: 14, fontFamily: 'inherit', resize: 'none', outline: 'none',
                  lineHeight: 1.5, maxHeight: 120, overflowY: 'auto',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#4a7c59'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />
              <button
                id="send-chat-btn"
                onClick={sendMessage}
                disabled={!input.trim() || isChatLoading}
                style={{
                  width: 44, height: 44, borderRadius: 14, border: 'none', cursor: 'pointer',
                  background: input.trim() && !isChatLoading ? 'linear-gradient(135deg, #4a7c59, #3a6b4a)' : 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease', flexShrink: 0,
                  boxShadow: input.trim() && !isChatLoading ? '0 4px 16px rgba(74,124,89,0.4)' : 'none',
                }}
              >
                <Send size={18} color={input.trim() && !isChatLoading ? '#fff' : 'var(--text-muted)'} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
