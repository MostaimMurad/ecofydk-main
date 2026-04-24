import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Sun, Moon, Leaf, Shield, LogIn, LogOut, ChevronDown, BookOpen, Lightbulb, TreePine, Newspaper } from 'lucide-react';
import ecofyLogo from '@/assets/ecofy-logo.png';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import CurrencySelector from '@/components/CurrencySelector';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const moreTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { language, setLanguage, t } = useLanguage();
  const { resolvedTheme, setTheme } = useTheme();
  const { user, isAdmin } = useAuth();
  const { data: settings } = useSiteSettings();
  const location = useLocation();
  const navigate = useNavigate();

  // Get site title based on language
  const siteTitle = language === 'da' ? settings?.site_title_da : settings?.site_title_en;

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary nav links (always visible) — new sequence per user request
  const primaryLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/our-story', label: t('nav.about-us') },
    { href: '/why-jute', label: t('nav.about-jute') },
    { href: '/innovation', label: t('nav.innovation') },
    { href: '/gallery', label: t('nav.gallery') },
    { href: '/journal', label: t('nav.blog') },
  ];

  // Secondary nav links (inside "More" dropdown)
  const moreLinks = [
    { href: '/products', label: t('nav.products'), icon: BookOpen, desc: language === 'da' ? 'Se vores produkter' : 'Browse our products' },
    { href: '/partnerships', label: t('nav.partnerships'), icon: Globe, desc: language === 'da' ? 'B2B partnerskaber' : 'B2B partnerships' },
    { href: '/sustainability', label: t('nav.sustainability'), icon: TreePine, desc: language === 'da' ? 'Vores bæredygtige praksis' : 'Our sustainable practices' },
    { href: '/contact', label: t('nav.contact'), icon: Newspaper, desc: language === 'da' ? 'Kontakt os' : 'Get in touch' },
  ];

  // All links combined for mobile
  const allLinks = [
    ...primaryLinks,
    ...moreLinks.map(l => ({ href: l.href, label: l.label })),
  ];

  const isMoreActive = moreLinks.some(l => location.pathname === l.href);

  const handleMoreEnter = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    setIsMoreOpen(true);
  };
  const handleMoreLeave = () => {
    moreTimeoutRef.current = setTimeout(() => setIsMoreOpen(false), 200);
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'da', label: 'Dansk', flag: '🇩🇰' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-primary/15 shadow-lg shadow-black/5"
          : "bg-background/90 backdrop-blur-md border-b border-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link to="/" className="group flex items-center">
          {(settings?.logo_url || ecofyLogo) ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <img
                src={settings?.logo_url || ecofyLogo}
                alt={siteTitle || 'Ecofy'}
                className="h-9 md:h-11 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </motion.div>
          ) : (
            <span className="font-serif text-2xl font-bold text-primary md:text-3xl">
              {siteTitle || 'Ecofy'}
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {primaryLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link
                to={link.href}
                className={cn(
                  'group relative px-4 py-2 text-[13px] font-semibold tracking-wide uppercase rounded-full transition-all duration-300',
                  location.pathname === link.href
                    ? 'text-white dark:text-white'
                    : 'text-foreground/70 hover:text-primary'
                )}
              >
                {location.pathname === link.href && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-full bg-primary shadow-md shadow-primary/25"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {location.pathname !== link.href && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-primary rounded-full transition-all duration-300 group-hover:w-5" />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            </motion.div>
          ))}

          {/* "More" Dropdown */}
          <motion.div
            ref={moreRef}
            className="relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: primaryLinks.length * 0.05 }}
            onMouseEnter={handleMoreEnter}
            onMouseLeave={handleMoreLeave}
          >
            <button
              className={cn(
                'group relative flex items-center gap-1 px-4 py-2 text-[13px] font-semibold tracking-wide uppercase rounded-full transition-all duration-300',
                isMoreActive
                  ? 'text-white dark:text-white'
                  : 'text-foreground/70 hover:text-primary'
              )}
              onClick={() => setIsMoreOpen(!isMoreOpen)}
            >
              {isMoreActive && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-full bg-primary shadow-md shadow-primary/25"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{language === 'da' ? 'Mere' : 'More'}</span>
              <ChevronDown className={cn(
                "relative z-10 h-3.5 w-3.5 transition-transform duration-300",
                isMoreOpen && "rotate-180"
              )} />
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
              {isMoreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full right-0 mt-2 w-72 rounded-2xl bg-white/95 dark:bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl shadow-black/10 overflow-hidden z-50"
                >
                  <div className="p-2">
                    {moreLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsMoreOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200',
                          location.pathname === link.href
                            ? 'bg-primary/10 text-primary'
                            : 'text-foreground/80 hover:bg-muted/80 hover:text-foreground'
                        )}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                          location.pathname === link.href
                            ? "bg-primary/15 text-primary"
                            : "bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          <link.icon className="h-4.5 w-4.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold">{link.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{link.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </nav>

        {/* Theme Toggle, Language Switcher & Mobile Menu Button */}
        <div className="flex items-center gap-1.5">
          {/* Theme Toggle */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="h-10 w-10 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {resolvedTheme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-4 w-4 text-amber-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-4 w-4 text-slate-600" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="sr-only">Toggle theme</span>
            </Button>
          </motion.div>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 gap-2 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300 px-3"
                >
                  <Globe className="h-4 w-4 text-primary" />
                  <span className="text-base">
                    {languages.find((l) => l.code === language)?.flag}
                  </span>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white/90 dark:bg-black/90 backdrop-blur-xl border-primary/10 shadow-xl"
            >
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    'gap-3 cursor-pointer transition-colors',
                    language === lang.code && 'bg-primary/10'
                  )}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth / Admin Buttons */}
          {!user ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth')}
                className="h-10 gap-2 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300 px-3"
              >
                <LogIn className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline text-sm font-medium">Login</span>
              </Button>
            </motion.div>
          ) : (
            <>
              {isAdmin && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="h-10 gap-2 rounded-full bg-primary/10 dark:bg-primary/20 backdrop-blur-sm border border-primary/20 hover:border-primary/40 hover:bg-primary/20 transition-all duration-300 px-3"
                  >
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="hidden sm:inline text-sm font-medium text-primary">{t('nav.admin')}</span>
                  </Button>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate('/');
                  }}
                  className="h-10 w-10 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-primary/10 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground" />
                </Button>
              </motion.div>
            </>
          )}

          {/* Mobile Menu Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden border-t border-primary/10 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="container flex flex-col gap-2 py-6">
              {/* Primary Links */}
              {primaryLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold tracking-wide transition-all duration-300',
                      location.pathname === link.href
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'text-foreground/70 hover:bg-primary/5 hover:text-primary'
                    )}
                  >
                    {location.pathname === link.href && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* "More" Section Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: primaryLinks.length * 0.05 }}
                className="mt-2 mb-1 px-4"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <span>{language === 'da' ? 'Mere' : 'More'}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
              </motion.div>

              {/* Secondary Links */}
              {moreLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (primaryLinks.length + index + 1) * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold tracking-wide transition-all duration-300',
                      location.pathname === link.href
                        ? 'bg-primary text-white shadow-md shadow-primary/25'
                        : 'text-foreground/70 hover:bg-primary/5 hover:text-primary'
                    )}
                  >
                    <link.icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Admin Link in Mobile Menu */}
              {user && isAdmin && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: allLinks.length * 0.05 }}
                >
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20',
                      location.pathname.startsWith('/admin')
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Shield className="h-4 w-4 text-primary" />
                    {t('nav.admin')}
                  </Link>
                </motion.div>
              )}

              {/* Login / Logout in Mobile Menu */}
              {!user ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (allLinks.length + 1) * 0.05 }}
                >
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 text-primary hover:bg-primary/5"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (allLinks.length + 1) * 0.05 }}
                >
                  <button
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await supabase.auth.signOut();
                      navigate('/');
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
