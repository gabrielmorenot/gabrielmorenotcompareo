import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OfferCard } from '@/components/OfferCard';
import { useOffer, useRelatedOffers } from '@/hooks/useData';
import { CATEGORIES } from '@/types';
import { Loader2, ExternalLink, Store, Tag, Calendar, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { data: offer, isLoading, error } = useOffer(id!);
  const { data: relatedOffers } = useRelatedOffers(offer?.category, id);

  const categoryLabel = offer ? CATEGORIES.find(c => c.value === offer.category)?.label : '';
  const categoryIcon = offer ? CATEGORIES.find(c => c.value === offer.category)?.icon : '';

  const originalPrice = offer?.discount && offer.discount > 0
    ? offer.price / (1 - offer.discount / 100)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center py-20">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Produto não encontrado</h1>
          <p className="text-muted-foreground mb-6">O produto que você procura não existe ou foi removido.</p>
          <Link to="/" className="btn-neon inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar para Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Breadcrumb */}
        <div className="bg-secondary/30 border-b border-border">
          <div className="container py-3">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to={`/?categoria=${offer.category}`} className="hover:text-foreground transition-colors">
                {categoryLabel}
              </Link>
              <span>/</span>
              <span className="text-foreground truncate max-w-[200px]">{offer.name}</span>
            </nav>
          </div>
        </div>

        {/* Product Hero Section */}
        <section className="py-8 md:py-12 bg-background">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-8 lg:gap-12"
            >
              {/* Product Image */}
              <div className="relative">
                {offer.discount && offer.discount > 0 && (
                  <span className="badge-discount z-10">
                    <Tag className="w-3 h-3 inline mr-1" />
                    -{offer.discount}%
                  </span>
                )}
                <div className="aspect-square bg-card rounded-2xl overflow-hidden border border-border">
                  {offer.image_url ? (
                    <img
                      src={offer.image_url}
                      alt={offer.name}
                      className="w-full h-full object-contain p-8"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Sem imagem
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                {offer.stores && (
                  <div className="flex items-center gap-2 mb-3">
                    {offer.stores.logo_url ? (
                      <img src={offer.stores.logo_url} alt={offer.stores.name} className="h-6 w-auto" />
                    ) : (
                      <Store className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium text-muted-foreground">{offer.stores.name}</span>
                  </div>
                )}

                <span className="inline-flex items-center gap-1 text-sm text-primary font-medium mb-2">
                  <span>{categoryIcon}</span> {categoryLabel}
                </span>

                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  {offer.name}
                </h1>

                {/* Price */}
                <div className="mb-6">
                  {originalPrice && (
                    <span className="text-lg text-muted-foreground line-through block mb-1">
                      R$ {originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  )}
                  <p className="text-4xl md:text-5xl font-bold text-foreground">
                    R$ {Number(offer.price).toFixed(2).replace('.', ',')}
                  </p>
                  {offer.discount && offer.discount > 0 && (
                    <span className="text-sm text-primary font-medium mt-1 block">
                      Economize R$ {(originalPrice! - offer.price).toFixed(2).replace('.', ',')}
                    </span>
                  )}
                </div>

                {/* CTA Button */}
                <a
                  href={offer.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-neon w-full md:w-auto inline-flex items-center justify-center gap-3 text-lg py-4 px-8 mb-3"
                >
                  Ir para a loja
                  <ExternalLink className="w-5 h-5" />
                </a>
                <p className="text-sm text-muted-foreground text-center md:text-left">
                  Você será redirecionado para o site da loja parceira.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Offer Info Section */}
        <section className="py-8 bg-secondary/30 border-y border-border">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Store className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Loja</span>
                </div>
                <p className="font-semibold text-foreground">{offer.stores?.name || 'Não informada'}</p>
              </div>

              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Categoria</span>
                </div>
                <p className="font-semibold text-foreground">{categoryLabel}</p>
              </div>

              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Tipo</span>
                </div>
                <p className="font-semibold text-foreground">
                  {offer.is_daily_offer ? 'Oferta do dia' : 'Oferta comum'}
                </p>
              </div>

              <div className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase">Atualizado</span>
                </div>
                <p className="font-semibold text-foreground">
                  {format(new Date(offer.updated_at), "dd 'de' MMM", { locale: ptBR })}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="py-8 bg-background">
          <div className="container">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-muted/50 rounded-xl p-6 border border-border"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  O Compareo é um site de publicidade na internet e não realiza vendas. 
                  Os preços, condições e disponibilidade são de responsabilidade da loja anunciante.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Products Section */}
        {relatedOffers && relatedOffers.length > 0 && (
          <section className="py-12 bg-secondary/30">
            <div className="container">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="section-title">Produtos Relacionados</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {relatedOffers.map((relatedOffer) => (
                    <OfferCard key={relatedOffer.id} offer={relatedOffer} />
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
