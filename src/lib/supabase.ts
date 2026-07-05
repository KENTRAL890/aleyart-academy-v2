import { createClient } from '@supabase/supabase-js';

// Supabase configuration - These will be replaced with actual values
// For demo purposes, we use a public anon key which is safe to expose
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project.supabase.co' && supabaseAnonKey !== 'your-anon-key';
};

// Database types
export interface DbUser {
  id: string;
  name: string;
  role: 'admin' | 'teacher';
  subject?: string;
  password: string;
  created_at?: string;
}

export interface DbExam {
  id: string;
  exam_data: string; // JSON stringified ExamPaper
  marking_scheme: string; // JSON stringified MarkingSchemeItem[]
  class_level: string;
  subject: string;
  exam_type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DbAssessment {
  id: string;
  assessment_data: string; // JSON stringified
  class_level: string;
  child_name: string;
  assessed_by: string;
  created_at: string;
}

// Run the complete SQL setup in Supabase SQL Editor — see DEPLOYMENT.md
