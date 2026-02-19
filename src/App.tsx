import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { CompareProvider } from "@/contexts/CompareContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import OurStory from "./pages/OurStory";
import Sustainability from "./pages/Sustainability";
import Journal from "./pages/Journal";
import JournalPost from "./pages/JournalPost";
import Contact from "./pages/Contact";
import WhyJute from "./pages/WhyJute";
import ImpactDashboard from "./pages/ImpactDashboard";
import CustomSolutions from "./pages/CustomSolutions";
import Certifications from "./pages/Certifications";
import CaseStudies from "./pages/CaseStudies";
import PricingGuide from "./pages/PricingGuide";
import ResourcesHub from "./pages/ResourcesHub";
import Careers from "./pages/Careers";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import ProductEditor from "./pages/admin/ProductEditor";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminQuotations from "./pages/admin/AdminQuotations";
import AdminBlog from "./pages/admin/AdminBlog";
import BlogEditor from "./pages/admin/BlogEditor";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminTranslations from "./pages/admin/AdminTranslations";
import AdminContentBlocks from "./pages/admin/AdminContentBlocks";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AppearanceSettings from "./pages/admin/settings/AppearanceSettings";
import GeneralSettings from "./pages/admin/settings/GeneralSettings";
import BrandingSettings from "./pages/admin/settings/BrandingSettings";
import ContactSettings from "./pages/admin/settings/ContactSettings";
import SocialSettings from "./pages/admin/settings/SocialSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <CurrencyProvider>
              <CompareProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Layout><Index /></Layout>} />
                    <Route path="/products" element={<Layout><Products /></Layout>} />
                    <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
                    <Route path="/our-story" element={<Layout><OurStory /></Layout>} />
                    <Route path="/sustainability" element={<Layout><Sustainability /></Layout>} />
                    <Route path="/why-jute" element={<Layout><WhyJute /></Layout>} />
                    <Route path="/impact" element={<Layout><ImpactDashboard /></Layout>} />
                    <Route path="/custom-solutions" element={<Layout><CustomSolutions /></Layout>} />
                    <Route path="/certifications" element={<Layout><Certifications /></Layout>} />
                    <Route path="/case-studies" element={<Layout><CaseStudies /></Layout>} />
                    <Route path="/pricing" element={<Layout><PricingGuide /></Layout>} />
                    <Route path="/resources" element={<Layout><ResourcesHub /></Layout>} />
                    <Route path="/careers" element={<Layout><Careers /></Layout>} />
                    <Route path="/journal" element={<Layout><Journal /></Layout>} />
                    <Route path="/journal/:slug" element={<Layout><JournalPost /></Layout>} />
                    <Route path="/contact" element={<Layout><Contact /></Layout>} />
                    <Route path="/auth" element={<Auth />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/products" element={<ProtectedRoute requireAdmin><AdminLayout><AdminProducts /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/products/:id" element={<ProtectedRoute requireAdmin><AdminLayout><ProductEditor /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/categories" element={<ProtectedRoute requireAdmin><AdminLayout><AdminCategories /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/quotations" element={<ProtectedRoute requireAdmin><AdminLayout><AdminQuotations /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/blog" element={<ProtectedRoute requireAdmin><AdminLayout><AdminBlog /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/blog/:id" element={<ProtectedRoute requireAdmin><AdminLayout><BlogEditor /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute requireAdmin><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/translations" element={<ProtectedRoute requireAdmin><AdminLayout><AdminTranslations /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/content" element={<ProtectedRoute requireAdmin><AdminLayout><AdminContentBlocks /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/feedback" element={<ProtectedRoute requireAdmin><AdminLayout><AdminFeedback /></AdminLayout></ProtectedRoute>} />

                    {/* Admin Settings Routes */}
                    <Route path="/admin/settings/appearance" element={<ProtectedRoute requireAdmin><AdminLayout><AppearanceSettings /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/settings/general" element={<ProtectedRoute requireAdmin><AdminLayout><GeneralSettings /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/settings/branding" element={<ProtectedRoute requireAdmin><AdminLayout><BrandingSettings /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/settings/contact" element={<ProtectedRoute requireAdmin><AdminLayout><ContactSettings /></AdminLayout></ProtectedRoute>} />
                    <Route path="/admin/settings/social" element={<ProtectedRoute requireAdmin><AdminLayout><SocialSettings /></AdminLayout></ProtectedRoute>} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </CompareProvider>
            </CurrencyProvider>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider >
);

export default App;
