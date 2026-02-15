import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
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
  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent />
      <SEOHead />
      <Header />
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
