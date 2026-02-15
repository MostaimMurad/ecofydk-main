import { useEffect } from 'react';

/**
 * SkipToContent — Accessibility component that adds a "Skip to main content" link
 * for keyboard navigation. Visible only on focus (Tab key).
 */
const SkipToContent = () => {
    useEffect(() => {
        // Ensure main content area has the skip target
        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main-content';
        }
    }, []);

    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:rounded-xl focus:shadow-lg focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
        >
            Skip to main content
        </a>
    );
};

export default SkipToContent;
