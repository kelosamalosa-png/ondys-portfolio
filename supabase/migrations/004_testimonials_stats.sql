-- ============================================
-- Testimonials + Site Stats tables
-- ============================================

-- ---- TESTIMONIALS ----
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "order" INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  name TEXT NOT NULL,
  role_cs TEXT NOT NULL DEFAULT '',
  role_en TEXT NOT NULL DEFAULT '',
  company TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  text_cs TEXT NOT NULL,
  text_en TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read testimonials"
  ON public.testimonials FOR SELECT
  USING (true);

CREATE POLICY "Auth users can insert testimonials"
  ON public.testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Auth users can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (true);

-- ---- SITE STATS ----
CREATE TABLE IF NOT EXISTS public.site_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_key TEXT UNIQUE NOT NULL,
  value_cs TEXT NOT NULL,
  value_en TEXT NOT NULL,
  label_cs TEXT NOT NULL,
  label_en TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  icon TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site_stats"
  ON public.site_stats FOR SELECT
  USING (true);

CREATE POLICY "Auth users can insert site_stats"
  ON public.site_stats FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can update site_stats"
  ON public.site_stats FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Auth users can delete site_stats"
  ON public.site_stats FOR DELETE
  TO authenticated
  USING (true);

-- Triggers
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'testimonials_updated_at') THEN
    CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'site_stats_updated_at') THEN
    CREATE TRIGGER site_stats_updated_at BEFORE UPDATE ON public.site_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- Seed default stats
INSERT INTO public.site_stats (stat_key, value_cs, value_en, label_cs, label_en, "order", icon) VALUES
  ('years', '3+', '3+', 'Let zkušeností', 'Years Experience', 1, '📅'),
  ('projects', '10+', '10+', 'Projektů', 'Projects', 2, '🚀'),
  ('clients', '5+', '5+', 'Spokojených klientů', 'Happy Clients', 3, '🤝'),
  ('tech', '15+', '15+', 'Technologií', 'Technologies', 4, '⚡')
ON CONFLICT (stat_key) DO NOTHING;
