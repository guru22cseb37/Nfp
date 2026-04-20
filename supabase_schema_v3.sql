-- ============================================================
-- FreedomPath — Schema Update v3
-- Add personal 'Why' statement to profiles
-- ============================================================

alter table if exists profiles 
add column if not exists why_statement text default 'To be the best version of myself.';
