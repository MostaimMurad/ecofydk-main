import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle2, FileCheck, Scale, Lock, BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const GovernanceCompliance = () => {
  const { language } = useLanguage();

  const certifications = [
    {
      name: 'OEKO-TEX® Standard 100',
      description: language === 'da' ? 'Testet for skadelige stoffer' : 'Tested for harmful substances',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'GOTS Certified',
      description: language === 'da' ? 'Global organisk tekstil standard' : 'Global Organic Textile Standard',
      icon: Award,
      color: 'from-emerald-500 to-green-600',
    },
    {
      name: 'Fair Trade',
      description: language === 'da' ? 'Etisk handel certificeret' : 'Ethical trade certified',
      icon: Scale,
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: 'ISO 9001:2015',
      description: language === 'da' ? 'Kvalitetsstyringssystem' : 'Quality Management System',
      icon: FileCheck,
      color: 'from-purple-500 to-violet-600',
    },
  ];

  const complianceChecks = [
    language === 'da' ? 'Ingen børnearbejde politik' : 'No Child Labor Policy',
    language === 'da' ? 'Fair lønstandard' : 'Fair Wage Standard',
    language === 'da' ? 'Sikre arbejdsforhold' : 'Safe Working Conditions',
    language === 'da' ? 'Miljøbeskyttelse' : 'Environmental Protection',
    language === 'da' ? 'Anti-korruptionspolitik' : 'Anti-Corruption Policy',
    language === 'da' ? 'Forsyningskæde gennemsigtighed' : 'Supply Chain Transparency',
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-8 border border-border/50 shadow-xl overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-emerald-500 to-amber-500" />
        
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl font-bold text-foreground mb-2 flex items-center gap-3"
        >
          <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          {language === 'da' ? 'Governance & Compliance' : 'Governance & Compliance'}
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground mb-8"
        >
          {language === 'da' 
            ? 'Vores forpligtelse til kvalitet, etik og overholdelse af internationale standarder'
            : 'Our commitment to quality, ethics, and compliance with international standards'}
        </motion.p>

        {/* Certifications Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative p-5 rounded-2xl bg-muted/30 border border-border/30 group overflow-hidden text-center"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cert.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className={`mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center mb-3 shadow-lg`}
              >
                <cert.icon className="h-7 w-7 text-white" />
              </motion.div>
              
              <h4 className="font-semibold text-sm text-foreground line-clamp-2">{cert.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{cert.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Compliance Checklist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <BadgeCheck className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              {language === 'da' ? 'Etisk Sourcing Tjekliste' : 'Ethical Sourcing Checklist'}
            </h3>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {complianceChecks.map((check, index) => (
              <motion.div
                key={check}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-center gap-2"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + index * 0.05, type: 'spring' }}
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                </motion.div>
                <span className="text-sm text-foreground">{check}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quality Assurance Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/30 flex items-start gap-3"
        >
          <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-foreground text-sm">
              {language === 'da' ? 'Kvalitetssikring' : 'Quality Assurance'}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              {language === 'da' 
                ? 'Hvert produkt gennemgår streng kvalitetskontrol før afsendelse. Vi tilbyder fuld tilfredshedsgaranti.'
                : 'Every product undergoes rigorous quality control before shipping. We offer a full satisfaction guarantee.'}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default GovernanceCompliance;
