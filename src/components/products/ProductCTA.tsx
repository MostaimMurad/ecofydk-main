import { motion } from 'framer-motion';
import { MessageCircle, Package, ArrowRight, Clock, Shield, Sparkles, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface ProductCTAProps {
  productName: string;
}

const ProductCTA = ({ productName }: ProductCTAProps) => {
  const { language } = useLanguage();

  const whatsappNumber = '+4520123456'; // Replace with actual number
  const whatsappMessage = encodeURIComponent(
    language === 'da' 
      ? `Hej! Jeg er interesseret i at få mere information om "${productName}". Kan I hjælpe mig?`
      : `Hi! I'm interested in getting more information about "${productName}". Can you help me?`
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  const trustBadges = [
    { icon: Clock, text: language === 'da' ? '24t svar' : '24h response' },
    { icon: Shield, text: language === 'da' ? 'Gratis prøver' : 'Free samples' },
    { icon: Package, text: language === 'da' ? 'Global levering' : 'Global shipping' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="relative overflow-hidden rounded-3xl">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-emerald-600" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Text Content */}
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4"
              >
                <Sparkles className="h-4 w-4" />
                {language === 'da' ? 'Gratis Prøver Tilgængelige' : 'Free Samples Available'}
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-serif text-3xl lg:text-4xl font-bold mb-4"
              >
                {language === 'da' 
                  ? 'Klar til at komme i gang?'
                  : 'Ready to Get Started?'}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/90 text-lg mb-6"
              >
                {language === 'da' 
                  ? 'Anmod om en gratis prøve eller kontakt os direkte for at diskutere dine behov. Vi tilbyder tilpassede løsninger og konkurrencedygtige bulkpriser.'
                  : 'Request a free sample or contact us directly to discuss your needs. We offer customized solutions and competitive bulk pricing.'}
              </motion.p>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                {trustBadges.map((badge, index) => (
                  <div
                    key={badge.text}
                    className="flex items-center gap-2 text-white/80 text-sm"
                  >
                    <badge.icon className="h-4 w-4" />
                    <span>{badge.text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {/* Request Sample Button */}
              <Link to="/contact" className="block">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="w-full h-14 text-lg bg-white text-primary hover:bg-white/90 shadow-xl group"
                  >
                    <Package className="mr-3 h-5 w-5" />
                    {language === 'da' ? 'Anmod om Gratis Prøve' : 'Request Free Sample'}
                    <motion.div
                      className="ml-3"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </motion.div>
              </Link>

              {/* WhatsApp Button */}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-14 text-lg border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm group"
                  >
                    <MessageCircle className="mr-3 h-5 w-5" />
                    {language === 'da' ? 'Chat på WhatsApp' : 'Chat on WhatsApp'}
                    <span className="ml-3 px-2 py-0.5 bg-green-500 rounded-full text-xs font-medium">
                      {language === 'da' ? 'Online' : 'Online'}
                    </span>
                  </Button>
                </motion.div>
              </a>

              {/* Phone Call Option */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="text-center text-white/70 text-sm pt-2"
              >
                <span>{language === 'da' ? 'Eller ring direkte: ' : 'Or call directly: '}</span>
                <a href="tel:+4520123456" className="text-white font-medium hover:underline inline-flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  +45 20 12 34 56
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default ProductCTA;
