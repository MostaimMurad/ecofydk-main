-- Create site settings table for storing configuration like hero variant
CREATE TABLE public.site_settings (
    id text PRIMARY KEY DEFAULT 'global',
    hero_variant text NOT NULL DEFAULT 'video',
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed for public pages)
CREATE POLICY "Settings are publicly readable"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can update settings"
ON public.site_settings
FOR UPDATE
USING (is_admin(auth.uid()));

-- Only admins can insert settings
CREATE POLICY "Admins can insert settings"
ON public.site_settings
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Insert default settings
INSERT INTO public.site_settings (id, hero_variant) VALUES ('global', 'video');