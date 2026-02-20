import { supabase } from './supabase';

export interface ProjectRow {
  id: string;
  project_slug: string;
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
  links_website: string;
  links_demo: string;
  links_github: string;
  links_other: string;
  links_other_label: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export type ProjectInsert = Omit<ProjectRow, 'id' | 'created_at' | 'updated_at'>;
export type ProjectUpdate = Partial<ProjectInsert>;

// ---- READ ----

export async function fetchAllProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('year', { ascending: false })
    .order('title_en', { ascending: true });

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);
  return data || [];
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectRow | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('project_slug', slug)
    .single();

  if (error) return null;
  return data;
}

export async function fetchFeaturedProjects(limit?: number): Promise<ProjectRow[]> {
  let query = supabase
    .from('projects')
    .select('*')
    .eq('featured', true)
    .order('year', { ascending: false })
    .order('title_en', { ascending: true });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch featured projects: ${error.message}`);
  return data || [];
}

// ---- WRITE (admin only, requires auth) ----

export async function createProject(project: ProjectInsert): Promise<ProjectRow> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw new Error(`Failed to create project: ${error.message}`);
  return data;
}

export async function updateProject(id: string, updates: ProjectUpdate): Promise<ProjectRow> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update project: ${error.message}`);
  return data;
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete project: ${error.message}`);
}

// ---- IMAGE UPLOAD ----

export async function uploadProjectImage(
  projectSlug: string,
  file: File
): Promise<string> {
  const ext = file.name.split('.').pop() || 'png';
  const fileName = `${projectSlug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from('project-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw new Error(`Failed to upload image: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from('project-images')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

export async function deleteProjectImage(imageUrl: string): Promise<void> {
  const path = imageUrl.split('/project-images/')[1];
  if (!path) return;

  const { error } = await supabase.storage
    .from('project-images')
    .remove([path]);

  if (error) throw new Error(`Failed to delete image: ${error.message}`);
}
