-- ============================================
-- FIX: Replace broken RLS policies on skills, services, devlogs
-- Run this if you already ran the old 003 migration
-- ============================================

-- ---- DROP old broken policies ----
DROP POLICY IF EXISTS "skills_read" ON public.skills;
DROP POLICY IF EXISTS "skills_write" ON public.skills;
DROP POLICY IF EXISTS "services_read" ON public.services;
DROP POLICY IF EXISTS "services_write" ON public.services;
DROP POLICY IF EXISTS "devlogs_read" ON public.devlogs;
DROP POLICY IF EXISTS "devlogs_write" ON public.devlogs;

-- Also drop the new-style names in case they already exist
DROP POLICY IF EXISTS "Public can read skills" ON public.skills;
DROP POLICY IF EXISTS "Auth users can insert skills" ON public.skills;
DROP POLICY IF EXISTS "Auth users can update skills" ON public.skills;
DROP POLICY IF EXISTS "Auth users can delete skills" ON public.skills;
DROP POLICY IF EXISTS "Public can read services" ON public.services;
DROP POLICY IF EXISTS "Auth users can insert services" ON public.services;
DROP POLICY IF EXISTS "Auth users can update services" ON public.services;
DROP POLICY IF EXISTS "Auth users can delete services" ON public.services;
DROP POLICY IF EXISTS "Public can read devlogs" ON public.devlogs;
DROP POLICY IF EXISTS "Auth users can insert devlogs" ON public.devlogs;
DROP POLICY IF EXISTS "Auth users can update devlogs" ON public.devlogs;
DROP POLICY IF EXISTS "Auth users can delete devlogs" ON public.devlogs;

-- ---- SKILLS: correct policies ----
CREATE POLICY "Public can read skills"
  ON public.skills FOR SELECT
  USING (true);

CREATE POLICY "Auth users can insert skills"
  ON public.skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can update skills"
  ON public.skills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Auth users can delete skills"
  ON public.skills FOR DELETE
  TO authenticated
  USING (true);

-- ---- SERVICES: correct policies ----
CREATE POLICY "Public can read services"
  ON public.services FOR SELECT
  USING (true);

CREATE POLICY "Auth users can insert services"
  ON public.services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can update services"
  ON public.services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Auth users can delete services"
  ON public.services FOR DELETE
  TO authenticated
  USING (true);

-- ---- DEVLOGS: correct policies ----
CREATE POLICY "Public can read devlogs"
  ON public.devlogs FOR SELECT
  USING (true);

CREATE POLICY "Auth users can insert devlogs"
  ON public.devlogs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Auth users can update devlogs"
  ON public.devlogs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Auth users can delete devlogs"
  ON public.devlogs FOR DELETE
  TO authenticated
  USING (true);
