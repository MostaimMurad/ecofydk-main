-- Add CVR number column to site_settings
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS cvr_number TEXT DEFAULT '';
