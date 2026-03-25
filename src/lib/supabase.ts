import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://msxrsvwyigmpqhevuvzs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hb6SS-IS-nXr2v_-dlKBfw_I_-zyc6Z';

let _supabase: SupabaseClient | null = null;

try {
  _supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (err) {
  console.warn('[supabase] Client initialization failed:', err);
}

export const supabase = _supabase;
export const isSupabaseReady = !!_supabase;
