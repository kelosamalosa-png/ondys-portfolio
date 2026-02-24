import { createClient } from '@supabase/supabase-js';

function getBuildClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  return createClient(url, key);
}

export interface TestimonialData {
  name: string;
  role_cs: string;
  role_en: string;
  company: string;
  avatar_url: string;
  text_cs: string;
  text_en: string;
  rating: number;
}

export async function getTestimonials(): Promise<TestimonialData[]> {
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('testimonials')
    .select('*')
    .eq('visible', true)
    .order('order', { ascending: true });

  if (error) {
    console.warn('[testimonials] Supabase unavailable:', error.message);
    return [];
  }
  return (data || []).map((r: any) => ({
    name: r.name,
    role_cs: r.role_cs || '',
    role_en: r.role_en || '',
    company: r.company || '',
    avatar_url: r.avatar_url || '',
    text_cs: r.text_cs,
    text_en: r.text_en,
    rating: r.rating || 5,
  }));
}
