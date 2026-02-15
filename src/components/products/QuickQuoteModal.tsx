import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Package, User, Mail, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface QuickQuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName?: string;
    mode?: 'quote' | 'sample';
}

const QuickQuoteModal = ({ isOpen, onClose, productName, mode = 'quote' }: QuickQuoteModalProps) => {
    const { language } = useLanguage();
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        quantity: '',
        message: '',
    });

    const isSample = mode === 'sample';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, this would send to Supabase/API
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setForm({ name: '', email: '', phone: '', company: '', quantity: '', message: '' });
            onClose();
        }, 2500);
    };

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const title = isSample
        ? (language === 'da' ? 'Anmod om Gratis Prøve' : 'Request Free Sample')
        : (language === 'da' ? 'Få et Hurtigt Tilbud' : 'Get a Quick Quote');

    const subtitle = isSample
        ? (language === 'da' ? 'Vi sender dig en gratis prøve inden for 5-7 hverdage.' : 'We\'ll send you a free sample within 5-7 business days.')
        : (language === 'da' ? 'Vi vender tilbage inden for 24 timer med et tilpasset tilbud.' : 'We\'ll get back to you within 24 hours with a custom quote.');

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="relative w-full max-w-lg rounded-2xl bg-background border border-border/50 shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-primary/10 via-emerald-500/5 to-primary/10 px-6 py-5 border-b border-border/30">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Package className="h-5 w-5 text-primary" />
                                        {title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                                    {productName && (
                                        <p className="text-xs text-primary font-medium mt-2 bg-primary/10 inline-block px-2.5 py-1 rounded-full">
                                            {language === 'da' ? 'Produkt' : 'Product'}: {productName}
                                        </p>
                                    )}
                                </div>
                                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {submitted ? (
                                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}>
                                        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                                    </motion.div>
                                    <h3 className="text-xl font-bold mb-2">
                                        {language === 'da' ? 'Tak for din forespørgsel!' : 'Thank You!'}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {isSample
                                            ? (language === 'da' ? 'Vi kontakter dig snart med prøve-detaljer.' : 'We\'ll contact you soon with sample details.')
                                            : (language === 'da' ? 'Vi vender tilbage inden for 24 timer.' : 'We\'ll get back to you within 24 hours.')}
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {language === 'da' ? 'Dit Navn' : 'Your Name'} *
                                            </label>
                                            <input
                                                required type="text" value={form.name}
                                                onChange={(e) => handleChange('name', e.target.value)}
                                                className="w-full rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                                                placeholder="Mostaim Ahmed"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                Email *
                                            </label>
                                            <input
                                                required type="email" value={form.email}
                                                onChange={(e) => handleChange('email', e.target.value)}
                                                className="w-full rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                                                placeholder="info@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {language === 'da' ? 'Telefon' : 'Phone'}
                                            </label>
                                            <input
                                                type="tel" value={form.phone}
                                                onChange={(e) => handleChange('phone', e.target.value)}
                                                className="w-full rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                                                placeholder="+45 91 69 01 30"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                                <Package className="h-3 w-3" />
                                                {isSample
                                                    ? (language === 'da' ? 'Virksomhed' : 'Company')
                                                    : (language === 'da' ? 'Antal (stk)' : 'Quantity (pcs)')}
                                            </label>
                                            <input
                                                type={isSample ? 'text' : 'text'}
                                                value={isSample ? form.company : form.quantity}
                                                onChange={(e) => handleChange(isSample ? 'company' : 'quantity', e.target.value)}
                                                className="w-full rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                                                placeholder={isSample ? 'Company ApS' : '500'}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                            <MessageSquare className="h-3 w-3" />
                                            {language === 'da' ? 'Besked' : 'Message'}
                                        </label>
                                        <textarea
                                            value={form.message}
                                            onChange={(e) => handleChange('message', e.target.value)}
                                            rows={3}
                                            className="w-full rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                                            placeholder={isSample
                                                ? (language === 'da' ? 'Evt. specifikke ønsker til prøven...' : 'Any specific requirements for the sample...')
                                                : (language === 'da' ? 'Fortæl os om dit projekt, branding behov, deadlines...' : 'Tell us about your project, branding needs, deadlines...')}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full rounded-xl bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25 h-11">
                                        <Send className="h-4 w-4 mr-2" />
                                        {isSample
                                            ? (language === 'da' ? 'Anmod om Prøve' : 'Request Sample')
                                            : (language === 'da' ? 'Send Tilbud Forespørgsel' : 'Submit Quote Request')}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default QuickQuoteModal;
