-- Row Level Security Policies for DEFRAG
-- All tables require RLS for user data isolation

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE timing_windows ENABLE ROW LEVEL SECURITY;
ALTER TABLE spiral_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE constellations ENABLE ROW LEVEL SECURITY;
ALTER TABLE constellation_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_proposals ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- State Snapshots: Users can only access their own snapshots
CREATE POLICY "Users can view own state snapshots" ON state_snapshots
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own state snapshots" ON state_snapshots
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Timing Windows: Users can only access their own windows
CREATE POLICY "Users can view own timing windows" ON timing_windows
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own timing windows" ON timing_windows
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Spiral Events: Full CRUD for own events
CREATE POLICY "Users can view own spiral events" ON spiral_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spiral events" ON spiral_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spiral events" ON spiral_events
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own spiral events" ON spiral_events
  FOR DELETE USING (auth.uid() = user_id);

-- Constellations: Full CRUD for own connections
CREATE POLICY "Users can view own constellations" ON constellations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own constellations" ON constellations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own constellations" ON constellations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own constellations" ON constellations
  FOR DELETE USING (auth.uid() = user_id);

-- Constellation States: Users can only access their own
CREATE POLICY "Users can view own constellation states" ON constellation_states
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own constellation states" ON constellation_states
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Action Proposals: Full CRUD for own proposals
CREATE POLICY "Users can view own action proposals" ON action_proposals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own action proposals" ON action_proposals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own action proposals" ON action_proposals
  FOR UPDATE USING (auth.uid() = user_id);
