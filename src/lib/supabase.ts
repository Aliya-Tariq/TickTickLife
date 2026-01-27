import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  emoji: string;
  category: string;
  deadline: string;
  is_completed: boolean;
  completion_data?: any;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Reflection {
  id: string;
  goal_id: string;
  user_id: string;
  responses: any;
  created_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  goals_completed: number;
  total_goals: number;
  years_saved: number;
  success_rate: number;
  updated_at: string;
}