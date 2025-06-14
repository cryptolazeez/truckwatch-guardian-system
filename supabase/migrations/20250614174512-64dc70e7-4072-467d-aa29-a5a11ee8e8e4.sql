
-- Add a new 'info_requested' status to the report_status enum
ALTER TYPE public.report_status_enum ADD VALUE IF NOT EXISTS 'info_requested';

-- Add a new column to store notes from moderators on a report
ALTER TABLE public.reports ADD COLUMN moderator_notes TEXT;
