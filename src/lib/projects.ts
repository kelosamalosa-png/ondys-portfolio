import { createClient } from '@supabase/supabase-js';
import { getCollection } from 'astro:content';

// Build-time Supabase client (works during astro build)
function getBuildClient() {
  const url = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
  return createClient(url, key);
}

export type Lang = 'cs' | 'en';

export interface ProjectData {
  projectSlug: string;
  status: 'beta' | 'prototype' | 'live';
  category: 'app' | 'tool' | 'web' | 'game';
  featured: boolean;
  year: number;
  title_cs: string;
  title_en: string;
  summary_cs: string;
  summary_en: string;
  body_cs: string;
  body_en: string;
  stack: string[];
  links_website?: string;
  links_demo?: string;
  links_github?: string;
  links_other?: string;
  links_other_label?: string;
  images: string[];
}

export interface ProjectEntry {
  id: string;
  slug: string;
  data: ProjectData;
}

// Map Supabase row → ProjectEntry (compatible with old API)
function rowToEntry(row: any): ProjectEntry {
  return {
    id: row.id,
    slug: row.project_slug,
    data: {
      projectSlug: row.project_slug,
      status: row.status,
      category: row.category,
      featured: row.featured,
      year: row.year,
      title_cs: row.title_cs,
      title_en: row.title_en,
      summary_cs: row.summary_cs,
      summary_en: row.summary_en,
      body_cs: row.body_cs || '',
      body_en: row.body_en || '',
      stack: row.stack || [],
      links_website: row.links_website || '',
      links_demo: row.links_demo || '',
      links_github: row.links_github || '',
      links_other: row.links_other || '',
      links_other_label: row.links_other_label || '',
      images: row.images || [],
    },
  };
}

// Fallback: read from Astro Content Collections (markdown files)
function mdToEntry(md: any): ProjectEntry {
  return {
    id: md.id || md.slug,
    slug: md.data.projectSlug,
    data: {
      projectSlug: md.data.projectSlug,
      status: md.data.status,
      category: md.data.category,
      featured: md.data.featured,
      year: md.data.year,
      title_cs: md.data.title_cs,
      title_en: md.data.title_en,
      summary_cs: md.data.summary_cs,
      summary_en: md.data.summary_en,
      body_cs: md.data.body_cs || '',
      body_en: md.data.body_en || '',
      stack: md.data.stack || [],
      links_website: md.data.links_website || '',
      links_demo: md.data.links_demo || '',
      links_github: md.data.links_github || '',
      links_other: md.data.links_other || '',
      links_other_label: md.data.links_other_label || '',
      images: md.data.images || [],
    },
  };
}

async function fallbackFromMarkdown(): Promise<ProjectEntry[]> {
  try {
    const projects = await getCollection('projects');
    return projects
      .sort((a, b) => {
        if (b.data.year !== a.data.year) return b.data.year - a.data.year;
        return a.data.title_en.localeCompare(b.data.title_en);
      })
      .map(mdToEntry);
  } catch {
    return [];
  }
}

export async function getProjects(): Promise<ProjectEntry[]> {
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('projects')
    .select('*')
    .order('year', { ascending: false })
    .order('title_en', { ascending: true });

  if (error || !data || data.length === 0) {
    if (error) console.warn('[projects] Supabase unavailable, falling back to markdown:', error.message);
    return fallbackFromMarkdown();
  }
  return data.map(rowToEntry);
}

export async function getProject(slug: string): Promise<ProjectEntry | undefined> {
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('projects')
    .select('*')
    .eq('project_slug', slug)
    .single();

  if (!error && data) return rowToEntry(data);

  // Fallback to markdown
  const all = await fallbackFromMarkdown();
  return all.find(p => p.data.projectSlug === slug);
}

export async function getFeaturedProjects(limit?: number): Promise<ProjectEntry[]> {
  const sb = getBuildClient();
  let query = sb
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('year', { ascending: false })
    .order('title_en', { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (!error && data && data.length > 0) {
    return data.map(rowToEntry);
  }

  // Fallback to markdown
  const all = await fallbackFromMarkdown();
  const featured = all.filter(p => p.data.featured);
  return limit ? featured.slice(0, limit) : featured;
}

export async function getProjectsByCategory(category: ProjectData['category']): Promise<ProjectEntry[]> {
  const sb = getBuildClient();
  const { data, error } = await sb
    .from('projects')
    .select('*')
    .eq('category', category)
    .order('year', { ascending: false });

  if (!error && data && data.length > 0) {
    return data.map(rowToEntry);
  }

  const all = await fallbackFromMarkdown();
  return all.filter(p => p.data.category === category);
}

export function getLocalizedTitle(project: ProjectEntry, lang: Lang): string {
  return lang === 'cs' ? project.data.title_cs : project.data.title_en;
}

export function getLocalizedSummary(project: ProjectEntry, lang: Lang): string {
  return lang === 'cs' ? project.data.summary_cs : project.data.summary_en;
}

export function getStatusLabel(status: ProjectData['status'], lang: Lang): string {
  const labels: Record<ProjectData['status'], { cs: string; en: string }> = {
    live: { cs: 'Živě', en: 'Live' },
    beta: { cs: 'Beta', en: 'Beta' },
    prototype: { cs: 'Prototyp', en: 'Prototype' },
  };
  return labels[status][lang];
}

export function getCategoryLabel(category: ProjectData['category'], lang: Lang): string {
  const labels: Record<ProjectData['category'], { cs: string; en: string }> = {
    app: { cs: 'Aplikace', en: 'App' },
    tool: { cs: 'Nástroj', en: 'Tool' },
    web: { cs: 'Web', en: 'Web' },
    game: { cs: 'Hra', en: 'Game' },
  };
  return labels[category][lang];
}
