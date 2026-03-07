import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore, useStoreOffers, useSuggestedOffers } from '@/hooks/useStoreOffers';
import { useCategories } from '@/hooks/useCategories';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OfferCard } from '@/components/OfferCard';
import { ArrowRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '@/types';

export default function StorePage() {
  const { id } = useParams<{ id: string }>();
  const { data: store, isLoading: storeLoading } = useStore(id || '');
  const { data: categories } = useCategories();
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const { data: offers, isLoading: offersLoading } = useStoreOffers(id || '', categoryFilter || null);
  const { data: suggestedOffers } = useSuggestedOffers(id || '', categoryFilter || null);

  const firstRowOffers = useMemo(() => offers?.slice(0, 10) || [], [offers]);
  const remainingOffers = useMemo(() => offers?.slice(10) || [], [offers]);

  const categoryOptions = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map(c => ({ value: c.id, label: c.name }));
    }
    return CATEGORIES.map(c => ({ value: c.value, label: c.label }));
  }, [categories]);

  const selectedLabel = categoryFilter
    ? categoryOptions.find(c => c.value === categoryFilter)?.label || ''
    : '';

  if (storeLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center text-muted-foreground">Carregando...</div>
        <Footer />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground mb-4">Loja não encontrada</p>
          <Link to="/" className="text-primary underline">Voltar para a home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Store Hero */}
      <section className="bg-[#191919]">
        <div className="container py-8 md:py-12">
          <Link to="/" className="inline-flex items-center gap-1 text-white/60 text-sm mb-6 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {store.logo_url ? (
                  <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white/60">{store.name.charAt(0)}</span>
                )}
              </div>

              <div>
                <h1 className="text-white text-2xl md:text-4xl font-bold">{store.name}</h1>
                {store.cashback_percent && store.cashback_percent > 0 && (
                  <p className="text-white/80 text-sm md:text-base mt-1">
                    Você recebe até <span className="font-bold text-white">{store.cashback_percent}% do valor</span> de suas compras
                  </p>
                )}
              </div>
            </div>

            {store.link && (
              <a
                href={store.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base md:text-lg transition-all hover:opacity-90 flex-shrink-0"
                style={{ backgroundColor: '#E3FF00', color: '#191919' }}
              >
                {store.cta_text || 'Ativar cashback agora'}
                <ArrowRight className="w-5 h-5" />
              </a>
            )}
          </div>

          {/* Category Filter */}
          <div className="mt-6 relative inline-block">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 pr-10 rounded-lg border text-sm font-medium bg-transparent text-white appearance-none cursor-pointer min-w-[200px]"
              style={{ borderColor: '#E3FF00' }}
            >
              <option value="" className="bg-[#191919] text-white">Todas as categorias</option>
              {categoryOptions.map(cat => (
                <option key={cat.value} value={cat.value} className="bg-[#191919] text-white">
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 1. First 2 rows of category results */}
      <section className="py-8 md:py-12">
        <div className="container">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
            {selectedLabel
              ? `Cashback e ofertas em ${selectedLabel}`
              : `Todas as ofertas de ${store.name}`}
          </h2>

          {offersLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : firstRowOffers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {firstRowOffers.map(offer => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {categoryFilter
                  ? 'Nenhuma oferta encontrada para essa categoria nesta loja.'
                  : 'Nenhuma oferta disponível nesta loja no momento.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 2. Suggested offers from other stores */}
      {suggestedOffers && suggestedOffers.length > 0 && (
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="container">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
              {categoryFilter && selectedLabel
                ? `Achamos esses resultados de ${selectedLabel} aqui também`
                : 'Sugestões de ofertas imperdíveis que já acabam'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {suggestedOffers.map(offer => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Remaining offers from selected category */}
      {remainingOffers.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="container">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
              {selectedLabel
                ? `Mais ofertas em ${selectedLabel}`
                : `Mais ofertas de ${store.name}`}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {remainingOffers.map(offer => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
