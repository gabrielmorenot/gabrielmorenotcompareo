import { motion } from 'framer-motion';
import type { Banner } from '@/types';
import { ArrowRight } from 'lucide-react';

interface BannerSectionProps {
  banners: Banner[];
}

export function BannerSection({ banners }: BannerSectionProps) {
  if (banners.length === 0) return null;

  return (
    <section className="py-12 bg-background">
      <div className="container">
        <h2 className="section-title text-center">Promoções em Destaque</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.slice(0, 3).map((banner, index) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20"
            >
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="text-muted-foreground mb-4">{banner.subtitle}</p>
                )}
                {banner.button_link && (
                  <a
                    href={banner.button_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-neon inline-flex items-center gap-2 text-sm"
                  >
                    {banner.button_text || 'Ver ofertas'}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
              
              {/* Desktop image */}
              {banner.image_url && (
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30 hidden md:block">
                  <img src={banner.image_url} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              {/* Mobile image */}
              {(banner as any).mobile_image_url && (
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-30 md:hidden">
                  <img src={(banner as any).mobile_image_url} alt="" className="w-full h-full object-contain" />
                </div>
              )}
              {!((banner as any).mobile_image_url) && banner.image_url && (
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-30 md:hidden">
                  <img src={banner.image_url} alt="" className="w-full h-full object-contain" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
