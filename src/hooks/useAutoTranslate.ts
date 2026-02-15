import { useState, useCallback, useRef } from 'react';

// Simple translation cache to avoid re-translating identical text
const translationCache = new Map<string, string>();

function getCacheKey(text: string, from: string, to: string): string {
    return `${from}:${to}:${text}`;
}

/**
 * Hook for auto-translating text between English and Danish
 * using the Google Translate free API endpoint.
 */
export const useAutoTranslate = () => {
    const [isTranslating, setIsTranslating] = useState(false);
    const abortRef = useRef<AbortController | null>(null);

    const translate = useCallback(
        async (text: string, from: 'en' | 'da', to: 'en' | 'da'): Promise<string> => {
            if (!text.trim()) return '';

            // Check cache first
            const key = getCacheKey(text, from, to);
            const cached = translationCache.get(key);
            if (cached) return cached;

            // Abort any previous in-flight request
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;

            setIsTranslating(true);
            try {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;

                const res = await fetch(url, { signal: controller.signal });
                if (!res.ok) throw new Error('Translation failed');

                const json = await res.json();

                // Google returns nested arrays: [[["translated","original",...],...],...]
                const translated = (json[0] as Array<[string, string]>)
                    .map((segment) => segment[0])
                    .join('');

                // Cache the result
                translationCache.set(key, translated);

                return translated;
            } catch (err: any) {
                if (err.name === 'AbortError') return '';
                console.error('Translation error:', err);
                throw err;
            } finally {
                setIsTranslating(false);
            }
        },
        [],
    );

    /**
     * Translate multiple texts at once (for batch operations like use-cases arrays)
     */
    const translateBatch = useCallback(
        async (texts: string[], from: 'en' | 'da', to: 'en' | 'da'): Promise<string[]> => {
            if (texts.length === 0) return [];

            // Join with a unique separator, translate as one, then split
            const separator = ' ||| ';
            const combined = texts.join(separator);
            const translated = await translate(combined, from, to);
            return translated.split(separator).map((s) => s.trim());
        },
        [translate],
    );

    return { translate, translateBatch, isTranslating };
};
