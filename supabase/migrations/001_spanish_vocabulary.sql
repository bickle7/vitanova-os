-- VitaNovaOS: Spanish Vocabulary Feature
-- Migration: 001_spanish_vocabulary
-- Created: 2026-04-15

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Categories enum
create type word_category as enum (
  'greetings',
  'eating_drinking',
  'travel_directions',
  'shopping',
  'hotel',
  'emergencies',
  'general'
);

-- Words table
create table if not exists public.spanish_words (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  english     text not null,
  spanish     text not null,
  pronunciation text,
  category    word_category not null default 'general',
  is_favourite boolean not null default false,
  use_count   integer not null default 0,
  source      text not null default 'custom' check (source in ('custom', 'discovery')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Indexes
create index if not exists idx_spanish_words_user_id on public.spanish_words(user_id);
create index if not exists idx_spanish_words_category on public.spanish_words(category);
create index if not exists idx_spanish_words_is_favourite on public.spanish_words(is_favourite) where is_favourite = true;
create index if not exists idx_spanish_words_created_at on public.spanish_words(created_at desc);

-- Full text search index
create index if not exists idx_spanish_words_fts
  on public.spanish_words
  using gin(to_tsvector('english', english || ' ' || spanish));

-- Updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_spanish_words_updated_at
  before update on public.spanish_words
  for each row execute function update_updated_at_column();

-- Row Level Security
alter table public.spanish_words enable row level security;

-- RLS Policies
create policy "Users can view their own words"
  on public.spanish_words for select
  using (auth.uid() = user_id);

create policy "Users can insert their own words"
  on public.spanish_words for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own words"
  on public.spanish_words for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own words"
  on public.spanish_words for delete
  using (auth.uid() = user_id);

-- Quick Tap usage stats table (optional, for future analytics)
create table if not exists public.quick_tap_sessions (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references auth.users(id) on delete cascade,
  context     text not null,
  phrase_spanish text,
  phrase_english text,
  created_at  timestamptz not null default now()
);

alter table public.quick_tap_sessions enable row level security;

create policy "Users can view their own sessions"
  on public.quick_tap_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own sessions"
  on public.quick_tap_sessions for insert
  with check (auth.uid() = user_id);

-- Grant permissions
grant usage on schema public to authenticated;
grant all on public.spanish_words to authenticated;
grant all on public.quick_tap_sessions to authenticated;
