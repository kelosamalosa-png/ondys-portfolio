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

// ==================== TESTIMONIALS ====================

export interface TestimonialRow {
  id: string;
  order: number;
  visible: boolean;
  name: string;
  role_cs: string;
  role_en: string;
  company: string;
  avatar_url: string;
  text_cs: string;
  text_en: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export type TestimonialInsert = Omit<TestimonialRow, 'id' | 'created_at' | 'updated_at'>;
export type TestimonialUpdate = Partial<TestimonialInsert>;

export async function fetchAllTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabase.rpc('get_all_testimonials');
  if (error) throw new Error(`Failed to fetch testimonials: ${error.message}`);
  return data || [];
}

export async function createTestimonial(t: TestimonialInsert): Promise<TestimonialRow> {
  const { data, error } = await supabase.rpc('insert_testimonial', {
    p_order: t.order, p_visible: t.visible, p_name: t.name,
    p_role_cs: t.role_cs, p_role_en: t.role_en, p_company: t.company,
    p_avatar_url: t.avatar_url, p_text_cs: t.text_cs, p_text_en: t.text_en, p_rating: t.rating,
  });
  if (error) throw new Error(`Failed to create testimonial: ${error.message}`);
  return data;
}

export async function updateTestimonial(id: string, updates: TestimonialUpdate): Promise<TestimonialRow> {
  const current = (await supabase.rpc('get_all_testimonials')).data?.find((r: any) => r.id === id);
  const merged = { ...current, ...updates };
  const { data, error } = await supabase.rpc('update_testimonial', {
    p_id: id, p_order: merged.order, p_visible: merged.visible, p_name: merged.name,
    p_role_cs: merged.role_cs, p_role_en: merged.role_en, p_company: merged.company,
    p_avatar_url: merged.avatar_url, p_text_cs: merged.text_cs, p_text_en: merged.text_en, p_rating: merged.rating,
  });
  if (error) throw new Error(`Failed to update testimonial: ${error.message}`);
  return data;
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.rpc('delete_testimonial', { p_id: id });
  if (error) throw new Error(`Failed to delete testimonial: ${error.message}`);
}

// ==================== SITE STATS ====================

export interface SiteStatRow {
  id: string;
  stat_key: string;
  value_cs: string;
  value_en: string;
  label_cs: string;
  label_en: string;
  order: number;
  icon: string;
  created_at: string;
  updated_at: string;
}

export type SiteStatInsert = Omit<SiteStatRow, 'id' | 'created_at' | 'updated_at'>;
export type SiteStatUpdate = Partial<SiteStatInsert>;

export async function fetchAllSiteStats(): Promise<SiteStatRow[]> {
  const { data, error } = await supabase.rpc('get_all_site_stats');
  if (error) throw new Error(`Failed to fetch site stats: ${error.message}`);
  return data || [];
}

export async function createSiteStat(stat: SiteStatInsert): Promise<SiteStatRow> {
  const { data, error } = await supabase.rpc('insert_site_stat', {
    p_stat_key: stat.stat_key, p_value_cs: stat.value_cs, p_value_en: stat.value_en,
    p_label_cs: stat.label_cs, p_label_en: stat.label_en, p_order: stat.order, p_icon: stat.icon,
  });
  if (error) throw new Error(`Failed to create site stat: ${error.message}`);
  return data;
}

export async function updateSiteStat(id: string, updates: SiteStatUpdate): Promise<SiteStatRow> {
  const current = (await supabase.rpc('get_all_site_stats')).data?.find((r: any) => r.id === id);
  const merged = { ...current, ...updates };
  const { data, error } = await supabase.rpc('update_site_stat', {
    p_id: id, p_stat_key: merged.stat_key, p_value_cs: merged.value_cs, p_value_en: merged.value_en,
    p_label_cs: merged.label_cs, p_label_en: merged.label_en, p_order: merged.order, p_icon: merged.icon,
  });
  if (error) throw new Error(`Failed to update site stat: ${error.message}`);
  return data;
}

export async function deleteSiteStat(id: string): Promise<void> {
  const { error } = await supabase.rpc('delete_site_stat', { p_id: id });
  if (error) throw new Error(`Failed to delete site stat: ${error.message}`);
}
