
-- Fix broken blog cover images with more reliable Unsplash URLs
UPDATE blog_posts 
SET cover_image = CASE slug
  WHEN 'the-art-of-jute-craftsmanship' THEN 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1920&h=1080&fit=crop'
  WHEN 'meet-our-master-weaver-fatima' THEN 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1920&h=1080&fit=crop&crop=center'
  WHEN 'ecofy-expands-to-nordic-markets' THEN 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&h=1080&fit=crop'
  WHEN '5-ways-to-style-jute-bags' THEN 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1920&h=1080&fit=crop'
  ELSE cover_image
END
WHERE slug IN ('the-art-of-jute-craftsmanship', 'meet-our-master-weaver-fatima', 'ecofy-expands-to-nordic-markets', '5-ways-to-style-jute-bags');
