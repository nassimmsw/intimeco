import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL:', supabaseUrl);
    console.error('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing');
    throw new Error('Variables Supabase manquantes');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
