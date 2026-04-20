import { create } from 'zustand';

interface ChatMessage {
  role: 'user' | 'assistant';
  message: string;
  id?: string;
}

interface AppState {
  // Chat
  isChatOpen: boolean;
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  addChatMessage: (msg: ChatMessage) => void;
  setChatMessages: (msgs: ChatMessage[]) => void;
  setChatLoading: (loading: boolean) => void;

  // Theme
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isChatOpen: false,
  chatMessages: [],
  isChatLoading: false,
  openChat: () => set({ isChatOpen: true }),
  closeChat: () => set({ isChatOpen: false }),
  addChatMessage: (msg) =>
    set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  setChatMessages: (msgs) => set({ chatMessages: msgs }),
  setChatLoading: (loading) => set({ isChatLoading: loading }),

  theme: 'dark',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
}));
