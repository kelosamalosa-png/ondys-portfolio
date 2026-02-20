-- ============================================
-- Tables for Services, Skills, Devlogs
-- Run AFTER 001_projects_table.sql
-- ============================================

-- ---- SKILLS ----
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skill_slug TEXT UNIQUE NOT NULL,
  "order" INTEGER DEFAULT 0,
  title_cs TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_cs TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skills_read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "skills_write" ON public.skills FOR ALL USING (auth.role() = 'authenticated');

-- ---- SERVICES ----
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_slug TEXT UNIQUE NOT NULL,
  slug_cs TEXT NOT NULL DEFAULT '',
  slug_en TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '',
  "order" INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT true,
  title_cs TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_cs TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  badge_cs TEXT DEFAULT '',
  badge_en TEXT DEFAULT '',
  price_cs TEXT DEFAULT '',
  price_en TEXT DEFAULT '',
  price_note_cs TEXT DEFAULT '',
  price_note_en TEXT DEFAULT '',
  related_project TEXT DEFAULT '',
  seo_title_cs TEXT DEFAULT '',
  seo_title_en TEXT DEFAULT '',
  seo_description_cs TEXT DEFAULT '',
  seo_description_en TEXT DEFAULT '',
  body_cs TEXT DEFAULT '',
  body_en TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_read" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_write" ON public.services FOR ALL USING (auth.role() = 'authenticated');

-- ---- DEVLOGS ----
CREATE TABLE IF NOT EXISTS public.devlogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  devlog_slug TEXT UNIQUE NOT NULL,
  project_slug TEXT NOT NULL,
  version TEXT NOT NULL,
  version_status TEXT NOT NULL DEFAULT 'beta',
  release_date TEXT NOT NULL,
  summary_cs TEXT DEFAULT '',
  summary_en TEXT DEFAULT '',
  new_features JSONB DEFAULT '[]',
  fixes JSONB DEFAULT '[]',
  known_issues JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.devlogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "devlogs_read" ON public.devlogs FOR SELECT USING (true);
CREATE POLICY "devlogs_write" ON public.devlogs FOR ALL USING (auth.role() = 'authenticated');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'skills_updated_at') THEN
    CREATE TRIGGER skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'services_updated_at') THEN
    CREATE TRIGGER services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'devlogs_updated_at') THEN
    CREATE TRIGGER devlogs_updated_at BEFORE UPDATE ON public.devlogs FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;
