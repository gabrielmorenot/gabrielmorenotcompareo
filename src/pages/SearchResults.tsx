import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OfferCard } from '@/components/OfferCard';
import { useSearchOffers } from '@/hooks/useSearchOffers';
import { Loader2, SearchX, ArrowLeft } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: offers, isLoading } = useSearchOffers(query);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-8 md:py-12 bg-background">
          <div className="container">
            <div className="flex items-center gap-3 mb-8">
              <Link to="/" className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </Link>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Resultados para "{query}"
                </h1>
                {offers && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {offers.length} {offers.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                  </p>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : !query || query.length < 2 ? (
              <div className="text-center py-20">
                <SearchX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Digite pelo menos 2 caracteres para buscar.</p>
              </div>
            ) : offers && offers.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {offers.map(offer => (
                  <OfferCard key={offer.id} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <SearchX className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground mb-2">Nenhum resultado encontrado</h2>
                <p className="text-muted-foreground mb-6">
                  Não encontramos produtos para "{query}". Tente outro termo.
                </p>
                <Link to="/" className="btn-neon inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para Home
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
