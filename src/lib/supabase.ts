import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = (typeof window !== 'undefined' && (window as any).__SUPABASE_URL)
      || import.meta.env.PUBLIC_SUPABASE_URL
      || 'https://placeholder.supabase.co';
    const key = (typeof window !== 'undefined' && (window as any).__SUPABASE_ANON_KEY)
      || import.meta.env.PUBLIC_SUPABASE_ANON_KEY
      || 'placeholder-key';
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as any)[prop];
  },
});
