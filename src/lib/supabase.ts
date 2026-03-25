import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://msxrsvwyigmpqhevuvzs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zeHJzdnd5aWdtcHFoZXZ1dnpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNTAwNDAsImV4cCI6MjA4NTcyNjA0MH0.ye7Ed_d361CUjbzB5VaKWBcYJFIFwKzKJdFDCCFgizA';

let _supabase: SupabaseClient | null = null;

try {
  _supabase = createClient(supabaseUrl, supabaseAnonKey);
} catch (err) {
  console.warn('[supabase] Client initialization failed:', err);
}

export const supabase = _supabase;
export const isSupabaseReady = !!_supabase;
