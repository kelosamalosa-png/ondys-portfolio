import { createClient } from '@supabase/supabase-js';
import { getCollection } from 'astro:content';

function getBuildClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  return createClient(url, key);
}

export interface ServiceData {
  serviceSlug: string;
  slug_cs: string;
  slug_en: string;
  icon: string;
  order: number;
  featured: boolean;
  title_cs: string;
  title_en: string;
  description_cs: string;
  description_en: string;
  tags: string[];
  badge_cs?: string;
  badge_en?: string;
  price_cs?: string;
  price_en?: string;
  price_note_cs?: string;
  price_note_en?: string;
  related_project?: string;
  seo_title_cs?: string;
  seo_title_en?: string;
  seo_description_cs?: string;
  seo_description_en?: string;
  body_cs: string;
  body_en: string;
}

export interface ServiceEntry {
  id: string;
  slug: string;
  data: ServiceData;
}

function rowToEntry(row: any): ServiceEntry {
  return {
    id: row.id,
    slug: row.service_slug,
    data: {
      serviceSlug: row.service_slug,
      slug_cs: row.slug_cs || '',
      slug_en: row.slug_en || '',
      icon: row.icon || '',
      order: row.order || 0,
      featured: row.featured ?? true,
      title_cs: row.title_cs,
      title_en: row.title_en,
      description_cs: row.description_cs || '',
      description_en: row.description_en || '',
      tags: row.tags || [],
      badge_cs: row.badge_cs || '',
      badge_en: row.badge_en || '',
      price_cs: row.price_cs || '',
      price_en: row.price_en || '',
      price_note_cs: row.price_note_cs || '',
      price_note_en: row.price_note_en || '',
      related_project: row.related_project || '',
      seo_title_cs: row.seo_title_cs || '',
      seo_title_en: row.seo_title_en || '',
      seo_description_cs: row.seo_description_cs || '',
      seo_description_en: row.seo_description_en || '',
      body_cs: row.body_cs || '',
      body_en: row.body_en || '',
    },
  };
}

function mdToEntry(md: any): ServiceEntry {
  return {
    id: md.id || md.slug,
    slug: md.data.serviceSlug,
    data: {
      serviceSlug: md.data.serviceSlug,
      slug_cs: md.data.slug_cs,
      slug_en: md.data.slug_en,
      icon: md.data.icon,
      order: md.data.order || 0,
      featured: md.data.featured ?? true,
      title_cs: md.data.title_cs,
      title_en: md.data.title_en,
      description_cs: md.data.description_cs || '',
      description_en: md.data.description_en || '',
      tags: md.data.tags || [],
      badge_cs: md.data.badge_cs || '',
      badge_en: md.data.badge_en || '',
      price_cs: md.data.price_cs || '',
      price_en: md.data.price_en || '',
      price_note_cs: md.data.price_note_cs || '',
      price_note_en: md.data.price_note_en || '',
      related_project: md.data.related_project || '',
      seo_title_cs: md.data.seo_title_cs || '',
      seo_title_en: md.data.seo_title_en || '',
      seo_description_cs: md.data.seo_description_cs || '',
      seo_description_en: md.data.seo_description_en || '',
      body_cs: md.data.body_cs || '',
      body_en: md.data.body_en || '',
    },
  };
}

async function fallbackFromMarkdown(): Promise<ServiceEntry[]> {
  try {
    const services = await getCollection('services');
    return services.sort((a, b) => (a.data.order || 0) - (b.data.order || 0)).map(mdToEntry);
  } catch {
    return [];
  }
}

export async function getServices(): Promise<ServiceEntry[]> {
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('services')
    .select('*')
    .order('order', { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn('[services] Supabase unavailable, falling back to markdown:', error.message);
    return fallbackFromMarkdown();
  }
  return data.map(rowToEntry);
}

export async function getFeaturedServices(): Promise<ServiceEntry[]> {
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('services')
    .select('*')
    .eq('featured', true)
    .order('order', { ascending: true });

  if (error || !data || data.length === 0) {
    const all = await fallbackFromMarkdown();
    return all.filter((s) => s.data.featured);
  }
  return data.map(rowToEntry);
}

export async function getServiceBySlug(slug: string, lang: 'cs' | 'en'): Promise<ServiceEntry | undefined> {
  const slugField = lang === 'cs' ? 'slug_cs' : 'slug_en';
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('services')
    .select('*')
    .eq(slugField, slug)
    .single();

  if (!error && data) return rowToEntry(data);

  const all = await fallbackFromMarkdown();
  return all.find((s) => s.data[slugField] === slug);
}

export async function getServiceByServiceSlug(serviceSlug: string): Promise<ServiceEntry | undefined> {
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('services')
    .select('*')
    .eq('service_slug', serviceSlug)
    .single();

  if (!error && data) return rowToEntry(data);

  const all = await fallbackFromMarkdown();
  return all.find((s) => s.data.serviceSlug === serviceSlug);
}
