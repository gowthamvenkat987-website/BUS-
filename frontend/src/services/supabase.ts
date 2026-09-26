import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read Vite environment variables
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const rawSupabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Clean and validate environment variables (trim accidental spaces/newlines/quotes)
const cleanUrl = typeof rawSupabaseUrl === 'string'
  ? rawSupabaseUrl.trim().replace(/^["']|["']$/g, '').replace(/\/+$/, '')
  : '';

const cleanKey = typeof rawSupabaseKey === 'string'
  ? rawSupabaseKey.trim().replace(/^["']|["']$/g, '')
  : '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    cleanUrl &&
    cleanKey &&
    cleanUrl.startsWith('https://') &&
    cleanKey.length > 10 &&
    !cleanKey.includes('YOUR_SUPABASE')
  );
};

// Valid project endpoint fallback for safe initialization without throwing
const PROJECT_URL = cleanUrl || 'https://nhkgmslvacuypmkhsiod.supabase.co';
const PROJECT_KEY = cleanKey || 'sb_publishable_cOYXlrSaCyc9eByIyFF0eQ_LjesUzal';

// Single Supabase Client instance initialized across the application
export const supabase: SupabaseClient = createClient(PROJECT_URL, PROJECT_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
