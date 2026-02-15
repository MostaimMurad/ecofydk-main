import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from 'framer-motion';
import { Home, Search, ArrowLeft, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Floating leaves
  const leaves = Array.from({ length: 8 }, (_, i) => ({
    x: Math.random() * 100,
    delay: i * 1.5,
    duration: 10 + Math.random() * 8,
  }));

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 overflow-hidden">
      {/* Floating leaves */}
      {leaves.map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: `${leaf.x}%`, top: -20 }}
          animate={{
            y: [0, window.innerHeight + 50],
            x: [0, Math.sin(i) * 80],
            rotate: [0, 360],
            opacity: [0, 0.3, 0],
          }}
          transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: 'linear' }}
        >
          <Leaf className="h-6 w-6 text-primary/20" />
        </motion.div>
      ))}

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Large 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', damping: 15, duration: 0.8 }}
          className="mb-6"
        >
          <span className="text-[10rem] sm:text-[12rem] font-black leading-none bg-gradient-to-br from-primary/20 via-primary/10 to-emerald-500/20 bg-clip-text text-transparent select-none">
            404
          </span>
        </motion.div>

        {/* Message */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3">
            {language === 'da' ? 'Siden blev ikke fundet' : 'Page Not Found'}
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-2">
            {language === 'da'
              ? 'Den side du leder efter eksisterer ikke eller er blevet flyttet.'
              : 'The page you\'re looking for doesn\'t exist or has been moved.'}
          </p>
          <p className="text-xs text-muted-foreground/60 mb-8 font-mono">
            {location.pathname}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25 px-8">
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              {language === 'da' ? 'Gå til Forside' : 'Go Home'}
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full border-primary/30 hover:bg-primary/5 px-8">
            <Link to="/products">
              <Search className="h-4 w-4 mr-2" />
              {language === 'da' ? 'Se Produkter' : 'Browse Products'}
            </Link>
          </Button>
        </motion.div>

        {/* Back link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <button
            onClick={() => window.history.back()}
            className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {language === 'da' ? 'Gå tilbage' : 'Go back'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
