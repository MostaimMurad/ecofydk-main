import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, TreePine, Recycle, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useContentBlocks } from '@/hooks/useContentBlocks';

const iconMap: Record<string, React.ReactElement> = {
    Package: <Package className="h-7 w-7" />,
    TreePine: <TreePine className="h-7 w-7" />,
    Recycle: <Recycle className="h-7 w-7" />,
    Building2: <Building2 className="h-7 w-7" />,
};

const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (hasStarted) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHasStarted(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;
        let startTime: number;
        let frame: number;
        const animate = (ts: number) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, [end, duration, hasStarted]);

    return { count, ref };
};

const defaultStats = [
    { value: 50000, suffix: '+', label_en: 'Eco-Friendly Bags Delivered', label_da: 'Øko-venlige poser leveret', icon: 'Package', color: 'from-primary to-emerald-600' },
    { value: 18, suffix: 't', label_en: 'CO₂ Emissions Saved', label_da: 'CO₂ udledning sparet', icon: 'TreePine', color: 'from-green-500 to-emerald-600' },
    { value: 12, suffix: 't', label_en: 'Plastic Pollution Prevented', label_da: 'Plastforurening forhindret', icon: 'Recycle', color: 'from-blue-500 to-cyan-600' },
    { value: 200, suffix: '+', label_en: 'B2B Clients Served', label_da: 'B2B kunder', icon: 'Building2', color: 'from-purple-500 to-violet-600' },
];

interface StatItemProps {
    value: number;
    suffix: string;
    label: string;
    icon: React.ReactElement;
    color: string;
    index: number;
}

const StatItem = ({ value, suffix, label, icon, index }: StatItemProps) => {
    const { count, ref } = useCountUp(value, 2500);

    return (
        <motion.div
            key={label}
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className="text-center"
        >
            <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 mb-4 text-white">
                {icon}
            </div>
            <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl md:text-5xl font-bold text-white tabular-nums">
                    {count.toLocaleString()}
                </span>
                <span className="text-xl font-bold text-white/80">{suffix}</span>
            </div>
            <p className="text-sm text-white/60 mt-2 font-medium">{label}</p>
        </motion.div>
    );
};

const ImpactCounter = () => {
    const { language, t } = useLanguage();
    const { data: blocks } = useContentBlocks('homepage_impact');

    const stats = (blocks && blocks.length > 0)
        ? blocks.map(block => ({
            value: parseInt(block.value || '0', 10),
            suffix: (block.metadata as Record<string, string>)?.suffix || '+',
            label: language === 'da' ? (block.title_da || block.title_en || '') : (block.title_en || ''),
            icon: iconMap[block.icon || 'Package'] || <Package className="h-7 w-7" />,
            color: block.color || 'from-primary to-emerald-600',
        }))
        : defaultStats.map(d => ({
            value: d.value,
            suffix: d.suffix,
            label: language === 'da' ? d.label_da : d.label_en,
            icon: iconMap[d.icon] || <Package className="h-7 w-7" />,
            color: d.color,
        }));

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-700 to-teal-700" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_50%,_rgba(0,0,0,0.3))]" />

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        {t('home.impact.title')}
                    </h2>
                    <p className="text-white/70 max-w-xl mx-auto">
                        {t('home.impact.subtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatItem
                            key={stat.label}
                            value={stat.value}
                            suffix={stat.suffix}
                            label={stat.label}
                            icon={stat.icon}
                            color={stat.color}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImpactCounter;
