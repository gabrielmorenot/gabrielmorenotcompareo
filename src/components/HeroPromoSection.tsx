import { useState, useEffect, useCallback } from 'react';
import { useHeroPromos, type HeroPromo } from '@/hooks/useHeroPromos';
import { useIsMobile } from '@/hooks/use-mobile';

const SIZE_TO_COLS: Record<string, number> = {
  small: 4,
  medium: 6,
  large: 8,
  full: 12,
};

function PromoSlide({ promo, isMobile }: { promo: HeroPromo; isMobile: boolean }) {
  const imageUrl = isMobile
    ? (promo.mobile_image_url || promo.desktop_image_url)
    : promo.desktop_image_url;

  const img = (
    <img
      src={imageUrl}
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

/** Carousel with vertical dots (left side) */
function VerticalCarousel({ promos, isMobile }: { promos: HeroPromo[]; isMobile: boolean }) {
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
          <PromoSlide promo={promo} isMobile={isMobile} />
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

/** Carousel with horizontal dots (bottom) */
function HorizontalCarousel({ promos, isMobile }: { promos: HeroPromo[]; isMobile: boolean }) {
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
          <PromoSlide promo={promo} isMobile={isMobile} />
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

  // Mobile: only show promos that admin allowed on mobile
  if (isMobile) {
    const mobilePromos = promos.filter(p => p.show_on_mobile);
    if (mobilePromos.length === 0) return null;

    return (
      <section className="py-4 bg-background">
        <div className="container">
          <div className="w-full rounded-2xl overflow-hidden bg-card">
            <HorizontalCarousel promos={mobilePromos} isMobile />
          </div>
        </div>
      </section>
    );
  }

  // Desktop: group promos into rows based on grid columns (max 12 per row)
  // First slot in each row gets vertical dots, rest get horizontal dots
  const rows: HeroPromo[][] = [];
  let currentRow: HeroPromo[] = [];
  let currentCols = 0;

  promos.forEach(promo => {
    const cols = SIZE_TO_COLS[promo.banner_size] || 6;
    if (currentCols + cols > 12 && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [promo];
      currentCols = cols;
    } else {
      currentRow.push(promo);
      currentCols += cols;
    }
  });
  if (currentRow.length > 0) rows.push(currentRow);

  return (
    <section className="py-6 bg-background">
      <div className="container">
        <div className="grid grid-cols-12 gap-4">
          {rows.flatMap((row, rowIdx) =>
            row.map((promo, idx) => {
              const cols = SIZE_TO_COLS[promo.banner_size] || 6;
              const isFirstInRow = idx === 0;
              return (
                <div
                  key={promo.id}
                  className="rounded-2xl overflow-hidden bg-card"
                  style={{ gridColumn: `span ${cols}` }}
                >
                  <div className="w-full" style={{ aspectRatio: '16/7' }}>
                    {isFirstInRow ? (
                      <VerticalCarousel promos={[promo]} isMobile={false} />
                    ) : (
                      <HorizontalCarousel promos={[promo]} isMobile={false} />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
