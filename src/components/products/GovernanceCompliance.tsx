import { motion } from 'framer-motion';
import { Shield, Award, CheckCircle, FileCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/hooks/useProducts';

interface GovernanceComplianceProps {
  product?: Product;
}

const GovernanceCompliance = ({ product }: GovernanceComplianceProps) => {
  const { language } = useLanguage();

  const data = product?.governance && Object.keys(product.governance).length > 0
    ? product.governance
    : null;

  const certifications = data?.certifications?.length
    ? data.certifications.map(c => ({
      name: c.name,
      description: language === 'da' ? c.description_da : c.description_en,
    }))
    : [
      { name: 'OEKO-TEX® Standard 100', description: language === 'da' ? 'Testet for skadelige stoffer' : 'Tested for harmful substances' },
      { name: 'GOTS Certified', description: language === 'da' ? 'Global organisk tekstil standard' : 'Global Organic Textile Standard' },
      { name: 'Fair Trade', description: language === 'da' ? 'Etisk handel certificeret' : 'Ethical trade certified' },
      { name: 'ISO 9001:2015', description: language === 'da' ? 'Kvalitetsstyringssystem' : 'Quality Management System' },
    ];

  const complianceChecks = data
    ? (language === 'da' ? data.compliance_da || [] : data.compliance_en || [])
    : language === 'da'
      ? ['Ingen børnearbejde politik', 'Fair lønstandard', 'Sikre arbejdsforhold', 'Miljøbeskyttelse', 'Anti-korruptionspolitik', 'Forsyningskæde gennemsigtighed']
      : ['No Child Labor Policy', 'Fair Wage Standard', 'Safe Working Conditions', 'Environmental Protection', 'Anti-Corruption Policy', 'Supply Chain Transparency'];

  const qaStatement = data
    ? (language === 'da' ? data.qa_statement_da : data.qa_statement_en) || ''
    : language === 'da'
      ? 'Hvert produkt gennemgår streng kvalitetskontrol inden afsendelse. Vi tilbyder fuld tilfredshedsgaranti.'
      : 'Every product undergoes rigorous quality control before shipping. We offer a full satisfaction guarantee.';

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="backdrop-blur-xl bg-white/80 dark:bg-card/80 rounded-3xl p-8 border border-border/50 shadow-xl">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center gap-3"
        >
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl">
            <Shield className="h-6 w-6 text-purple-600" />
          </div>
          {language === 'da' ? 'Governance & Compliance' : 'Governance & Compliance'}
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Certifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Award className="h-4 w-4" />
              {language === 'da' ? 'Certificeringer' : 'Certifications'}
            </h3>
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30"
                >
                  <div className="p-2 bg-white dark:bg-background rounded-lg shadow-sm">
                    <Award className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{cert.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Compliance Checklist */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              {language === 'da' ? 'Etisk Sourcing' : 'Ethical Sourcing'}
            </h3>
            <div className="space-y-2">
              {complianceChecks.map((check, index) => (
                <motion.div
                  key={check}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center gap-3 p-2"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-foreground">{check}</span>
                </motion.div>
              ))}
            </div>

            {/* QA Statement */}
            {qaStatement && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-primary/10"
              >
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {qaStatement}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default GovernanceCompliance;
