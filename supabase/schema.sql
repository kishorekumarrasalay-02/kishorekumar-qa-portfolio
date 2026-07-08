-- Portfolio Analytics — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL → New query)

create extension if not exists "pgcrypto";

-- ── Visitors ────────────────────────────────────────────────────────────────
create table if not exists visitors (
  id uuid primary key default gen_random_uuid(),
  visitor_key text unique not null,
  ip_hash text not null,
  browser text,
  device text,
  os text,
  screen_resolution text,
  timezone text,
  language text,
  country text default 'Unknown',
  city text default 'Unknown',
  referrer text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  visit_count integer not null default 1,
  is_returning boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_visitors_last_seen on visitors (last_seen_at desc);
create index if not exists idx_visitors_country on visitors (country);
create index if not exists idx_visitors_ip_hash on visitors (ip_hash);

-- ── Sessions ──────────────────────────────────────────────────────────────
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  session_key text unique not null,
  visitor_id uuid not null references visitors (id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer default 0,
  bounce boolean default true,
  max_scroll_depth integer default 0,
  entry_page text default '/',
  created_at timestamptz not null default now()
);

create index if not exists idx_sessions_visitor on sessions (visitor_id);
create index if not exists idx_sessions_started on sessions (started_at desc);

-- ── Page Views ──────────────────────────────────────────────────────────────
create table if not exists page_views (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions (id) on delete cascade,
  visitor_id uuid references visitors (id) on delete cascade,
  page text not null default '/',
  section text,
  viewed_at timestamptz not null default now(),
  time_spent_seconds integer default 0
);

create index if not exists idx_page_views_viewed on page_views (viewed_at desc);
create index if not exists idx_page_views_section on page_views (section);

-- ── Events (section views, scroll depth, generic) ─────────────────────────────
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions (id) on delete cascade,
  visitor_id uuid references visitors (id) on delete cascade,
  event_type text not null,
  event_name text not null,
  page text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_created on events (created_at desc);
create index if not exists idx_events_type on events (event_type);

-- ── Click Events ────────────────────────────────────────────────────────────
create table if not exists click_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions (id) on delete cascade,
  visitor_id uuid references visitors (id) on delete cascade,
  button_name text not null,
  page text not null default '/',
  browser text,
  device text,
  country text,
  created_at timestamptz not null default now()
);

create index if not exists idx_click_events_created on click_events (created_at desc);
create index if not exists idx_click_events_button on click_events (button_name);

-- ── Downloads ───────────────────────────────────────────────────────────────
create table if not exists downloads (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions (id) on delete cascade,
  visitor_id uuid references visitors (id) on delete cascade,
  file_name text not null,
  country text,
  browser text,
  device text,
  created_at timestamptz not null default now()
);

create index if not exists idx_downloads_created on downloads (created_at desc);
create index if not exists idx_downloads_file on downloads (file_name);

-- ── Row Level Security (service role bypasses; block anon access) ───────────
alter table visitors enable row level security;
alter table sessions enable row level security;
alter table page_views enable row level security;
alter table events enable row level security;
alter table click_events enable row level security;
alter table downloads enable row level security;

-- No public policies — only service role key used server-side
