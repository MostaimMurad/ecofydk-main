-- Insert additional test blog posts with different categories
INSERT INTO public.blog_posts (slug, title_en, title_da, excerpt_en, excerpt_da, content_en, content_da, category, cover_image, is_published, published_at) VALUES 
(
  'meet-our-master-weaver-fatima',
  'Meet Our Master Weaver: Fatima''s Story of 30 Years in Jute Craftsmanship',
  'Mød vores mestervæver: Fatimas historie om 30 år i jute-håndværk',
  'Fatima has been weaving jute for three decades. Her story represents the heart and soul of Ecofy''s artisan community.',
  'Fatima har vævet jute i tre årtier. Hendes historie repræsenterer hjertet og sjælen i Ecofys håndværkersamfund.',
  '<h2>A Legacy of Craftsmanship</h2>
<p>In a small village in northern Bangladesh, Fatima begins her day at sunrise. For 30 years, her skilled hands have transformed raw jute fibers into beautiful, functional products that now reach homes across Europe.</p>

<h2>Learning the Craft</h2>
<p>"My mother taught me to weave when I was just 12 years old," Fatima recalls with a warm smile. "Back then, we made simple mats and ropes. Today, I create intricate patterns for bags, baskets, and home décor that people in Denmark and Germany use every day."</p>

<h2>The Ecofy Partnership</h2>
<p>When Ecofy first visited Fatima''s village in 2019, it marked a turning point for the entire community. "Before Ecofy, we sold our products at local markets for very little money. Now, we receive fair wages, and our children can go to school."</p>

<h3>Impact on the Community:</h3>
<ul>
<li>40% higher wages than industry average</li>
<li>Healthcare support for all artisan families</li>
<li>Educational scholarships for children</li>
<li>Safe and comfortable working conditions</li>
</ul>

<h2>Preserving Tradition</h2>
<p>Fatima now trains younger women in her village, passing down techniques that have been refined over generations. "Every stitch carries our heritage," she says. "When someone in Europe holds our product, they''re holding a piece of Bangladesh."</p>',
  '<h2>En arv af håndværk</h2>
<p>I en lille landsby i det nordlige Bangladesh begynder Fatima sin dag ved solopgang. I 30 år har hendes dygtige hænder forvandlet rå jutefibre til smukke, funktionelle produkter, der nu når hjem i hele Europa.</p>

<h2>At lære håndværket</h2>
<p>"Min mor lærte mig at væve, da jeg kun var 12 år gammel," husker Fatima med et varmt smil. "Dengang lavede vi simple måtter og reb. I dag skaber jeg indviklede mønstre til tasker, kurve og boligindretning, som folk i Danmark og Tyskland bruger hver dag."</p>

<h2>Ecofy-partnerskabet</h2>
<p>Da Ecofy første gang besøgte Fatimas landsby i 2019, markerede det et vendepunkt for hele samfundet. "Før Ecofy solgte vi vores produkter på lokale markeder for meget få penge. Nu får vi fair lønninger, og vores børn kan gå i skole."</p>

<h3>Indvirkning på samfundet:</h3>
<ul>
<li>40% højere lønninger end branchegennemsnittet</li>
<li>Sundhedsstøtte til alle håndværkerfamilier</li>
<li>Uddannelsesstipendier til børn</li>
<li>Sikre og komfortable arbejdsforhold</li>
</ul>

<h2>Bevaring af tradition</h2>
<p>Fatima træner nu yngre kvinder i sin landsby og videregiver teknikker, der er blevet forfinet gennem generationer. "Hvert sting bærer vores arv," siger hun. "Når nogen i Europa holder vores produkt, holder de et stykke Bangladesh."</p>',
  'Craftsmanship',
  'https://images.unsplash.com/photo-1594608661623-aa0bd3a69799?w=1920&h=1080&fit=crop',
  true,
  NOW() - INTERVAL '3 days'
),
(
  'ecofy-expands-to-nordic-markets',
  'Ecofy Expands to Nordic Markets: New Partnerships in Sweden and Norway',
  'Ecofy udvider til nordiske markeder: Nye partnerskaber i Sverige og Norge',
  'We''re thrilled to announce our expansion into Sweden and Norway, bringing sustainable jute products to more European homes.',
  'Vi er begejstrede for at annoncere vores udvidelse til Sverige og Norge og bringer bæredygtige juteprodukter til flere europæiske hjem.',
  '<h2>Growing Our European Footprint</h2>
<p>After three successful years serving the Danish market, Ecofy is proud to announce our expansion into Sweden and Norway. This milestone represents our commitment to making sustainable products accessible across the Nordic region.</p>

<h2>New Retail Partnerships</h2>
<p>We''ve partnered with leading sustainable retailers in both countries:</p>
<ul>
<li><strong>Sweden:</strong> Naturbutiken (15 locations), EcoLiving Stockholm</li>
<li><strong>Norway:</strong> Grønn Butikk (8 locations), Bergen Eco Market</li>
</ul>

<h2>What This Means for Our Artisans</h2>
<p>This expansion isn''t just good news for European consumers—it directly benefits our artisan community in Bangladesh. With increased demand, we''re able to partner with 50 additional artisan families, providing sustainable livelihoods to more communities.</p>

<h2>Launching New Products</h2>
<p>To celebrate our Nordic expansion, we''re introducing three new product lines specifically designed for Scandinavian homes:</p>
<ul>
<li>Nordic Minimalist Collection - Clean lines, neutral tones</li>
<li>Hygge Home Series - Cozy textures for comfortable living</li>
<li>Outdoor Adventure Range - Durable bags for Nordic explorers</li>
</ul>

<h2>Visit Us</h2>
<p>Find Ecofy products at our new partner stores starting March 2024. Follow us on social media for store locations and launch events.</p>',
  '<h2>Udvider vores europæiske fodaftryk</h2>
<p>Efter tre succesfulde år på det danske marked er Ecofy stolte af at annoncere vores udvidelse til Sverige og Norge. Denne milepæl repræsenterer vores forpligtelse til at gøre bæredygtige produkter tilgængelige i hele den nordiske region.</p>

<h2>Nye detailpartnerskaber</h2>
<p>Vi har indgået partnerskaber med førende bæredygtige forhandlere i begge lande:</p>
<ul>
<li><strong>Sverige:</strong> Naturbutiken (15 lokationer), EcoLiving Stockholm</li>
<li><strong>Norge:</strong> Grønn Butikk (8 lokationer), Bergen Eco Market</li>
</ul>

<h2>Hvad dette betyder for vores håndværkere</h2>
<p>Denne udvidelse er ikke kun godt nyt for europæiske forbrugere—det gavner direkte vores håndværkersamfund i Bangladesh. Med øget efterspørgsel kan vi samarbejde med 50 yderligere håndværkerfamilier og give bæredygtige levebrød til flere samfund.</p>

<h2>Lancering af nye produkter</h2>
<p>For at fejre vores nordiske udvidelse introducerer vi tre nye produktlinjer specifikt designet til skandinaviske hjem:</p>
<ul>
<li>Nordic Minimalist Collection - Rene linjer, neutrale toner</li>
<li>Hygge Home Series - Hyggelige teksturer til behageligt liv</li>
<li>Outdoor Adventure Range - Holdbare tasker til nordiske opdagelsesrejsende</li>
</ul>

<h2>Besøg os</h2>
<p>Find Ecofy-produkter i vores nye partnerbutikker fra marts 2024. Følg os på sociale medier for butiksplaceringer og lanceringsbegivenheder.</p>',
  'News',
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1920&h=1080&fit=crop',
  true,
  NOW() - INTERVAL '7 days'
),
(
  '5-ways-to-style-jute-bags',
  '5 Creative Ways to Style Your Jute Bag for Any Occasion',
  '5 kreative måder at style din jutetaske til enhver lejlighed',
  'From beach days to business meetings, discover how to make your sustainable jute bag work for every part of your life.',
  'Fra stranddage til forretningsmøder, opdag hvordan du får din bæredygtige jutetaske til at fungere i alle dele af dit liv.',
  '<h2>Versatile, Sustainable, Stylish</h2>
<p>Your jute bag is more than just an eco-friendly choice—it''s a versatile accessory that can complement any outfit and occasion. Here are five creative ways to style your favorite Ecofy jute bag.</p>

<h2>1. Beach Day Essential</h2>
<p>Pair your large woven jute tote with a flowing sundress and sandals. The natural texture of jute perfectly complements beachwear, and its durability means it can handle sand, sunscreen, and all your beach essentials.</p>
<p><em>Pro tip: Our jute bags are naturally resistant to moisture, making them ideal for seaside adventures.</em></p>

<h2>2. Farmers Market Chic</h2>
<p>Nothing says "sustainable living" quite like carrying your organic produce in a beautiful handwoven jute bag. Add a linen shirt and comfortable pants for the perfect market-day look.</p>

<h2>3. Office Professional</h2>
<p>Yes, jute can go to work! Our structured jute laptop bags and document holders pair beautifully with business casual attire. The natural tones complement navy, gray, and earth-toned professional wear.</p>

<h2>4. Weekend Brunch</h2>
<p>A medium-sized jute crossbody bag adds bohemian charm to your weekend outfit. Pair with denim, a white blouse, and statement earrings for effortless style.</p>

<h2>5. Evening Out</h2>
<p>Our embellished jute clutches prove that sustainable fashion can be glamorous. The handcrafted details and unique textures make a statement at any evening event.</p>

<h2>Care Tips</h2>
<p>To keep your jute bag looking its best: store in a dry place, spot clean with a damp cloth, and let it air out after heavy use. With proper care, your Ecofy bag will last for years.</p>',
  '<h2>Alsidig, bæredygtig, stilfuld</h2>
<p>Din jutetaske er mere end bare et miljøvenligt valg—det er et alsidigt tilbehør, der kan komplementere ethvert outfit og enhver lejlighed. Her er fem kreative måder at style din foretrukne Ecofy jutetaske.</p>

<h2>1. Stranddag essentials</h2>
<p>Par din store vævede jute-tote med en flydende sommerkjole og sandaler. Den naturlige tekstur af jute komplementerer perfekt strandtøj, og dens holdbarhed betyder, at den kan håndtere sand, solcreme og alle dine strandnødvendigheder.</p>
<p><em>Pro tip: Vores jutetasker er naturligt modstandsdygtige over for fugt, hvilket gør dem ideelle til eventyr ved havet.</em></p>

<h2>2. Bondemarked chic</h2>
<p>Intet siger "bæredygtigt liv" som at bære dine økologiske produkter i en smuk håndvævet jutetaske. Tilføj en hørskjorte og behagelige bukser for det perfekte markedsdag-look.</p>

<h2>3. Kontorprofessionel</h2>
<p>Ja, jute kan gå på arbejde! Vores strukturerede jute-laptoptasker og dokumentholdere passer smukt til business casual tøj. De naturlige toner komplementerer marineblåt, gråt og jordfarvet professionelt tøj.</p>

<h2>4. Weekend brunch</h2>
<p>En mellemstor jute crossbody-taske tilføjer bohemisk charme til dit weekendoutfit. Par med denim, en hvid bluse og statement-øreringe for ubesværet stil.</p>

<h2>5. Aften ude</h2>
<p>Vores udsmykkede jute-clutches beviser, at bæredygtig mode kan være glamourøs. De håndlavede detaljer og unikke teksturer gør et statement ved enhver aftenbegivenhed.</p>

<h2>Plejetips</h2>
<p>For at holde din jutetaske i bedste stand: opbevar på et tørt sted, pletren med en fugtig klud, og lad den lufte efter kraftig brug. Med ordentlig pleje vil din Ecofy-taske holde i årevis.</p>',
  'Tips',
  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1920&h=1080&fit=crop',
  true,
  NOW() - INTERVAL '14 days'
);