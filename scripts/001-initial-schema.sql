-- DEFRAG Database Schema
-- Core tables for user profiles, spiral events, constellations, and subscriptions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_location TEXT,
  timezone TEXT DEFAULT 'UTC',
  -- renamed profile_hash to seed for consistency with lib/state.ts
  seed FLOAT DEFAULT 0.5,
  tier TEXT DEFAULT 'passive' CHECK (tier IN ('passive', 'guided', 'active')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User state snapshots (daily computed state)
CREATE TABLE IF NOT EXISTS state_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  pressure FLOAT NOT NULL CHECK (pressure >= 0 AND pressure <= 1),
  clarity FLOAT NOT NULL CHECK (clarity >= 0 AND clarity <= 1),
  velocity FLOAT NOT NULL CHECK (velocity >= 0 AND velocity <= 1),
  coherence FLOAT NOT NULL CHECK (coherence >= 0 AND coherence <= 1),
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Timing windows (kairotic windows for action/pause)
CREATE TABLE IF NOT EXISTS timing_windows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  window_type TEXT NOT NULL CHECK (window_type IN ('favorable', 'pause', 'neutral')),
  score FLOAT,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spiral events (event memory system)
CREATE TABLE IF NOT EXISTS spiral_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('offered', 'accepted', 'declined', 'scheduled', 'log_event', 'insight')),
  action_type TEXT,
  title TEXT,
  body TEXT,
  metadata JSONB DEFAULT '{}',
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Constellations (relational connections)
CREATE TABLE IF NOT EXISTS constellations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  relationship_type TEXT,
  birth_date DATE,
  birth_time TIME,
  birth_location TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Constellation state (computed relational weather)
CREATE TABLE IF NOT EXISTS constellation_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  constellation_id UUID NOT NULL REFERENCES constellations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  harmony FLOAT CHECK (harmony >= 0 AND harmony <= 1),
  tension FLOAT CHECK (tension >= 0 AND tension <= 1),
  distance FLOAT CHECK (distance >= 0 AND distance <= 1),
  label TEXT,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(constellation_id, date)
);

-- Action proposals (AI-generated suggestions)
CREATE TABLE IF NOT EXISTS action_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('play_audio', 'log_event', 'schedule_prompt', 'open_module', 'breathwork', 'journaling', 'walking')),
  title TEXT NOT NULL,
  body TEXT,
  priority FLOAT DEFAULT 0.5,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_state_snapshots_user_date ON state_snapshots(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_timing_windows_user_time ON timing_windows(user_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_spiral_events_user_time ON spiral_events(user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_constellations_user ON constellations(user_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_action_proposals_user_status ON action_proposals(user_id, status) WHERE status = 'pending';

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER constellations_updated_at
  BEFORE UPDATE ON constellations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
