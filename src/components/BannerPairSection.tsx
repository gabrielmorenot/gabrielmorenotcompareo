import { motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import type { Banner } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const renderCard = (banner: Banner, index: number) => {
    const content = (
      <motion.div
        key={banner.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative rounded-2xl overflow-hidden flex-1 aspect-[16/5] md:aspect-[16/6] bg-card border border-border cursor-pointer hover:opacity-90 transition-opacity"
      >
        {banner.image_url && (
          <>
            <img
              src={banner.image_url}
              alt={banner.title || ''}
              className="w-full h-full object-cover hidden md:block"
            />
            <img
              src={(banner as any).mobile_image_url || banner.image_url}
              alt={banner.title || ''}
              className="w-full h-full object-cover md:hidden"
            />
          </>
        )}
      </motion.div>
    );

    if (banner.button_link) {
      return (
        <a key={banner.id} href={banner.button_link} target="_blank" rel="noopener noreferrer" className="flex-1">
          {content}
        </a>
      );
    }
    return content;
  };

  return (
    <section className="py-12 bg-background">
      <div className="container">
        {/* Desktop: side by side */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
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