import { motion } from 'framer-motion';
import { HelpCircle, Sparkles, Leaf } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFaqs } from '@/hooks/useFaqs';

const FAQ = () => {
  const { t, language } = useLanguage();
  const { data: faqs = [] } = useFaqs();

  if (faqs.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-b from-muted/50 via-background to-background">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-32 top-1/3 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-32 bottom-1/3 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      {/* Floating Leaves */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: `${15 + i * 25}%`, top: `${10 + i * 20}%` }}
          animate={{ y: [0, -12, 0], rotate: [0, 8, -8, 0], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf className="h-8 w-8 text-primary/20" />
        </motion.div>
      ))}

      <div className="container relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-6 bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-primary/20 px-4 py-2 text-sm shadow-lg">
              <HelpCircle className="mr-2 h-4 w-4 text-primary" />
              {t('home.faq.badge')}
            </Badge>
          </motion.div>

          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {t('home.faq.title')}
          </motion.h2>

          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            {t('home.faq.subtitle')}
          </motion.p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-14 max-w-3xl">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={faq.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}>
                <AccordionItem value={`item-${faq.id}`}
                  className="group rounded-2xl border-0 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-lg shadow-primary/5 ring-1 ring-primary/10 px-0 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:ring-primary/20 data-[state=open]:ring-primary/30 data-[state=open]:shadow-xl">
                  <AccordionTrigger className="px-6 py-5 text-left text-base font-medium hover:no-underline group-hover:text-primary transition-colors [&[data-state=open]]:text-primary">
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg transition-all duration-300 group-hover:bg-primary/20 group-data-[state=open]:bg-primary group-data-[state=open]:text-white">
                        {faq.icon || '🌱'}
                      </span>
                      <span className="flex-1 pr-4">
                        {language === 'en' ? faq.question_en : faq.question_da}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-0">
                    <div className="ml-14 text-muted-foreground leading-relaxed">
                      {language === 'en' ? faq.answer_en : faq.answer_da}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 text-center">
          <div className="inline-flex items-center gap-3 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-xl px-6 py-3 shadow-lg ring-1 ring-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              {language === 'en' ? "Still have questions? " : "Har du stadig spørgsmål? "}
              <a href="/contact" className="font-medium text-primary hover:underline">
                {language === 'en' ? "Contact us" : "Kontakt os"}
              </a>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
