import { useState, useEffect, useCallback } from 'react';
import { useHeroPromos, type HeroPromo } from '@/hooks/useHeroPromos';
import { useIsMobile } from '@/hooks/use-mobile';

const SIZE_TO_COLS: Record<string, number> = {
  small: 4,
  medium: 6,
  large: 8,
  full: 12,
};

function PromoSlide({ promo }: { promo: HeroPromo }) {
  const isMobile = useIsMobile();
  const imageUrl = isMobile
    ? (promo.mobile_image_url || promo.desktop_image_url)
    : promo.desktop_image_url;

  const img = (
    <img
      src={imageUrl}
      alt=""
      className="w-full h-full object-cover rounded-2xl"
      loading="lazy"
    />
  );

  if (promo.link) {
    return (
      <a href={promo.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        {img}
      </a>
    );
  }
  return img;
}

function PromoCarousel({ promos }: { promos: HeroPromo[] }) {
  const [current, setCurrent] = useState(0);
  const interval = (promos[0]?.autoplay_interval || 5) * 1000;

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % promos.length);
  }, [promos.length]);

  useEffect(() => {
    if (promos.length <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval, promos.length]);

  return (
    <div className="relative w-full h-full">
      {promos.map((promo, i) => (
        <div
          key={promo.id}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
        >
          <PromoSlide promo={promo} />
        </div>
      ))}
      {promos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {promos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === current ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function HeroPromoSection() {
  const { data: promos, isLoading } = useHeroPromos();
  const isMobile = useIsMobile();

  if (isLoading || !promos || promos.length === 0) return null;

  // On mobile, all items are full width in a single carousel
  if (isMobile) {
    return (
      <section className="py-4 bg-background">
        <div className="container">
          <div className="w-full aspect-[16/7] rounded-2xl overflow-hidden">
            <PromoCarousel promos={promos} />
          </div>
        </div>
      </section>
    );
  }

  // Desktop: arrange in a 12-col grid, grouping items that share a row for carousel potential
  // For simplicity, each item renders individually based on its size
  // Items with same display_order and size could be grouped, but per spec each item is independent
  return (
    <section className="py-6 bg-background">
      <div className="container">
        <div className="grid grid-cols-12 gap-4">
          {promos.map(promo => {
            const cols = SIZE_TO_COLS[promo.banner_size] || 6;
            return (
              <div
                key={promo.id}
                className="rounded-2xl overflow-hidden"
                style={{ gridColumn: `span ${cols}` }}
              >
                <div className="aspect-[16/7]">
                  <PromoSlide promo={promo} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
