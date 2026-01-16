-- DEFRAG Database Schema
-- Profiles, Spiral events, and state computation

-- Profiles table for user natal data and settings
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Natal configuration (privacy-safe)
  birth_date DATE,
  birth_time TIME,
  birth_location TEXT,
  timezone TEXT,
  
  -- Stable seed for visual determinism
  profile_hash TEXT NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  
  -- Subscription tier
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'guided', 'active')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Preferences
  reduced_motion BOOLEAN DEFAULT FALSE,
  voice_enabled BOOLEAN DEFAULT TRUE
);

-- Spiral events table for action tracking
CREATE TABLE spiral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Event type
  event_type TEXT NOT NULL CHECK (event_type IN (
    'proposal_offered',
    'proposal_accepted', 
    'proposal_declined',
    'action_scheduled',
    'action_completed',
    'log_event',
    'reflection_saved'
  )),
  
  -- Event metadata
  action_type TEXT,
  proposal_id TEXT,
  scheduled_for TIMESTAMPTZ,
  content TEXT,
  metadata JSONB DEFAULT '{}'
);

-- State snapshots for history/caching
CREATE TABLE state_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- State values (0-1)
  pressure FLOAT NOT NULL CHECK (pressure >= 0 AND pressure <= 1),
  clarity FLOAT NOT NULL CHECK (clarity >= 0 AND clarity <= 1),
  velocity FLOAT NOT NULL CHECK (velocity >= 0 AND velocity <= 1),
  coherence FLOAT NOT NULL CHECK (coherence >= 0 AND coherence <= 1),
  
  -- Computed windows
  kairotic_windows JSONB DEFAULT '[]',
  
  -- Brief narration
  brief TEXT
);

-- Constellations (relational overlays)
CREATE TABLE constellations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constellation member
  name TEXT NOT NULL,
  relationship TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_location TEXT,
  
  -- Notes
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE spiral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE constellations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for spiral_events
CREATE POLICY "Users can view own spiral events" ON spiral_events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own spiral events" ON spiral_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for state_snapshots
CREATE POLICY "Users can view own state snapshots" ON state_snapshots
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own state snapshots" ON state_snapshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for constellations
CREATE POLICY "Users can view own constellations" ON constellations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own constellations" ON constellations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own constellations" ON constellations
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own constellations" ON constellations
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_spiral_events_user_id ON spiral_events(user_id);
CREATE INDEX idx_spiral_events_created_at ON spiral_events(created_at DESC);
CREATE INDEX idx_state_snapshots_user_id ON state_snapshots(user_id);
CREATE INDEX idx_state_snapshots_created_at ON state_snapshots(created_at DESC);
CREATE INDEX idx_constellations_user_id ON constellations(user_id);
