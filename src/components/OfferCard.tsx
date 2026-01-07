import { motion } from 'framer-motion';
import type { Offer } from '@/types';
import { ExternalLink, Tag } from 'lucide-react';

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  const originalPrice = offer.discount && offer.discount > 0 
    ? offer.price / (1 - offer.discount / 100) 
    : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="card-offer relative flex flex-col h-full"
    >
      {offer.discount && offer.discount > 0 && (
        <span className="badge-discount">
          <Tag className="w-3 h-3 inline mr-1" />
          -{offer.discount}%
        </span>
      )}
      
      <div className="aspect-square bg-secondary/50 relative overflow-hidden">
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
        {offer.stores && (
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {offer.stores.name}
          </span>
        )}
        
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 flex-grow">
          {offer.name}
        </h3>
        
        <div className="mt-auto">
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through block">
              R$ {originalPrice.toFixed(2).replace('.', ',')}
            </span>
          )}
          
          <p className="text-xl font-bold text-foreground">
            R$ {Number(offer.price).toFixed(2).replace('.', ',')}
          </p>
          
          <a
            href={offer.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon w-full mt-3 inline-flex items-center justify-center gap-2 text-sm"
          >
            Ver oferta
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
