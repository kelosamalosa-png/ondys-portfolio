-- ============================================
-- Projects table for ONDYS.DEV admin CMS
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_slug TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'prototype' CHECK (status IN ('beta', 'prototype', 'live')),
  category TEXT NOT NULL DEFAULT 'app' CHECK (category IN ('app', 'tool', 'web', 'game')),
  featured BOOLEAN DEFAULT false,
  year INTEGER NOT NULL DEFAULT 2025,
  title_cs TEXT NOT NULL,
  title_en TEXT NOT NULL,
  summary_cs TEXT NOT NULL DEFAULT '',
  summary_en TEXT NOT NULL DEFAULT '',
  body_cs TEXT NOT NULL DEFAULT '',
  body_en TEXT NOT NULL DEFAULT '',
  stack TEXT[] DEFAULT '{}',
  links_website TEXT DEFAULT '',
  links_demo TEXT DEFAULT '',
  links_github TEXT DEFAULT '',
  links_other TEXT DEFAULT '',
  links_other_label TEXT DEFAULT '',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 3. Public read (for Astro build + frontend)
CREATE POLICY "Public can read projects"
  ON public.projects FOR SELECT
  USING (true);

-- 4. Authenticated users can insert/update/delete
CREATE POLICY "Auth users can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Auth users can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (true);

-- 5. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 6. Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage policies - public read
CREATE POLICY "Public can view project images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

-- 8. Storage policies - authenticated upload/delete
CREATE POLICY "Auth users can upload project images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Auth users can update project images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Auth users can delete project images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');
