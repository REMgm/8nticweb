import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://msxrsvwyigmpqhevuvzs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hb6SS-IS-nXr2v_-dlKBfw_I_-zyc6Z';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
