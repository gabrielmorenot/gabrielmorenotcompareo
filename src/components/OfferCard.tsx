import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Offer } from '@/types';
import { ChevronRight, Tag } from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const originalPrice = offer.discount && offer.discount > 0 
    ? offer.price / (1 - offer.discount / 100) 
    : null;

  // Calculate max installments without interest (common BR e-commerce logic)
  const getInstallments = (price: number) => {
    if (price >= 600) return 12;
    if (price >= 300) return 10;
    if (price >= 100) return 6;
    if (price >= 50) return 3;
    return 1;
  };

  const installments = getInstallments(Number(offer.price));
  const installmentValue = Number(offer.price) / installments;

  return (
    <Link to={`/produto/${offer.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="card-offer relative flex flex-col h-full cursor-pointer"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {offer.discount && offer.discount > 0 && (
          <span className="badge-discount z-10">
            <Tag className="w-3 h-3 inline mr-1" />
            -{offer.discount}%
          </span>
        )}
        
        <div className="aspect-square bg-white relative overflow-hidden">
          {offer.image_url ? (
            <img
              src={offer.image_url}
              alt={offer.name}
              className="w-full h-full object-contain p-4"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Sem imagem
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-normal text-base line-clamp-2 mb-2 text-foreground">
            {offer.name}
          </h3>

          {offer.stores && (
            <span className="text-xs text-muted-foreground mb-1">
              Menor preço em <span className="font-semibold text-foreground">{offer.stores.name}</span>
            </span>
          )}
          
          <div className="mt-auto pt-2">
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through block">
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
            
            <p className="text-xl font-bold text-foreground">
              R$ {Number(offer.price).toFixed(2).replace('.', ',')}
            </p>

            {installments > 1 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Pague em até {installments}x de R$ {installmentValue.toFixed(2).replace('.', ',')} <span style={{ color: '#3DC042' }} className="font-semibold">sem juros</span>
              </p>
            )}
            
            <span className="w-full mt-3 inline-flex items-center justify-center gap-2 text-sm whitespace-nowrap font-semibold px-6 rounded-full transition-all duration-300 hover:opacity-90" style={{ height: '50px', borderRadius: '30px', backgroundColor: '#E3FF00', color: '#1a1a1a' }}>
              Ver oferta
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
