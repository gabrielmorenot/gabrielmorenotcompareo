import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import type { Banner } from '@/types';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerPairSectionProps {
  banners: Banner[];
}

export function BannerPairSection({ banners }: BannerPairSectionProps) {
  const items = banners.slice(0, 2);
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % items.length), [items.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [items.length, next]);

  if (items.length === 0) return null;

  const renderCard = (banner: Banner, index: number) => (
    <motion.div
      key={banner.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex-1"
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
      {banner.image_url && (
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-30">
          <img src={banner.image_url} alt="" className="w-full h-full object-contain" />
        </div>
      )}
    </motion.div>
  );

  return (
    <section className="py-12 bg-background">
      <div className="container">
        {/* Desktop: side by side */}
        <div className="hidden md:flex gap-6">
          {items.map((b, i) => renderCard(b, i))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-2xl">
            {renderCard(items[current], 0)}
          </div>
          {items.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={prev} className="p-1.5 rounded-full bg-card border border-border">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full mt-2.5 transition-colors ${i === current ? 'bg-primary' : 'bg-muted'}`}
                />
              ))}
              <button onClick={next} className="p-1.5 rounded-full bg-card border border-border">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
