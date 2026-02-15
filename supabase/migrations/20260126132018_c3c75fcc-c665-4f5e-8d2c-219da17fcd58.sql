-- Insert test blog post with cover image and category
INSERT INTO public.blog_posts (
  slug,
  title_en,
  title_da,
  excerpt_en,
  excerpt_da,
  content_en,
  content_da,
  category,
  cover_image,
  is_published,
  published_at
) VALUES (
  'the-art-of-jute-craftsmanship',
  'The Art of Jute Craftsmanship: A Journey from Bangladesh to Europe',
  'Jute-håndværkets kunst: En rejse fra Bangladesh til Europa',
  'Discover the centuries-old tradition of jute weaving and how our artisans transform golden fibers into sustainable products that reach homes across Europe.',
  'Oplev den århundreder gamle tradition med jute-vævning og hvordan vores håndværkere forvandler gyldne fibre til bæredygtige produkter, der når hjem i hele Europa.',
  '<h2>The Golden Fiber</h2>
<p>Jute, often called the "golden fiber," has been cultivated in the fertile lands of Bangladesh for centuries. This remarkable natural fiber is not just environmentally friendly—it carries with it a rich heritage of craftsmanship passed down through generations.</p>

<h2>Our Artisan Community</h2>
<p>At Ecofy, we work directly with over 200 skilled artisans in rural Bangladesh. These master craftspeople bring decades of experience to every product they create. From weaving intricate patterns to crafting durable bags and home décor items, their expertise is unmatched.</p>

<h2>Sustainable by Nature</h2>
<p>Unlike synthetic materials, jute is 100% biodegradable. It decomposes naturally within months, leaving no harmful residue. During its growth, jute plants absorb significant amounts of CO2, making it a carbon-negative crop.</p>

<h3>Key Benefits of Jute:</h3>
<ul>
<li>Biodegrades in 2-3 months</li>
<li>Requires 80% less water than cotton</li>
<li>Absorbs 15 tonnes of CO2 per hectare</li>
<li>Supports rural livelihoods</li>
</ul>

<h2>From Farm to Your Home</h2>
<p>Every Ecofy product travels from the jute fields of Bangladesh to your doorstep in Europe. We ensure complete transparency in our supply chain, fair wages for our artisans, and minimal environmental impact throughout the journey.</p>

<p>When you choose an Ecofy product, you''re not just buying a bag or a decorative piece—you''re supporting sustainable practices and empowering communities.</p>',
  '<h2>Den Gyldne Fiber</h2>
<p>Jute, ofte kaldet den "gyldne fiber," har været dyrket i Bangladeshs frugtbare jord i århundreder. Denne bemærkelsesværdige naturlige fiber er ikke kun miljøvenlig—den bærer en rig arv af håndværk videregivet gennem generationer.</p>

<h2>Vores Håndværkersamfund</h2>
<p>Hos Ecofy arbejder vi direkte med over 200 dygtige håndværkere i landdistrikterne i Bangladesh. Disse mesterhåndværkere bringer årtiers erfaring til hvert produkt, de skaber. Fra at væve indviklede mønstre til at lave holdbare tasker og boligindretningsartikler er deres ekspertise uovertruffen.</p>

<h2>Bæredygtig af Natur</h2>
<p>I modsætning til syntetiske materialer er jute 100% bionedbrydelig. Det nedbrydes naturligt inden for måneder uden at efterlade skadelige rester. Under sin vækst optager juteplanter betydelige mængder CO2, hvilket gør det til en kulstofnegativ afgrøde.</p>

<h3>Vigtigste Fordele ved Jute:</h3>
<ul>
<li>Nedbrydes på 2-3 måneder</li>
<li>Kræver 80% mindre vand end bomuld</li>
<li>Optager 15 ton CO2 per hektar</li>
<li>Støtter landdistrikters levebrød</li>
</ul>

<h2>Fra Mark til Dit Hjem</h2>
<p>Hvert Ecofy-produkt rejser fra jutemarkerne i Bangladesh til din dør i Europa. Vi sikrer fuldstændig gennemsigtighed i vores forsyningskæde, fair lønninger til vores håndværkere og minimal miljøpåvirkning gennem hele rejsen.</p>

<p>Når du vælger et Ecofy-produkt, køber du ikke bare en taske eller en dekorativ genstand—du støtter bæredygtige praksisser og styrker lokalsamfund.</p>',
  'Sustainability',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop',
  true,
  NOW()
);