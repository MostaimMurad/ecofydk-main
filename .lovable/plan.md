
# CMS Dynamic Content Audit - Hardcoded Content List

## Currently Dynamic (Already CMS Connected)
- Header: Site title, logo (from `site_settings`)
- Footer: Site title, footer text, contact info, social links (from `site_settings`)
- Products: All data from `products` table
- Blog/Journal: All data from `blog_posts` table
- Product Categories: From `product_categories` table
- Hero variant selection: From `site_settings.hero_variant`
- Navigation labels: From `LanguageContext` translations

---

## Not Yet Dynamic - Full List

### 1. HOME PAGE - About Section (`AboutSection.tsx`)
**Hardcoded items:**
- Stats: "5+ Years of Excellence", "500+ Artisans Supported", "15+ Countries Reached"
- Image URL (Unsplash placeholder)
- Feature bullet points (3 items)
- Badge text "About Us" / "Om Os"

### 2. HOME PAGE - Sustainability Highlights (`SustainabilityHighlights.tsx`)
**Hardcoded items:**
- 3 highlight cards (Eco-Friendly, Artisan Support, Zero Waste) with colors
- Stats: "100% Biodegradable", "50+ Artisan Partners", "0 Carbon Footprint"
- Badge text "Our Commitment" / "Vores Engagement"
- Section subtitle text

### 3. HOME PAGE - Testimonials (`Testimonials.tsx`)
**Hardcoded items:**
- 3 testimonials (Lars Jensen, Emma Sorensen, Mikkel Andersen) with names, companies, roles, reviews, images
- Section subtitle text

### 4. HOME PAGE - FAQ (`FAQ.tsx`)
**Hardcoded items:**
- 6 FAQ questions & answers (stored in `LanguageContext` translations)
- FAQ icons

### 5. HOME PAGE - Newsletter (`Newsletter.tsx`)
**Hardcoded items:**
- Trust indicators text ("No spam, ever", "Unsubscribe anytime", "Weekly updates")
- Badge text "Stay Connected" / "Hold Forbindelsen"
- Newsletter subscription is not saved to database

### 6. HERO SECTION - HeroContent (`HeroContent.tsx`)
**Hardcoded items:**
- "Since 2020" text
- Badge text "Premium Sustainable Jute" / "Premium Baeredygtig Jute"
- Stats: "50+ Products", "100% Sustainable", "500+ Happy Clients"

### 7. CONTACT PAGE (`Contact.tsx`)
**Hardcoded items:**
- Contact info (address: "Copenhagen, Denmark", email: "info@ecofy.dk", phone: "+45 12 34 56 78") -- not using `site_settings`
- Business hours "Mon - Fri: 9:00 AM - 5:00 PM (CET)"
- WhatsApp number "+4520123456"
- Badge text "We Respond Within 24 Hours"

### 8. CONTACT PAGE - Office Locations (`OfficeLocations.tsx`)
**Hardcoded items:**
- 2 offices (Copenhagen HQ, Bangladesh Office) with addresses, coordinates, flags
- Office names, types, addresses

### 9. OUR STORY PAGE (`OurStory.tsx`)
**Hardcoded items:**
- Timeline events (2018-2024) - 5 items
- Values (4 items: Sustainability, Quality, Community, Transparency)
- 3 Artisans (Fatima Begum, Karim Mia, Rashida Khatun) with images, roles, years
- Stats: "500+", "50+", "15+", "100%"
- Badge text "Since 2018" / "Siden 2018"
- Artisan impact section text
- Testimonial quote in CTA section

### 10. SUSTAINABILITY PAGE (`Sustainability.tsx`)
**Hardcoded items:**
- 6 sustainability practices with icons and colors
- 4 carbon stats ("85%", "0", "100%", "50+")
- 4 certifications (OEKO-TEX, Fair Trade, ISO 14001, GOTS)
- 4 UN SDG goals (8, 12, 13, 15)
- Supply chain steps (4 steps)
- CTA section text

### 11. FOOTER (`Footer.tsx`)
**Hardcoded items:**
- Certifications list (ISO 14001, Fair Trade, GOTS, OEKO-TEX) with colors
- "Made with heart for the planet" text

### 12. LANGUAGE CONTEXT (`LanguageContext.tsx`)
**Hardcoded items:**
- All ~200+ translation strings are hardcoded in the file
- Not manageable from CMS

---

## Priority Ranking (Impact vs Effort)

### HIGH Priority (Frequently Updated Content)
| # | Section | New Table(s) Needed |
|---|---------|-------------------|
| 1 | Testimonials | `testimonials` |
| 2 | FAQ | `faqs` |
| 3 | Contact Info (use existing `site_settings`) | No new table |
| 4 | Office Locations | `office_locations` |

### MEDIUM Priority (Occasionally Updated)
| # | Section | New Table(s) Needed |
|---|---------|-------------------|
| 5 | About Section (stats, features) | `home_sections` or `page_content` |
| 6 | Our Story Page (timeline, values, artisans) | `timeline_events`, `team_members` |
| 7 | Hero Content (stats, badge text) | Extend `site_settings` |
| 8 | Sustainability Highlights | `sustainability_content` or generic CMS |
| 9 | Newsletter (save to DB) | `newsletter_subscribers` |

### LOW Priority (Rarely Updated)
| # | Section | Approach |
|---|---------|----------|
| 10 | Sustainability Page (full content) | Generic `page_content` |
| 11 | Certifications in Footer | `certifications` |
| 12 | Translations | `translations` table (complex) |

---

## Recommended Implementation Approach

### Phase 1 - Quick Wins (Existing patterns)
1. **Contact page** - Use existing `site_settings` for contact info instead of hardcoded values
2. **Testimonials** - New `testimonials` table
3. **FAQ** - New `faqs` table
4. **Newsletter** - New `newsletter_subscribers` table

### Phase 2 - Content Pages
5. **Office Locations** - New `office_locations` table
6. **Hero stats/badge** - Extend `site_settings` or new `hero_content` fields
7. **About Section** - New `home_content` or generic content blocks

### Phase 3 - Full CMS
8. **Our Story** (timeline, artisans, values) - Multiple tables
9. **Sustainability Page** - Content block system
10. **Footer certifications** - Certifications table
11. **Translations** - Full i18n from database (most complex)

---

## Technical Approach (Per New Table)

Each new CMS table will follow the existing pattern:
- Bilingual fields (`*_en` / `*_da`)
- `sort_order` for ordering
- `is_active` for visibility control
- RLS: Public read, admin write
- React Query hook for data fetching
- Admin panel CRUD interface

### Database Tables to Create
```text
testimonials: id, name, company, role, text_en, text_da, rating, image_url, sort_order, is_active
faqs: id, question_en, question_da, answer_en, answer_da, icon, sort_order, is_active
office_locations: id, name_en, name_da, type, address, city, country, flag, lat, lng, sort_order, is_active
newsletter_subscribers: id, email, subscribed_at, is_active
```

---

## Summary
Total hardcoded content areas found: **12 sections** across **8 files** containing approximately **50+ individual hardcoded content blocks** that should be made dynamic through the CMS.

The recommended approach is to implement in 3 phases, starting with the highest-impact, lowest-effort items (Testimonials, FAQ, Contact info) and progressing to the full content management system.
