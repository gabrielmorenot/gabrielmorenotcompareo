import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { CategoryFilter } from '@/components/CategoryFilter';
import { BannerSection } from '@/components/BannerSection';
import { BannerPairSection } from '@/components/BannerPairSection';
import { HeroPromoSection } from '@/components/HeroPromoSection';
import { StoresSection } from '@/components/StoresSection';
import { ProductTypesSection } from '@/components/ProductTypesSection';
import { OfferCard } from '@/components/OfferCard';
import { useOffers, useBanners } from '@/hooks/useData';
import { useCategories } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const { data: dailyOffers, isLoading: loadingDaily } = useOffers(null);
  const { data: filteredOffers, isLoading: loadingFiltered } = useOffers(selectedCategory);
  const { data: banners } = useBanners();
  const { data: categories } = useCategories();

  // Auto-select the first category when categories load
  useEffect(() => {
    if (categories && categories.length > 0 && selectedCategory === null) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories]);

  const selectedCategoryName = selectedCategory
    ? categories?.find(c => c.id === selectedCategory)?.name
    : null;

  // "Next" category (for 8th section)
  const nextCategory = useMemo(() => {
    if (!selectedCategory || !categories || categories.length < 2) return null;
    const idx = categories.findIndex(c => c.id === selectedCategory);
    if (idx === -1) return null;
    return categories[(idx + 1) % categories.length];
  }, [selectedCategory, categories]);

  // "Third" category (for 10th section)
  const thirdCategory = useMemo(() => {
    if (!selectedCategory || !categories || categories.length < 3) return null;
    const idx = categories.findIndex(c => c.id === selectedCategory);
    if (idx === -1) return null;
    return categories[(idx + 2) % categories.length];
  }, [selectedCategory, categories]);

  const { data: nextCategoryOffers, isLoading: loadingNext } = useOffers(nextCategory?.id ?? null);
  const { data: thirdCategoryOffers, isLoading: loadingThird } = useOffers(thirdCategory?.id ?? null);

  // Filter offers by product type name
  const productTypeOffers = useMemo(() => {
    if (!selectedProductType || !dailyOffers) return [];
    return dailyOffers.filter(o => o.name.toLowerCase().includes(selectedProductType.toLowerCase()));
  }, [selectedProductType, dailyOffers]);

  // Split banners: first 3 for BannerSection, next 2 for BannerPairSection
  const mainBanners = banners?.slice(0, 3) || [];
  const pairBanners = banners?.slice(3, 5) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* 1. Ofertas do Dia */}
        <section id="ofertas" className="py-12 bg-background">
          <div className="container">
            <h2 className="section-title">Ofertas do Dia</h2>
            {loadingDaily ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : dailyOffers && dailyOffers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {dailyOffers.slice(0, 10).map((offer) => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">Nenhuma oferta encontrada.</p>
              </div>
            )}
          </div>
        </section>

        {/* 2. Hero Slides */}
        <HeroPromoSection />

        {/* 3. Categorias */}
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* 4. Resultado do filtro por categoria */}
        {selectedCategory && (
          <section className="py-12 bg-background">
            <div className="container">
              <h2 className="section-title">
                {selectedCategoryName ? `Ofertas em ${selectedCategoryName}` : 'Ofertas'}
              </h2>
              {loadingFiltered ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredOffers && filteredOffers.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                  {filteredOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">Nenhuma oferta encontrada nesta categoria.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 5. Lojas Confiáveis */}
        <StoresSection />

        {/* 6. Hero Section */}
        <HeroSection />

        {/* 7. Tipos de Produto */}
        <ProductTypesSection selected={selectedProductType} onSelect={setSelectedProductType} />

        {/* Resultado do filtro por tipo de produto */}
        {selectedProductType && (
          <section className="py-12 bg-background">
            <div className="container">
              <h2 className="section-title">Ofertas de {selectedProductType}</h2>
              {productTypeOffers.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                  {productTypeOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">Nenhuma oferta encontrada para {selectedProductType}.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 8. Resultado da próxima categoria */}
        {selectedCategory && nextCategory && (
          <section className="py-12 bg-background">
            <div className="container">
              <h2 className="section-title">Ofertas em {nextCategory.name}</h2>
              {loadingNext ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : nextCategoryOffers && nextCategoryOffers.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                  {nextCategoryOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">Nenhuma oferta encontrada em {nextCategory.name}.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 9. Banners em dupla */}
        <BannerPairSection banners={pairBanners.length > 0 ? pairBanners : mainBanners} />

        {/* 10. Resultado da terceira categoria */}
        {selectedCategory && thirdCategory && (
          <section className="py-12 bg-background">
            <div className="container">
              <h2 className="section-title">Ofertas em {thirdCategory.name}</h2>
              {loadingThird ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : thirdCategoryOffers && thirdCategoryOffers.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                  {thirdCategoryOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">Nenhuma oferta encontrada em {thirdCategory.name}.</p>
                </div>
              )}
            </div>
          </section>
        )}

        <BannerSection banners={mainBanners} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
