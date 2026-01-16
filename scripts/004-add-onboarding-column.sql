-- Add onboarding_completed column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Add birth data columns if not present
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_time time;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_location text;
