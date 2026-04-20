export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  email: string | null;
  current_streak: number;
  longest_streak: number;
  why_statement: string | null;
  last_relapse_at: string | null;
  created_at: string;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  checkin_date: string;
  success: boolean;
  mood: string | null;
  trigger: string | null;
  note: string | null;
  created_at: string;
}

export interface AiChat {
  id: string;
  user_id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}
