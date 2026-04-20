-- ============================================================
-- FreedomPath — Schema Update v2
-- Add Mood and Trigger tracking to daily_checkins
-- ============================================================

alter table if exists daily_checkins 
add column if not exists mood text,
add column if not exists trigger text;

-- Index for better analytics later
create index if not exists idx_checkins_mood on daily_checkins(mood);
create index if not exists idx_checkins_trigger on daily_checkins(trigger);
