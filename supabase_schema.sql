-- ============================================================
-- FreedomPath — Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. PROFILES TABLE
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  current_streak int default 0,
  longest_streak int default 0,
  created_at timestamptz default now()
);

-- 2. DAILY CHECKINS TABLE
create table if not exists daily_checkins (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  checkin_date date default current_date,
  success boolean default true,
  note text,
  created_at timestamptz default now(),
  unique(user_id, checkin_date)
);

-- 3. AI CHATS TABLE
create table if not exists ai_chats (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  role text check (role in ('user', 'assistant')) not null,
  message text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table daily_checkins enable row level security;
alter table ai_chats enable row level security;

-- ============================================================
-- RLS POLICIES — PROFILES
-- ============================================================

create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- ============================================================
-- RLS POLICIES — DAILY CHECKINS
-- ============================================================

create policy "Users can view own checkins"
  on daily_checkins for select
  using (auth.uid() = user_id);

create policy "Users can insert own checkins"
  on daily_checkins for insert
  with check (auth.uid() = user_id);

create policy "Users can update own checkins"
  on daily_checkins for update
  using (auth.uid() = user_id);

create policy "Users can delete own checkins"
  on daily_checkins for delete
  using (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES — AI CHATS
-- ============================================================

create policy "Users can view own chats"
  on ai_chats for select
  using (auth.uid() = user_id);

create policy "Users can insert own chats"
  on ai_chats for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own chats"
  on ai_chats for delete
  using (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Auto-create profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
