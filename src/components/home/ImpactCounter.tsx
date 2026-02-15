import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, TreePine, Recycle, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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

const ImpactCounter = () => {
    const { language } = useLanguage();

    const stats = [
        { value: 50000, suffix: '+', label: language === 'da' ? 'Øko-venlige poser leveret' : 'Eco-Friendly Bags Delivered', icon: <Package className="h-7 w-7" />, color: 'from-primary to-emerald-600' },
        { value: 18, suffix: 't', label: language === 'da' ? 'CO₂ udledning sparet' : 'CO₂ Emissions Saved', icon: <TreePine className="h-7 w-7" />, color: 'from-green-500 to-emerald-600' },
        { value: 12, suffix: 't', label: language === 'da' ? 'Plastforurening forhindret' : 'Plastic Pollution Prevented', icon: <Recycle className="h-7 w-7" />, color: 'from-blue-500 to-cyan-600' },
        { value: 200, suffix: '+', label: language === 'da' ? 'B2B kunder' : 'B2B Clients Served', icon: <Building2 className="h-7 w-7" />, color: 'from-purple-500 to-violet-600' },
    ];

    const counters = stats.map(s => useCountUp(s.value, 2500));

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
                        {language === 'da' ? 'Vores Påvirkning Indtil Videre' : 'Our Impact So Far'}
                    </h2>
                    <p className="text-white/70 max-w-xl mx-auto">
                        {language === 'da'
                            ? 'Hvert produkt tæller. Her er hvad vi har opnået sammen med vores kunder.'
                            : 'Every product counts. Here\'s what we\'ve achieved together with our clients.'}
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            ref={counters[index].ref}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="text-center"
                        >
                            <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 mb-4 text-white">
                                {stat.icon}
                            </div>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-4xl md:text-5xl font-bold text-white tabular-nums">
                                    {counters[index].count.toLocaleString()}
                                </span>
                                <span className="text-xl font-bold text-white/80">{stat.suffix}</span>
                            </div>
                            <p className="text-sm text-white/60 mt-2 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImpactCounter;
