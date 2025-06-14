
-- 1. Make reporter_profile_id nullable
ALTER TABLE public.reports ALTER COLUMN reporter_profile_id DROP NOT NULL;

-- 2. Drop the existing foreign key constraint on reporter_profile_id
-- Note: The constraint name might vary. If this fails, we may need to find the exact name first.
-- Assuming the auto-generated name or a common pattern:
ALTER TABLE public.reports DROP CONSTRAINT IF EXISTS reports_reporter_profile_id_fkey;

-- 3. Re-add the foreign key constraint with ON DELETE SET NULL
ALTER TABLE public.reports 
ADD CONSTRAINT reports_reporter_profile_id_fkey 
FOREIGN KEY (reporter_profile_id) 
REFERENCES public.profiles(id) 
ON DELETE SET NULL;

-- 4. Drop existing RLS policies that require authentication or specific user context
DROP POLICY IF EXISTS "Users can insert their own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view reports from their own company" ON public.reports;
DROP POLICY IF EXISTS "Users can update their own submitted reports" ON public.reports;
DROP POLICY IF EXISTS "Users can delete their own submitted reports" ON public.reports;

-- 5. Create new RLS policy to allow anyone to insert reports
CREATE POLICY "Anyone can insert reports"
  ON public.reports
  FOR INSERT
  WITH CHECK (true);

-- 6. Create new RLS policy to allow anyone to view all reports
CREATE POLICY "Anyone can view all reports"
  ON public.reports
  FOR SELECT
  USING (true);

-- Note: Update and Delete policies for general users are removed.
-- These operations would typically be handled by privileged roles/admin interface in an open system.
