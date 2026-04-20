-- ============================================================
-- FreedomPath — Schema Update v4
-- Add precise timestamp for last relapse to support live timers
-- ============================================================

alter table if exists profiles 
add column if not exists last_relapse_at timestamptz default now();
