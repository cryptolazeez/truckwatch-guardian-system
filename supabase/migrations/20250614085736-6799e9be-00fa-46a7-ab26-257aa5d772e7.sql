
-- 1. Create ENUM for report statuses
CREATE TYPE public.report_status_enum AS ENUM (
  'Pending',
  'Reviewed',
  'Resolved',
  'Rejected'
);

-- 2. Create ENUM for incident types
CREATE TYPE public.incident_type_enum AS ENUM (
  'aggressive_driving',
  'reckless_driving',
  'road_rage',
  'unsafe_lane_change',
  'speeding',
  'tailgating',
  'distracted_driving',
  'failure_to_signal',
  'blocking_traffic',
  'employment_defaults',
  'safety_violations',
  'theft_criminal_activities',
  'professional_misconduct',
  'other'
);

-- 3. Create the 'reports' table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reporter_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, -- User who submitted the report
  
  -- Driver Information
  driver_first_name TEXT,
  driver_last_name TEXT,
  cdl_number TEXT NOT NULL,
  
  -- Incident Information
  incident_type public.incident_type_enum NOT NULL,
  date_occurred DATE NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Company Information (of the company making the report)
  company_name_making_report TEXT NOT NULL,
  company_phone_making_report TEXT,
  company_email_making_report TEXT,

  -- Report Status
  status public.report_status_enum NOT NULL DEFAULT 'Pending'
);

-- Enable RLS on the reports table
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 4. Helper function to get the company name of the current user
-- This helps simplify RLS policies and ensures they run with appropriate permissions.
CREATE OR REPLACE FUNCTION public.get_current_user_company_name()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER SET search_path = public
AS $$
  SELECT company_name FROM public.profiles WHERE id = auth.uid();
$$;

-- 5. RLS Policies for 'reports' table

-- Policy: Allow authenticated users to insert new reports.
-- The reporter_profile_id will be set by the application to the user's profile ID.
-- The company_name_making_report will be set from the form data.
CREATE POLICY "Users can insert their own reports"
  ON public.reports
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated'); -- Ensures user is logged in

-- Policy: Users can view reports submitted by their own company.
CREATE POLICY "Users can view reports from their own company"
  ON public.reports
  FOR SELECT
  USING (public.get_current_user_company_name() = company_name_making_report);

-- Policy: Users can update reports they submitted.
CREATE POLICY "Users can update their own submitted reports"
  ON public.reports
  FOR UPDATE
  USING (reporter_profile_id = auth.uid()) -- auth.uid() is the user's auth ID, which is also profiles.id
  WITH CHECK (reporter_profile_id = auth.uid());

-- Policy: Users can delete reports they submitted.
CREATE POLICY "Users can delete their own submitted reports"
  ON public.reports
  FOR DELETE
  USING (reporter_profile_id = auth.uid());

-- Create an index on company_name_making_report for faster lookups by company
CREATE INDEX idx_reports_company_name_making_report ON public.reports(company_name_making_report);

-- Create an index on reporter_profile_id for faster lookups by reporter
CREATE INDEX idx_reports_reporter_profile_id ON public.reports(reporter_profile_id);

