import { useState, useEffect, useCallback } from 'react';
import { useHeroPromosBySlot, type HeroPromo } from '@/hooks/useHeroPromos';
import { useIsMobile } from '@/hooks/use-mobile';

function PromoSlide({ promo }: { promo: HeroPromo }) {
  const img = (
    <img
      src={promo.image_url}
      alt=""
      className="w-full h-full object-contain"
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

function VerticalCarousel({ promos }: { promos: HeroPromo[] }) {
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
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
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

function HorizontalCarousel({ promos }: { promos: HeroPromo[] }) {
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
  const isMobile = useIsMobile();
  const { data: desktopLeft } = useHeroPromosBySlot('desktop_left');
  const { data: desktopRight } = useHeroPromosBySlot('desktop_right');
  const { data: mobilePromos } = useHeroPromosBySlot('mobile');

  // Mobile view: single carousel
  if (isMobile) {
    if (!mobilePromos || mobilePromos.length === 0) return null;
    return (
      <section className="py-4 bg-background">
        <div className="container">
          <div className="w-full rounded-2xl overflow-hidden bg-card" style={{ aspectRatio: '16/9' }}>
            <HorizontalCarousel promos={mobilePromos} />
          </div>
        </div>
      </section>
    );
  }

  // Desktop view: two side-by-side carousels
  const hasLeft = desktopLeft && desktopLeft.length > 0;
  const hasRight = desktopRight && desktopRight.length > 0;
  if (!hasLeft && !hasRight) return null;

  return (
    <section className="py-6 bg-background">
      <div className="container">
        <div className="flex gap-4">
          {hasLeft && (
            <div
              className="rounded-2xl overflow-hidden bg-card flex-shrink-0"
              style={{ width: '400px', height: '400px' }}
            >
              <VerticalCarousel promos={desktopLeft} />
            </div>
          )}
          {hasRight && (
            <div
              className="rounded-2xl overflow-hidden bg-card flex-shrink-0"
              style={{ width: '1000px', height: '400px' }}
            >
              <HorizontalCarousel promos={desktopRight} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
