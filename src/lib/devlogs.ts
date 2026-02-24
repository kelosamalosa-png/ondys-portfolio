import { createClient } from '@supabase/supabase-js';
import { getCollection } from 'astro:content';

function getBuildClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  return createClient(url, key);
}

export interface DevlogFeature {
  cs: string;
  en: string;
}

export interface DevlogData {
  projectSlug: string;
  version: string;
  versionStatus: 'alpha' | 'beta' | 'stable';
  releaseDate: string;
  summary_cs?: string;
  summary_en?: string;
  new_features: DevlogFeature[];
  fixes: DevlogFeature[];
  known_issues: DevlogFeature[];
}

export interface DevlogEntry {
  id: string;
  slug: string;
  data: DevlogData;
}

function rowToEntry(row: any): DevlogEntry {
  return {
    id: row.id,
    slug: row.devlog_slug,
    data: {
      projectSlug: row.project_slug,
      version: row.version,
      versionStatus: row.version_status,
      releaseDate: row.release_date,
      summary_cs: row.summary_cs || '',
      summary_en: row.summary_en || '',
      new_features: row.new_features || [],
      fixes: row.fixes || [],
      known_issues: row.known_issues || [],
    },
  };
}

function mdToEntry(md: any): DevlogEntry {
  return {
    id: md.id || md.slug,
    slug: md.id || md.slug,
    data: {
      projectSlug: md.data.projectSlug,
      version: md.data.version,
      versionStatus: md.data.versionStatus,
      releaseDate: String(md.data.releaseDate),
      summary_cs: md.data.summary_cs || '',
      summary_en: md.data.summary_en || '',
      new_features: md.data.new_features || [],
      fixes: md.data.fixes || [],
      known_issues: md.data.known_issues || [],
    },
  };
}

async function fallbackFromMarkdown(): Promise<DevlogEntry[]> {
  try {
    const devlogs = await getCollection('devlogs');
    return devlogs
      .sort((a, b) => String(b.data.releaseDate).localeCompare(String(a.data.releaseDate)))
      .map(mdToEntry);
  } catch {
    return [];
  }
}

export async function getDevlogs(): Promise<DevlogEntry[]> {
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('devlogs')
    .select('*')
    .order('release_date', { ascending: false });

  if (error || !data || data.length === 0) {
    if (error) console.warn('[devlogs] Supabase unavailable, falling back to markdown:', error.message);
    return fallbackFromMarkdown();
  }
  return data.map(rowToEntry);
}

export async function getDevlogsByProject(projectSlug: string): Promise<DevlogEntry[]> {
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('devlogs')
    .select('*')
    .eq('project_slug', projectSlug)
    .order('version', { ascending: false });

  if (error || !data || data.length === 0) {
    const all = await fallbackFromMarkdown();
    return all.filter((d) => d.data.projectSlug === projectSlug);
  }
  return data.map(rowToEntry);
}

export async function getDevlogBySlug(slug: string): Promise<DevlogEntry | undefined> {
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('devlogs')
    .select('*')
    .eq('devlog_slug', slug)
    .single();

  if (!error && data) return rowToEntry(data);

  const all = await fallbackFromMarkdown();
  return all.find((d) => d.slug === slug);
}
