import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import ScrollToTop from './ScrollToTop';
import WhatsAppChat from '@/components/WhatsAppChat';
import CookieConsent from '@/components/CookieConsent';
import SEOHead from '@/components/SEOHead';
import SkipToContent from '@/components/SkipToContent';
import Analytics from '@/components/Analytics';
import ExitIntentPopup from '@/components/ExitIntentPopup';
import CompareDrawer from '@/components/products/CompareDrawer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent />
      <SEOHead />
      <Header />
      {!isHomePage && (
        <div className="bg-[#f8f9fa] border-b border-gray-100">
          <div className="container py-2.5">
            <Breadcrumb className="mb-0" />
          </div>
        </div>
      )}
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
      <WhatsAppChat />
      <CookieConsent />
      <Analytics />
      <ExitIntentPopup />
      <CompareDrawer />
    </div>
  );
};

export default Layout;
