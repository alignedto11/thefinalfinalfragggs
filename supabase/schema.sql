-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Knowledge Base: Gates (Hexagrams 1-64)
create table if not exists gates (
  id integer primary key check (id between 1 and 64),
  name text not null,
  shadow text,
  gift text,
  siddhi text,
  circuitry text, -- Individual, Collective, Tribal
  biology text, -- e.g. "Pineal Gland"
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Knowledge Base: Lines (1-6 per gate)
create table if not exists gate_lines (
  id uuid primary key default uuid_generate_v4(),
  gate_id integer references gates(id) on delete cascade not null,
  line_number integer check (line_number between 1 and 6) not null,
  name text,
  description text,
  keywords text[],
  unique (gate_id, line_number)
);

-- 3. Knowledge Base: Channels (Connections)
create table if not exists channels (
  id text primary key, -- e.g. "1-8"
  gate_a integer references gates(id) not null,
  gate_b integer references gates(id) not null,
  name text,
  type text, -- Projected, Generated, Manifested
  circuitry text,
  description text
);

-- 4. Knowledge Base: Centers
create table if not exists centers (
  id text primary key, -- Head, Ajna, Throat, G, Heart, Solar Plexus, Sacral, Spleen, Root
  name text not null,
  theme text, -- e.g. "Pressure to Think"
  biological_correlation text
);

-- 5. Profiles Extension (add Natal Data)
-- Assumes 'profiles' tabl eexists from standard Next.js Starter/Supabase Auth
alter table profiles add column if not exists birth_date timestamp with time zone;
alter table profiles add column if not exists birth_city text;
alter table profiles add column if not exists birth_country text;
alter table profiles add column if not exists birth_lat float8;
alter table profiles add column if not exists birth_lng float8;
alter table profiles add column if not exists natal_data jsonb; -- Stores the calculated chart snapshot
alter table profiles add column if not exists design_type text; -- Generator, Projector, etc.
alter table profiles add column if not exists inner_authority text; -- Sacral, Emotional, etc.
alter table profiles add column if not exists profile_lines text; -- 1/3, 4/6 etc.

-- RLS Policies (Basic)
alter table gates enable row level security;
create policy "Public Gates Access" on gates for select using (true);

alter table gate_lines enable row level security;
create policy "Public Lines Access" on gate_lines for select using (true);

alter table channels enable row level security;
create policy "Public Channels Access" on channels for select using (true);

alter table centers enable row level security;
create policy "Public Centers Access" on centers for select using (true);
