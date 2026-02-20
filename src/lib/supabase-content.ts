import { supabase } from './supabase';

// ==================== SKILLS ====================

export interface SkillRow {
  id: string;
  skill_slug: string;
  order: number;
  title_cs: string;
  title_en: string;
  description_cs: string;
  description_en: string;
  created_at: string;
  updated_at: string;
}

export type SkillInsert = Omit<SkillRow, 'id' | 'created_at' | 'updated_at'>;
export type SkillUpdate = Partial<SkillInsert>;

export async function fetchAllSkills(): Promise<SkillRow[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('order', { ascending: true });
  if (error) throw new Error(`Failed to fetch skills: ${error.message}`);
  return data || [];
}

export async function createSkill(skill: SkillInsert): Promise<SkillRow> {
  const { data, error } = await supabase.from('skills').insert(skill).select().single();
  if (error) throw new Error(`Failed to create skill: ${error.message}`);
  return data;
}

export async function updateSkill(id: string, updates: SkillUpdate): Promise<SkillRow> {
  const { data, error } = await supabase.from('skills').update(updates).eq('id', id).select().single();
  if (error) throw new Error(`Failed to update skill: ${error.message}`);
  return data;
}

export async function deleteSkill(id: string): Promise<void> {
  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete skill: ${error.message}`);
}

// ==================== SERVICES ====================

export interface ServiceRow {
  id: string;
  service_slug: string;
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
  badge_cs: string;
  badge_en: string;
  price_cs: string;
  price_en: string;
  price_note_cs: string;
  price_note_en: string;
  related_project: string;
  seo_title_cs: string;
  seo_title_en: string;
  seo_description_cs: string;
  seo_description_en: string;
  body_cs: string;
  body_en: string;
  created_at: string;
  updated_at: string;
}

export type ServiceInsert = Omit<ServiceRow, 'id' | 'created_at' | 'updated_at'>;
export type ServiceUpdate = Partial<ServiceInsert>;

export async function fetchAllServices(): Promise<ServiceRow[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('order', { ascending: true });
  if (error) throw new Error(`Failed to fetch services: ${error.message}`);
  return data || [];
}

export async function createService(service: ServiceInsert): Promise<ServiceRow> {
  const { data, error } = await supabase.from('services').insert(service).select().single();
  if (error) throw new Error(`Failed to create service: ${error.message}`);
  return data;
}

export async function updateService(id: string, updates: ServiceUpdate): Promise<ServiceRow> {
  const { data, error } = await supabase.from('services').update(updates).eq('id', id).select().single();
  if (error) throw new Error(`Failed to update service: ${error.message}`);
  return data;
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete service: ${error.message}`);
}

// ==================== DEVLOGS ====================

export interface DevlogFeature {
  cs: string;
  en: string;
}

export interface DevlogRow {
  id: string;
  devlog_slug: string;
  project_slug: string;
  version: string;
  version_status: 'alpha' | 'beta' | 'stable';
  release_date: string;
  summary_cs: string;
  summary_en: string;
  new_features: DevlogFeature[];
  fixes: DevlogFeature[];
  known_issues: DevlogFeature[];
  created_at: string;
  updated_at: string;
}

export type DevlogInsert = Omit<DevlogRow, 'id' | 'created_at' | 'updated_at'>;
export type DevlogUpdate = Partial<DevlogInsert>;

export async function fetchAllDevlogs(): Promise<DevlogRow[]> {
  const { data, error } = await supabase
    .from('devlogs')
    .select('*')
    .order('release_date', { ascending: false });
  if (error) throw new Error(`Failed to fetch devlogs: ${error.message}`);
  return data || [];
}

export async function createDevlog(devlog: DevlogInsert): Promise<DevlogRow> {
  const { data, error } = await supabase.from('devlogs').insert(devlog).select().single();
  if (error) throw new Error(`Failed to create devlog: ${error.message}`);
  return data;
}

export async function updateDevlog(id: string, updates: DevlogUpdate): Promise<DevlogRow> {
  const { data, error } = await supabase.from('devlogs').update(updates).eq('id', id).select().single();
  if (error) throw new Error(`Failed to update devlog: ${error.message}`);
  return data;
}

export async function deleteDevlog(id: string): Promise<void> {
  const { error } = await supabase.from('devlogs').delete().eq('id', id);
  if (error) throw new Error(`Failed to delete devlog: ${error.message}`);
}
