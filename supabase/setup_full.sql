-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 0. User Profiles (Standard Supabase Auth + Extensions)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  
  -- Natal Extensions
  birth_date timestamp with time zone,
  birth_city text,
  birth_country text,
  birth_lat float8,
  birth_lng float8,
  natal_data jsonb, -- Stores the calculated chart snapshot
  design_type text, -- Generator, Projector, etc.
  inner_authority text, -- Sacral, Emotional, etc.
  profile_lines text -- 1/3, 4/6 etc.
);

-- RLS for Profiles
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

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

-- RLS Policies (Basic)
alter table gates enable row level security;
create policy "Public Gates Access" on gates for select using (true);

alter table gate_lines enable row level security;
create policy "Public Lines Access" on gate_lines for select using (true);

alter table channels enable row level security;
create policy "Public Channels Access" on channels for select using (true);

alter table centers enable row level security;
create policy "Public Centers Access" on centers for select using (true);

-- --- SEED DATA ---

-- Clear existing data to avoid conflicts on re-run
DELETE FROM gates;

-- Insert Gates 1-64
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (1, 'The Creative', 'Entropy', 'Freshness', 'Beauty', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (2, 'The Receptive', 'Dislocation', 'Orientation', 'Unity', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (3, 'Difficulty at the Beginning', 'Chaos', 'Innovation', 'Innocence', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (4, 'Youthful Folly', 'Intolerance', 'Understanding', 'Forgiveness', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (5, 'Waiting', 'Impatience', 'Patience', 'Timelessness', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (6, 'Conflict', 'Conflict', 'Diplomacy', 'Peace', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (7, 'The Army', 'Division', 'Guidance', 'Virtue', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (8, 'Holding Together', 'Mediocrity', 'Style', 'Exquisiteness', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (9, 'The Taming Power of the Small', 'Inertia', 'Determination', 'Invincibility', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (10, 'Treading', 'Self-Obsession', 'Naturalness', 'Being', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (11, 'Peace', 'Obscurity', 'Idealism', 'Light', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (12, 'Standstill', 'Vanity', 'Discrimination', 'Purity', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (13, 'Fellowship with Men', 'Discord', 'Discernment', 'Empathy', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (14, 'Possession in Great Measure', 'Compromise', 'Competence', 'Bounteousness', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (15, 'Modesty', 'Dullness', 'Magnetism', 'Florescence', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (16, 'Enthusiasm', 'Indifference', 'Versatility', 'Mastery', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (17, 'Following', 'Opinion', 'Far-Sightedness', 'Omniscience', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (18, 'Work on What Has Been Spoiled', 'Judgment', 'Integrity', 'Perfection', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (19, 'Approach', 'Co-Dependence', 'Sensitivity', 'Sacrifice', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (20, 'Contemplation', 'Superficiality', 'Self-Assurance', 'Presence', 'Integration') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (21, 'Biting Through', 'Control', 'Authority', 'Valour', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (22, 'Grace', 'Dishonour', 'Graciousness', 'Grace', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (23, 'Splitting Apart', 'Complexity', 'Simplicity', 'Quintessence', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (24, 'Return', 'Addiction', 'Invention', 'Silence', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (25, 'Innocence', 'Constriction', 'Acceptance', 'Universal Love', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (26, 'The Taming Power of the Great', 'Pride', 'Artfulness', 'Invisibility', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (27, 'The Corners of the Mouth', 'Selfishness', 'Altruism', 'Selflessness', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (28, 'Preponderance of the Great', 'Purposelessness', 'Totality', 'Immortality', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (29, 'The Abysmal', 'Half-Heartedness', 'Commitment', 'Devotion', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (30, 'The Clinging Fire', 'Desire', 'Lightness', 'Rapture', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (31, 'Influence', 'Arrogance', 'Leadership', 'Humility', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (32, 'Duration', 'Failure', 'Preservation', 'Veneration', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (33, 'Retreat', 'Forgetting', 'Mindfulness', 'Revelation', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (34, 'The Power of the Great', 'Force', 'Strength', 'Majesty', 'Integration') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (35, 'Progress', 'Hunger', 'Adventure', 'Boundlessness', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (36, 'Darkening of the Light', 'Turbulence', 'Humanity', 'Compassion', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (37, 'The Family', 'Weakness', 'Equality', 'Tenderness', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (38, 'Opposition', 'Struggle', 'Perseverance', 'Honour', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (39, 'Obstruction', 'Provocation', 'Dynamism', 'Liberation', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (40, 'Deliverance', 'Exhaustion', 'Resolve', 'Divine Will', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (41, 'Decrease', 'Fantasy', 'Anticipation', 'Emanation', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (42, 'Increase', 'Expectation', 'Detachment', 'Celebration', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (43, 'Breakthrough', 'Deafness', 'Insight', 'Epiphany', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (44, 'Coming to Meet', 'Interference', 'Teamwork', 'Synarchy', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (45, 'Gathering Together', 'Dominance', 'Synergy', 'Communion', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (46, 'Pushing Upward', 'Seriousness', 'Delight', 'Ecstasy', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (47, 'Oppression', 'Oppression', 'Transmutation', 'Transfiguration', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (48, 'The Well', 'Inadequacy', 'Resourcefulness', 'Wisdom', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (49, 'Revolution', 'Reaction', 'Revolution', 'Rebirth', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (50, 'The Cauldron', 'Corruption', 'Equilibrium', 'Harmony', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (51, 'The Arousing', 'Agitation', 'Initiative', 'Awakening', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (52, 'Keeping Still', 'Stress', 'Restraint', 'Stillness', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (53, 'Development', 'Immaturity', 'Expansion', 'Superabundance', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (54, 'The Marrying Maiden', 'Greed', 'Aspiration', 'Ascension', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (55, 'Abundance', 'Victimisation', 'Freedom', 'Freedom', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (56, 'The Wanderer', 'Distraction', 'Enrichment', 'Intoxication', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (57, 'The Gentle', 'Unease', 'Intuition', 'Clarity', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (58, 'The Joyous', 'Dissatisfaction', 'Vitality', 'Bliss', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (59, 'Dispersion', 'Dishonesty', 'Intimacy', 'Transparency', 'Tribal') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (60, 'Limitation', 'Limitation', 'Realism', 'Justice', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (61, 'Inner Truth', 'Psychosis', 'Inspiration', 'Sanctity', 'Individual') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (62, 'Preponderance of the Small', 'Intellect', 'Precision', 'Impeccability', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (63, 'After Completion', 'Doubt', 'Inquiry', 'Truth', 'Collective') ON CONFLICT (id) DO NOTHING;
INSERT INTO gates (id, name, shadow, gift, siddhi, circuitry) VALUES (64, 'Before Completion', 'Confusion', 'Imagination', 'Illumination', 'Collective') ON CONFLICT (id) DO NOTHING;
