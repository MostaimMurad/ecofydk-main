-- Add extended product fields for dynamic content sections
-- These JSONB columns store per-product data for:
--   composition: Material breakdown items
--   origin_supplier: Supplier info, location, certs, artisan story
--   esg_impact: ESG metrics + SDG goals
--   governance: Certifications, compliance checks, QA statement

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS composition JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS origin_supplier JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS esg_impact JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS governance JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS section_visibility JSONB DEFAULT '{"specs":true,"use_cases":true,"origin":true,"esg":true,"governance":true}'::jsonb;

-- Allow admins to manage categories
CREATE POLICY "Admins can manage categories"
  ON public.product_categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );

-- Allow admins to manage products (insert/update/delete)
CREATE POLICY "Admins can manage products"
  ON public.products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'editor')
    )
  );
