import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, Settings, X, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const COOKIE_KEY = 'ecofy_cookie_consent';

type ConsentState = {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
};

const CookieConsent = () => {
    const { language } = useLanguage();
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [consent, setConsent] = useState<ConsentState>({
        necessary: true,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const stored = localStorage.getItem(COOKIE_KEY);
        if (!stored) {
            const timer = setTimeout(() => setShowBanner(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const saveConsent = (state: ConsentState) => {
        localStorage.setItem(COOKIE_KEY, JSON.stringify({ ...state, timestamp: Date.now() }));
        setShowBanner(false);
        setShowSettings(false);
    };

    const acceptAll = () => saveConsent({ necessary: true, analytics: true, marketing: true });
    const acceptNecessary = () => saveConsent({ necessary: true, analytics: false, marketing: false });
    const saveCustom = () => saveConsent(consent);

    const cookieTypes = [
        {
            key: 'necessary' as const,
            label: language === 'da' ? 'Nødvendige Cookies' : 'Necessary Cookies',
            desc: language === 'da' ? 'Påkrævet for grundlæggende funktionalitet. Kan ikke deaktiveres.' : 'Required for basic site functionality. Cannot be disabled.',
            locked: true,
        },
        {
            key: 'analytics' as const,
            label: language === 'da' ? 'Analytiske Cookies' : 'Analytics Cookies',
            desc: language === 'da' ? 'Hjælper os med at forstå hvordan besøgende bruger vores side.' : 'Help us understand how visitors interact with our website.',
            locked: false,
        },
        {
            key: 'marketing' as const,
            label: language === 'da' ? 'Marketing Cookies' : 'Marketing Cookies',
            desc: language === 'da' ? 'Bruges til at vise relevante annoncer og spore kampagner.' : 'Used to display relevant advertisements and track campaigns.',
            locked: false,
        },
    ];

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6"
                >
                    <div className="max-w-4xl mx-auto rounded-2xl bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden">
                        {!showSettings ? (
                            /* Simple Banner */
                            <div className="p-5 md:p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-2.5 rounded-xl bg-primary/10 flex-shrink-0">
                                        <Cookie className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-sm mb-1">
                                            {language === 'da' ? 'Vi bruger cookies 🍪' : 'We use cookies 🍪'}
                                        </h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {language === 'da'
                                                ? 'Vi bruger cookies for at forbedre din oplevelse, analysere trafik og personalisere indhold. Ved at klikke "Accepter alle" giver du samtykke til brug af alle cookies.'
                                                : 'We use cookies to enhance your experience, analyze traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 sm:justify-end">
                                    <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)} className="text-xs gap-1.5 order-3 sm:order-1">
                                        <Settings className="h-3.5 w-3.5" />
                                        {language === 'da' ? 'Indstillinger' : 'Cookie Settings'}
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={acceptNecessary} className="text-xs order-2">
                                        {language === 'da' ? 'Kun nødvendige' : 'Necessary Only'}
                                    </Button>
                                    <Button size="sm" onClick={acceptAll} className="text-xs bg-gradient-to-r from-primary to-emerald-600 shadow-lg order-1 sm:order-3">
                                        <Check className="h-3.5 w-3.5 mr-1.5" />
                                        {language === 'da' ? 'Accepter alle' : 'Accept All'}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            /* Settings Panel */
                            <div className="p-5 md:p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-primary" />
                                        <h3 className="font-bold text-sm">
                                            {language === 'da' ? 'Cookie Indstillinger' : 'Cookie Settings'}
                                        </h3>
                                    </div>
                                    <button onClick={() => setShowSettings(false)} className="p-1 rounded-lg hover:bg-muted transition-colors">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="space-y-3 mb-5">
                                    {cookieTypes.map((ct) => (
                                        <div key={ct.key} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/30">
                                            <div className="pt-0.5">
                                                <button
                                                    disabled={ct.locked}
                                                    onClick={() => !ct.locked && setConsent((prev) => ({ ...prev, [ct.key]: !prev[ct.key] }))}
                                                    className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${consent[ct.key] ? 'bg-primary' : 'bg-muted-foreground/30'
                                                        } ${ct.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                                >
                                                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${consent[ct.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                                </button>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-xs">{ct.label}</span>
                                                    {ct.locked && (
                                                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                                                            {language === 'da' ? 'Påkrævet' : 'Required'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{ct.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline" size="sm" onClick={acceptNecessary} className="text-xs">
                                        {language === 'da' ? 'Kun nødvendige' : 'Reject Optional'}
                                    </Button>
                                    <Button size="sm" onClick={saveCustom} className="text-xs bg-gradient-to-r from-primary to-emerald-600">
                                        {language === 'da' ? 'Gem valg' : 'Save Preferences'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
