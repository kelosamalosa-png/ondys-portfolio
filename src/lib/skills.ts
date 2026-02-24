import { createClient } from '@supabase/supabase-js';
import { getCollection } from 'astro:content';

function getBuildClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  return createClient(url, key);
}

export interface SkillData {
  skillSlug: string;
  order: number;
  title_cs: string;
  title_en: string;
  description_cs: string;
  description_en: string;
}

export interface SkillEntry {
  id: string;
  slug: string;
  data: SkillData;
}

function rowToEntry(row: any): SkillEntry {
  return {
    id: row.id,
    slug: row.skill_slug,
    data: {
      skillSlug: row.skill_slug,
      order: row.order || 0,
      title_cs: row.title_cs,
      title_en: row.title_en,
      description_cs: row.description_cs || '',
      description_en: row.description_en || '',
    },
  };
}

function mdToEntry(md: any): SkillEntry {
  return {
    id: md.id || md.slug,
    slug: md.data.skillSlug,
    data: {
      skillSlug: md.data.skillSlug,
      order: md.data.order || 0,
      title_cs: md.data.title_cs,
      title_en: md.data.title_en,
      description_cs: md.data.description_cs || '',
      description_en: md.data.description_en || '',
    },
  };
}

async function fallbackFromMarkdown(): Promise<SkillEntry[]> {
  try {
    const skills = await getCollection('skills');
    return skills.sort((a, b) => (a.data.order || 0) - (b.data.order || 0)).map(mdToEntry);
  } catch {
    return [];
  }
}

export async function getSkills(): Promise<SkillEntry[]> {
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('skills')
    .select('*')
    .order('order', { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn('[skills] Supabase unavailable, falling back to markdown:', error.message);
    return fallbackFromMarkdown();
  }
  return data.map(rowToEntry);
}
