import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { CategoryFilter } from '@/components/CategoryFilter';
import { BannerSection } from '@/components/BannerSection';
import { OfferCard } from '@/components/OfferCard';
import { useOffers, useBanners } from '@/hooks/useData';
import type { Category } from '@/types';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { data: offers, isLoading: loadingOffers } = useOffers(selectedCategory);
  const { data: banners } = useBanners();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        
        {/* Ofertas do Dia */}
        <section id="ofertas" className="py-12 bg-background">
          <div className="container">
            <h2 className="section-title">
              {selectedCategory ? `Ofertas em ${selectedCategory}` : 'Ofertas do Dia'}
            </h2>
            
            {loadingOffers ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : offers && offers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {offers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">
                  Nenhuma oferta encontrada{selectedCategory ? ' nesta categoria' : ''}.
                </p>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="mt-4 text-primary font-medium hover:underline"
                  >
                    Ver todas as ofertas
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
        
        <BannerSection banners={banners || []} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
