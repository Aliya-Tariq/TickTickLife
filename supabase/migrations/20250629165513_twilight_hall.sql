/*
  # Initial TickTickLife Database Schema

  1. New Tables
    - `goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `emoji` (text)
      - `category` (text)
      - `deadline` (timestamptz)
      - `is_completed` (boolean, default false)
      - `completion_data` (jsonb, nullable)
      - `created_at` (timestamptz)

    - `reflections`
      - `id` (uuid, primary key)
      - `goal_id` (uuid, foreign key to goals)
      - `user_id` (uuid, foreign key to auth.users)
      - `responses` (jsonb)
      - `created_at` (timestamptz)

    - `user_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `goals_completed` (integer, default 0)
      - `total_goals` (integer, default 0)
      - `years_saved` (numeric, default 0)
      - `success_rate` (numeric, default 0)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  emoji text NOT NULL DEFAULT '🎯',
  category text NOT NULL,
  deadline timestamptz NOT NULL,
  is_completed boolean DEFAULT false,
  completion_data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create reflections table
CREATE TABLE IF NOT EXISTS reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid REFERENCES goals(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  responses jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  goals_completed integer DEFAULT 0,
  total_goals integer DEFAULT 0,
  years_saved numeric DEFAULT 0,
  success_rate numeric DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Goals policies
CREATE POLICY "Users can view own goals"
  ON goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own goals"
  ON goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON goals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Reflections policies
CREATE POLICY "Users can view own reflections"
  ON reflections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reflections"
  ON reflections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Users can view own stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own stats"
  ON user_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON goals(user_id);
CREATE INDEX IF NOT EXISTS goals_deadline_idx ON goals(deadline);
CREATE INDEX IF NOT EXISTS goals_is_completed_idx ON goals(is_completed);
CREATE INDEX IF NOT EXISTS reflections_user_id_idx ON reflections(user_id);
CREATE INDEX IF NOT EXISTS reflections_goal_id_idx ON reflections(goal_id);
CREATE INDEX IF NOT EXISTS user_stats_user_id_idx ON user_stats(user_id);

-- Function to automatically update user_stats updated_at
CREATE OR REPLACE FUNCTION update_user_stats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_stats updated_at
CREATE TRIGGER update_user_stats_updated_at_trigger
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_updated_at();