import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

/**
 * Analytics — Google Analytics 4 integration with page view tracking.
 * 
 * Set VITE_GA_MEASUREMENT_ID in .env to enable.
 * Falls back gracefully when not configured.
 */
const Analytics = () => {
    const location = useLocation();

    // Load GA4 script
    useEffect(() => {
        if (!GA_ID) return;

        // Check if already loaded
        if (document.getElementById('ga-script')) return;

        // gtag.js
        const script = document.createElement('script');
        script.id = 'ga-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        document.head.appendChild(script);

        // Initialize
        const initScript = document.createElement('script');
        initScript.id = 'ga-init';
        initScript.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}', {
        send_page_view: false,
        cookie_flags: 'SameSite=None;Secure'
      });
    `;
        document.head.appendChild(initScript);
    }, []);

    // Track page views on route change
    useEffect(() => {
        if (!GA_ID) return;
        if (!(window as any).gtag) return;

        // Respect cookie consent
        const consent = localStorage.getItem('ecofy_cookie_consent');
        if (consent) {
            const parsed = JSON.parse(consent);
            if (!parsed.analytics) return;
        }

        (window as any).gtag('event', 'page_view', {
            page_path: location.pathname + location.search,
            page_title: document.title,
        });
    }, [location.pathname, location.search]);

    return null;
};

export default Analytics;
