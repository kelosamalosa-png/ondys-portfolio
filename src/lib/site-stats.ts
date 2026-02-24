import { createClient } from '@supabase/supabase-js';

function getBuildClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  return createClient(url, key);
}

export interface StatData {
  icon: string;
  value_cs: string;
  value_en: string;
  label_cs: string;
  label_en: string;
}

const defaultStats: StatData[] = [
  { icon: '📅', value_cs: '3+', value_en: '3+', label_cs: 'Let zkušeností', label_en: 'Years Experience' },
  { icon: '🚀', value_cs: '10+', value_en: '10+', label_cs: 'Projektů', label_en: 'Projects' },
  { icon: '🤝', value_cs: '5+', value_en: '5+', label_cs: 'Spokojených klientů', label_en: 'Happy Clients' },
  { icon: '⚡', value_cs: '15+', value_en: '15+', label_cs: 'Technologií', label_en: 'Technologies' },
];

export async function getSiteStats(): Promise<StatData[]> {
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('site_stats')
    .select('*')
    .order('order', { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn('[site-stats] Supabase unavailable:', error.message);
    return defaultStats;
  }
  return data.map((r: any) => ({
    icon: r.icon || '',
    value_cs: r.value_cs,
    value_en: r.value_en,
    label_cs: r.label_cs,
    label_en: r.label_en,
  }));
}
