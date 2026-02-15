import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
  className?: string;
}

const Breadcrumb = ({ items, currentPage, className }: BreadcrumbProps) => {
  const location = useLocation();
  const { t, language } = useLanguage();

  // Auto-generate breadcrumbs from URL if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter((x) => x);

    const routeLabels: Record<string, { en: string; da: string }> = {
      products: { en: 'Products', da: 'Produkter' },
      'our-story': { en: 'Our Story', da: 'Vores Historie' },
      sustainability: { en: 'Sustainability', da: 'Bæredygtighed' },
      journal: { en: 'Journal', da: 'Journal' },
      contact: { en: 'Contact', da: 'Kontakt' },
      auth: { en: 'Sign In', da: 'Log Ind' },
    };

    return pathnames.map((path, index) => {
      const href = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;

      // Check if it's a known route
      const routeLabel = routeLabels[path];
      let label = routeLabel
        ? (language === 'da' ? routeLabel.da : routeLabel.en)
        : path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

      return {
        label: isLast && currentPage ? currentPage : label,
        href: isLast ? undefined : href,
      };
    });
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("mb-2", className)}>
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", className ? "" : "text-muted-foreground")}>
        {/* Home */}
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">
              {language === 'da' ? 'Hjem' : 'Home'}
            </span>
          </Link>
        </li>

        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            {item.href ? (
              <Link
                to={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
