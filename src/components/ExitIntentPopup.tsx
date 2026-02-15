import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ArrowRight, Leaf } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const EXIT_POPUP_KEY = 'ecofy_exit_popup_shown';

const ExitIntentPopup = () => {
    const { language } = useLanguage();
    const [showPopup, setShowPopup] = useState(false);

    const handleMouseLeave = useCallback((e: MouseEvent) => {
        // Trigger only when cursor moves toward the top (exit intent)
        if (e.clientY <= 5) {
            const shown = sessionStorage.getItem(EXIT_POPUP_KEY);
            if (!shown) {
                setShowPopup(true);
                sessionStorage.setItem(EXIT_POPUP_KEY, 'true');
            }
        }
    }, []);

    useEffect(() => {
        // Only add listener on desktop and after a delay
        const timer = setTimeout(() => {
            document.addEventListener('mouseleave', handleMouseLeave);
        }, 5000); // Wait 5s before arming

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [handleMouseLeave]);

    const handleClose = () => setShowPopup(false);

    return (
        <AnimatePresence>
            {showPopup && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="relative w-full max-w-md rounded-2xl bg-background border border-border/50 shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Gradient header */}
                        <div className="relative bg-gradient-to-br from-primary via-emerald-600 to-primary py-10 px-6 text-center text-white overflow-hidden">
                            {/* Decorative leaves */}
                            <motion.div className="absolute top-3 left-6 opacity-20" animate={{ rotate: [0, 15, -10, 0] }} transition={{ duration: 6, repeat: Infinity }}>
                                <Leaf className="h-10 w-10" />
                            </motion.div>
                            <motion.div className="absolute bottom-4 right-8 opacity-15" animate={{ rotate: [0, -20, 10, 0] }} transition={{ duration: 8, repeat: Infinity }}>
                                <Leaf className="h-8 w-8" />
                            </motion.div>

                            <button onClick={handleClose} className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/20 transition-colors">
                                <X className="h-5 w-5" />
                            </button>

                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                                <Gift className="h-12 w-12 mx-auto mb-3 drop-shadow-lg" />
                            </motion.div>
                            <h2 className="text-2xl font-bold mb-2">
                                {language === 'da' ? 'Vent! Gå ikke endnu' : 'Wait! Before You Go'}
                            </h2>
                            <p className="text-white/80 text-sm">
                                {language === 'da'
                                    ? 'Få 10% rabat på din første B2B ordre'
                                    : 'Get 10% off your first B2B order'}
                            </p>
                        </div>

                        {/* Content */}
                        <div className="p-6 text-center">
                            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                                {language === 'da'
                                    ? 'Tilmeld dig vores nyhedsbrev og modtag eksklusive tilbud, nye produkter og bæredygtighedstips direkte i din indbakke.'
                                    : 'Subscribe to our newsletter and receive exclusive offers, new products, and sustainability tips directly to your inbox.'}
                            </p>

                            <div className="space-y-3">
                                <Button asChild className="w-full rounded-xl bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25 h-11">
                                    <Link to="/contact" onClick={handleClose}>
                                        {language === 'da' ? 'Få dit tilbud' : 'Claim Your Offer'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" onClick={handleClose} className="w-full rounded-xl text-muted-foreground text-sm">
                                    {language === 'da' ? 'Nej tak, måske senere' : 'No thanks, maybe later'}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ExitIntentPopup;
