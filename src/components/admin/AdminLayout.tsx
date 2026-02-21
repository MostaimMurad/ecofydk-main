import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Package,
  FileText,
  MessageSquare,
  Users,
  LogOut,
  Menu,
  X,
  Leaf,
  ChevronRight,
  Palette,
  Globe,
  ImageIcon,
  Phone,
  Share2,
  ChevronDown,
  Languages,
  Layers,
  Bug,
  FolderOpen,
  Home,
  BookOpen,
  ShieldCheck,
  BarChart3,
  Briefcase,
  DollarSign,
  Wrench,
  LayoutGrid,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import AdminFeedbackForm from './AdminFeedbackForm';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  icon: any;
  label: string;
  adminOnly?: boolean;
}

interface NavGroup {
  label: string;
  adminOnly?: boolean;
  items: NavItem[];
}

// ── Content Manager sub-pages ──────────────────────────────────────
const CONTENT_SUB_PAGES = [
  { id: 'all', label: 'All Pages', icon: LayoutGrid },
  { id: 'homepage', label: 'Homepage', icon: Home },
  { id: 'our-story', label: 'Our Story', icon: BookOpen },
  { id: 'sustainability', label: 'Sustainability', icon: Leaf },
  { id: 'contact', label: 'Contact', icon: Globe },
  { id: 'footer', label: 'Footer', icon: LayoutGrid },
  { id: 'why-jute', label: 'Why Jute', icon: ShieldCheck },
  { id: 'certifications-page', label: 'Certifications', icon: ShieldCheck },
  { id: 'impact', label: 'Impact', icon: BarChart3 },
  { id: 'case-studies', label: 'Case Studies', icon: Briefcase },
  { id: 'pricing', label: 'Pricing', icon: DollarSign },
  { id: 'careers', label: 'Careers', icon: Users },
  { id: 'resources', label: 'Resources', icon: FileText },
  { id: 'custom', label: 'Custom Solutions', icon: Wrench },
];

const navGroups: NavGroup[] = [
  {
    label: 'Main Menu',
    items: [
      { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/admin/products', icon: Package, label: 'Products' },
      { href: '/admin/categories', icon: FolderOpen, label: 'Categories' },
      { href: '/admin/quotations', icon: MessageSquare, label: 'Quotations' },
      { href: '/admin/blog', icon: FileText, label: 'Blog' },
      // Content Manager is handled separately (has sub-menu)
      { href: '/admin/media', icon: ImageIcon, label: 'Media Library' },
      { href: '/admin/feedback', icon: Bug, label: 'Issue Tracker' },
    ]
  },
  {
    label: 'Site Settings',
    items: [
      { href: '/admin/settings/appearance', icon: Palette, label: 'Appearance' },
      { href: '/admin/settings/general', icon: Globe, label: 'General' },
      { href: '/admin/settings/branding', icon: ImageIcon, label: 'Branding' },
      { href: '/admin/settings/contact', icon: Phone, label: 'Contact' },
      { href: '/admin/settings/social', icon: Share2, label: 'Social Links' },
    ]
  },
  {
    label: 'Admin',
    adminOnly: true,
    items: [
      { href: '/admin/users', icon: Users, label: 'Users' },
      { href: '/admin/translations', icon: Languages, label: 'Translations' },
    ]
  }
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, userRole, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Main Menu': true,
    'Site Settings': true,
    'Admin': true,
  });
  const [contentSubOpen, setContentSubOpen] = useState(() =>
    location.pathname.startsWith('/admin/content')
  );

  // Open ticket count for badge
  const { data: openTicketCount } = useQuery({
    queryKey: ['admin-feedback-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('feedback_tickets')
        .select('*', { count: 'exact', head: true })
        .in('status', ['open', 'in_progress']);
      if (error) return 0;
      return count || 0;
    },
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isItemActive = (href: string) => {
    if (href === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(href);
  };

  const isContentActive = location.pathname.startsWith('/admin/content');
  const activeContentPage = searchParams.get('page') || 'all';

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const filteredGroups = navGroups.filter(
    (group) => !group.adminOnly || userRole === 'admin'
  );

  // ── Render a single nav item ─────────────────────────────────
  const renderNavItem = (item: NavItem) => {
    const isActive = isItemActive(item.href);
    const showBadge = item.href === '/admin/feedback' && openTicketCount && openTicketCount > 0;
    return (
      <Link
        key={item.href}
        to={item.href}
        onClick={() => setSidebarOpen(false)}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <item.icon className="h-4 w-4" />
        {item.label}
        {showBadge && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
            {openTicketCount}
          </span>
        )}
        {isActive && !showBadge && <ChevronRight className="ml-auto h-4 w-4" />}
      </Link>
    );
  };

  // ── Content Manager sub-menu ──────────────────────────────────
  const renderContentManagerNav = () => (
    <div className="space-y-0.5">
      {/* Content Manager parent */}
      <button
        onClick={() => {
          setContentSubOpen(!contentSubOpen);
          if (!isContentActive) {
            navigate('/admin/content');
            setSidebarOpen(false);
          }
        }}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          isContentActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <Layers className="h-4 w-4" />
        Content Manager
        <ChevronDown className={cn(
          "ml-auto h-4 w-4 transition-transform",
          contentSubOpen && "rotate-180"
        )} />
      </button>

      {/* Sub-pages */}
      {contentSubOpen && (
        <div className="ml-3 pl-4 border-l-2 border-border/50 space-y-0.5 py-1">
          {CONTENT_SUB_PAGES.map(sub => {
            const isSubActive = isContentActive && activeContentPage === sub.id;
            const SubIcon = sub.icon;
            return (
              <Link
                key={sub.id}
                to={sub.id === 'all' ? '/admin/content' : `/admin/content?page=${sub.id}`}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors",
                  isSubActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <SubIcon className="h-3.5 w-3.5" />
                {sub.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Link to="/admin" className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-serif font-bold">Ecofy Admin</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Logo - Fixed Height */}
          <div className="hidden lg:flex items-center gap-2 p-6 border-b flex-shrink-0">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="font-serif text-xl font-bold">Ecofy Admin</span>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredGroups.map((group) => (
              <Collapsible
                key={group.label}
                open={openGroups[group.label]}
                onOpenChange={() => toggleGroup(group.label)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
                  <span>{group.label}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openGroups[group.label] && "rotate-180"
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1 space-y-0.5">
                  {group.items
                    .filter(item => !item.adminOnly || userRole === 'admin')
                    .map((item, _i, filteredItems) => {
                      // Insert Content Manager after Blog
                      const rendered = renderNavItem(item);
                      if (item.label === 'Blog') {
                        return (
                          <div key={`${item.href}-with-content`}>
                            {rendered}
                            {renderContentManagerNav()}
                          </div>
                        );
                      }
                      return rendered;
                    })}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </nav>

          {/* User Info - Fixed at Bottom */}
          <div className="flex-shrink-0 p-4 border-t bg-background">
            <div className="mb-3 px-2">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {userRole === 'admin' ? 'Admin' : 'Editor'}
              </p>
            </div>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
              <Button
                variant="outline"
                className="w-full"
                asChild
              >
                <Link to="/">View Website</Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:min-h-[calc(100vh)]">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 lg:p-8"
          >
            {children}
          </motion.div>
        </main>

        {/* Floating Feedback Form */}
        <AdminFeedbackForm />
      </div>
    </div>
  );
};

export default AdminLayout;
