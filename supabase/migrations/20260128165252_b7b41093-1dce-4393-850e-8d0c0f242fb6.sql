-- Create storage bucket for site settings (logo, assets)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-settings', 'site-settings', true);

-- RLS: Everyone can view files
CREATE POLICY "Site settings files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-settings');

-- RLS: Only admins can upload
CREATE POLICY "Only admins can upload site settings files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-settings' 
  AND public.is_admin(auth.uid())
);

-- RLS: Only admins can update
CREATE POLICY "Only admins can update site settings files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-settings' 
  AND public.is_admin(auth.uid())
);

-- RLS: Only admins can delete
CREATE POLICY "Only admins can delete site settings files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-settings' 
  AND public.is_admin(auth.uid())
);