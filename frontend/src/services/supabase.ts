import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || 'https://hcmubpndtdkhowewpyeb.supabase.co';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';

// Initialize Supabase Client with anon key
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_PUBLIC_KEY'
    ? supabaseAnonKey
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder'
);

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseAnonKey !== 'YOUR_SUPABASE_PUBLIC_KEY' &&
    !supabaseAnonKey.includes('YOUR_SUPABASE')
  );
};
