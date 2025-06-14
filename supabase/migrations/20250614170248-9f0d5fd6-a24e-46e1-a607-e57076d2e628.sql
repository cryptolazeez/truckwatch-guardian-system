
-- Create an ENUM type for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator');

-- Create a table to store user roles
CREATE TABLE public.user_roles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.app_role NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create a function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(p_user_id uuid, p_role public.app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if a user has the specified role
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = p_user_id AND role = p_role
  );
END;
$$;

-- Enable Row Level Security on the reports table
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policies for the 'reports' table

-- 1. Public users can view reports with the status 'Resolved'
CREATE POLICY "Public can view resolved reports" ON public.reports
FOR SELECT USING (status = 'Resolved');

-- 2. Moderators can view all reports, regardless of status
CREATE POLICY "Moderators can view all reports" ON public.reports
FOR SELECT USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

-- 3. Moderators can update reports (e.g., change their status)
CREATE POLICY "Moderators can update reports" ON public.reports
FOR UPDATE USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

-- 4. Moderators can delete reports
CREATE POLICY "Moderators can delete reports" ON public.reports
FOR DELETE USING (public.has_role(auth.uid(), 'moderator') OR public.has_role(auth.uid(), 'admin'));

-- 5. Anyone can create (insert) a new report
CREATE POLICY "Anyone can create reports" ON public.reports
FOR INSERT WITH CHECK (true);


-- Enable Row Level Security on the user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policies for the 'user_roles' table

-- 1. Admins can manage all user roles
CREATE POLICY "Admins can manage roles" ON public.user_roles
FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 2. Users can view their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);
