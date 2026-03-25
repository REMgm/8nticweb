-- ============================================
-- 8NTIC Quantum Intelligence — Supabase Schema
-- ============================================

-- 1. CONTACTS TABLE
-- Stores contact form submissions
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.contacts enable row level security;

-- Allow anonymous inserts (contact form doesn't require auth)
create policy "Anyone can submit contact form"
  on public.contacts
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated users (admin) can read contacts
create policy "Authenticated users can read contacts"
  on public.contacts
  for select
  to authenticated
  using (true);


-- 2. ANALYTICS EVENTS TABLE
-- Stores page views, clicks, section views, form submissions
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  event_data jsonb default '{}',
  page text,
  referrer text,
  user_agent text,
  session_id text,
  user_id uuid references auth.users(id),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.analytics_events enable row level security;

-- Allow anyone to insert analytics events
create policy "Anyone can insert analytics events"
  on public.analytics_events
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated users can read analytics
create policy "Authenticated users can read analytics"
  on public.analytics_events
  for select
  to authenticated
  using (true);


-- 3. INDEXES for query performance
create index if not exists idx_analytics_event_type on public.analytics_events(event_type);
create index if not exists idx_analytics_created_at on public.analytics_events(created_at);
create index if not exists idx_analytics_session on public.analytics_events(session_id);
create index if not exists idx_contacts_created_at on public.contacts(created_at);
create index if not exists idx_contacts_email on public.contacts(email);
