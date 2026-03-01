import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SiteSettingsProvider } from "@/hooks/useSiteSettings";
import Index from "./pages/Index";
import SearchResults from "./pages/SearchResults";
import ProductPage from "./pages/ProductPage";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOffers from "./pages/AdminOffers";
import AdminBanners from "./pages/AdminBanners";
import AdminPromoBanners from "./pages/AdminPromoBanners";
import AdminStores from "./pages/AdminStores";
import AdminCategories from "./pages/AdminCategories";
import AdminAppearance from "./pages/AdminAppearance";
import AdminMenu from "./pages/AdminMenu";
import AdminPopups from "./pages/AdminPopups";
import AdminHeroPromos from "./pages/AdminHeroPromos";
import AdminProductTypes from "./pages/AdminProductTypes";
import { PopupDisplay } from "./components/PopupDisplay";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SiteSettingsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PopupDisplay />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/busca" element={<SearchResults />} />
              <Route path="/produto/:id" element={<ProductPage />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="offers" element={<AdminOffers />} />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="promo-banners" element={<AdminPromoBanners />} />
                <Route path="stores" element={<AdminStores />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="product-types" element={<AdminProductTypes />} />
                <Route path="appearance" element={<AdminAppearance />} />
                <Route path="menu" element={<AdminMenu />} />
                <Route path="popups" element={<AdminPopups />} />
                <Route path="hero-promos" element={<AdminHeroPromos />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SiteSettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
