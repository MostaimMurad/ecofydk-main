import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const WhatsAppChat = () => {
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const phoneNumber = '4500000000'; // Replace with actual number
    const defaultMessage = language === 'da'
        ? 'Hej Ecofy! Jeg er interesseret i jeres bæredygtige juteprodukter.'
        : 'Hi Ecofy! I\'m interested in your sustainable jute products.';

    const quickMessages = [
        { label: language === 'da' ? '📦 Produktforespørgsel' : '📦 Product Inquiry', msg: language === 'da' ? 'Hej! Jeg vil gerne vide mere om jeres produkter.' : 'Hi! I\'d like to know more about your products.' },
        { label: language === 'da' ? '💰 Anmod om tilbud' : '💰 Request a Quote', msg: language === 'da' ? 'Hej! Jeg vil gerne have et tilbud på bulk-ordre.' : 'Hi! I\'d like to get a quote for a bulk order.' },
        { label: language === 'da' ? '🎨 Tilpasset branding' : '🎨 Custom Branding', msg: language === 'da' ? 'Hej! Jeg er interesseret i tilpassede juteprodukter med mit brand.' : 'Hi! I\'m interested in custom jute products with my branding.' },
        { label: language === 'da' ? '📋 Prøveordre' : '📋 Sample Order', msg: language === 'da' ? 'Hej! Kan jeg bestille prøver af jeres produkter?' : 'Hi! Can I order samples of your products?' },
    ];

    const openWhatsApp = (message: string) => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <>
            {/* Chat Bubble */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)]"
                    >
                        <div className="rounded-2xl shadow-2xl border border-border/50 overflow-hidden bg-background">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#25D366] to-[#128C7E] p-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                            <MessageCircle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">Ecofy Support</h4>
                                            <p className="text-xs text-white/80">
                                                {language === 'da' ? 'Typisk svar inden for 1 time' : 'Typically replies within 1 hour'}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Chat body */}
                            <div className="p-4 bg-[#ECE5DD] dark:bg-muted/30">
                                <div className="bg-white dark:bg-card rounded-xl p-3 shadow-sm max-w-[85%] relative">
                                    <p className="text-sm text-foreground">
                                        {language === 'da'
                                            ? '👋 Hej! Hvordan kan vi hjælpe dig i dag? Vælg en mulighed nedenfor eller skriv din egen besked.'
                                            : '👋 Hi there! How can we help you today? Choose an option below or write your own message.'}
                                    </p>
                                    <div className="absolute -bottom-1 left-3 w-3 h-3 bg-white dark:bg-card rotate-45" />
                                </div>
                            </div>

                            {/* Quick messages */}
                            <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
                                {quickMessages.map((qm, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => openWhatsApp(qm.msg)}
                                        className="w-full text-left p-3 rounded-xl border border-border/50 hover:border-[#25D366]/40 hover:bg-[#25D366]/5 transition-all text-sm flex items-center justify-between group"
                                    >
                                        <span>{qm.label}</span>
                                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#25D366] transition-colors" />
                                    </motion.button>
                                ))}
                            </div>

                            {/* Send custom message */}
                            <div className="p-3 border-t border-border/50">
                                <button
                                    onClick={() => openWhatsApp(defaultMessage)}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5C] text-white font-medium text-sm transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                    {language === 'da' ? 'Start Samtale' : 'Start Conversation'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BD5C] text-white shadow-lg shadow-[#25D366]/30 flex items-center justify-center transition-colors"
                aria-label="WhatsApp Chat"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X className="h-6 w-6" />
                        </motion.div>
                    ) : (
                        <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                            <MessageCircle className="h-6 w-6" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Pulse ring */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
                )}
            </motion.button>
        </>
    );
};

export default WhatsAppChat;
