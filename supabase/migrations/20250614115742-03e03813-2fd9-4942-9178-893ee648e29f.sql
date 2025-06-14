
-- Create a storage bucket for incident files with specific constraints
-- This bucket will store driver licenses and incident proofs.
-- It's public, with a 5MB file size limit, and allows common image, PDF, and video formats.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('incident_files', 'incident_files', true, 5242880, ARRAY['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'])
ON CONFLICT (id) DO UPDATE 
SET public = true, file_size_limit = 5242880, allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];

-- Drop existing policies if they exist to avoid errors when re-running this script.
DROP POLICY IF EXISTS "Public read access for incident files." ON storage.objects;
-- Create a policy that allows public read access to all files in the bucket.
CREATE POLICY "Public read access for incident files."
ON storage.objects FOR SELECT
USING ( bucket_id = 'incident_files' );

DROP POLICY IF EXISTS "Anyone can upload incident files." ON storage.objects;
-- Create a policy that allows anyone to upload files to the bucket.
-- This is needed for both anonymous and logged-in users submitting reports.
CREATE POLICY "Anyone can upload incident files."
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'incident_files' );

-- Add columns to the 'reports' table to store file URLs.
-- Using 'IF NOT EXISTS' prevents errors if the columns were already added.
ALTER TABLE public.reports
ADD COLUMN IF NOT EXISTS driver_id_license_url TEXT,
ADD COLUMN IF NOT EXISTS incident_proofs_urls TEXT[];
