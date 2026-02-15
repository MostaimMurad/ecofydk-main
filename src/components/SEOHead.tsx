import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
    title?: string;
    description?: string;
    type?: 'website' | 'product' | 'article';
    image?: string;
    url?: string;
    noindex?: boolean;
}

/**
 * SEOHead — Manages document title, meta tags, and JSON-LD structured data.
 * 
 * Usage:
 *   <SEOHead title="Page Title" description="..." type="website" />
 */
const SEOHead = ({
    title,
    description,
    type = 'website',
    image,
    url,
    noindex = false,
}: SEOHeadProps) => {
    const location = useLocation();
    const baseUrl = 'https://ecofy.dk';
    const pageUrl = url || `${baseUrl}${location.pathname}`;
    const defaultTitle = 'Ecofy — Sustainable Jute Products for Europe';
    const defaultDesc = 'Premium eco-friendly jute bags, packaging, and custom B2B solutions. EU-compliant, certified, and sustainably made in Bangladesh. Delivered to your door.';
    const defaultImage = `${baseUrl}/og-image.jpg`;

    const pageTitle = title ? `${title} — Ecofy` : defaultTitle;
    const pageDesc = description || defaultDesc;
    const pageImage = image || defaultImage;

    useEffect(() => {
        // Document title
        document.title = pageTitle;

        // Meta tags
        const setMeta = (name: string, content: string, property = false) => {
            const attr = property ? 'property' : 'name';
            let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, name);
                document.head.appendChild(el);
            }
            el.content = content;
        };

        setMeta('description', pageDesc);
        setMeta('robots', noindex ? 'noindex,nofollow' : 'index,follow');

        // Open Graph
        setMeta('og:title', pageTitle, true);
        setMeta('og:description', pageDesc, true);
        setMeta('og:type', type, true);
        setMeta('og:url', pageUrl, true);
        setMeta('og:image', pageImage, true);
        setMeta('og:site_name', 'Ecofy', true);

        // Twitter Card
        setMeta('twitter:card', 'summary_large_image');
        setMeta('twitter:title', pageTitle);
        setMeta('twitter:description', pageDesc);
        setMeta('twitter:image', pageImage);

        // Canonical
        let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = pageUrl;

        // JSON-LD Organization Schema
        const orgSchema = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Ecofy ApS',
            url: baseUrl,
            logo: `${baseUrl}/logo.png`,
            description: 'Sustainable jute products manufacturer and B2B supplier for the European market.',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Copenhagen',
                addressCountry: 'DK',
            },
            sameAs: [
                'https://www.facebook.com/ecofydk',
                'https://www.instagram.com/ecofydk',
                'https://www.linkedin.com/company/ecofydk',
            ],
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                availableLanguage: ['English', 'Danish'],
            },
        };

        // JSON-LD WebPage Schema
        const pageSchema = {
            '@context': 'https://schema.org',
            '@type': type === 'article' ? 'Article' : 'WebPage',
            name: pageTitle,
            description: pageDesc,
            url: pageUrl,
            image: pageImage,
            publisher: {
                '@type': 'Organization',
                name: 'Ecofy ApS',
            },
        };

        // Inject JSON-LD
        const injectJsonLd = (data: object, id: string) => {
            let script = document.getElementById(id) as HTMLScriptElement;
            if (!script) {
                script = document.createElement('script');
                script.id = id;
                script.type = 'application/ld+json';
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(data);
        };

        injectJsonLd(orgSchema, 'schema-org');
        injectJsonLd(pageSchema, 'schema-page');

        return () => {
            // Cleanup is handled by overwriting on next render
        };
    }, [pageTitle, pageDesc, pageUrl, pageImage, type, noindex]);

    return null;
};

export default SEOHead;
