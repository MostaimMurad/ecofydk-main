-- Add more site settings columns
ALTER TABLE public.site_settings
ADD COLUMN site_title_en text DEFAULT 'Ecofy',
ADD COLUMN site_title_da text DEFAULT 'Ecofy',
ADD COLUMN site_tagline_en text DEFAULT 'Sustainable Jute Products from Bangladesh',
ADD COLUMN site_tagline_da text DEFAULT 'Bæredygtige juteprodukter fra Bangladesh',
ADD COLUMN logo_url text,
ADD COLUMN footer_text_en text DEFAULT 'Crafting sustainable stories since 2019',
ADD COLUMN footer_text_da text DEFAULT 'Skaber bæredygtige historier siden 2019',
ADD COLUMN contact_email text DEFAULT 'hello@ecofy.dk',
ADD COLUMN contact_phone text DEFAULT '+45 12 34 56 78',
ADD COLUMN contact_address text DEFAULT 'Copenhagen, Denmark',
ADD COLUMN social_facebook text,
ADD COLUMN social_instagram text,
ADD COLUMN social_linkedin text,
ADD COLUMN social_twitter text;