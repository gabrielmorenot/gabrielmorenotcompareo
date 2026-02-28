import { useState, useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Banner } from '@/types';

function BannerSlide({ banner }: { banner: Banner }) {
  const img = (
    <img
      src={banner.image_url!}
      alt=""
      className="w-full h-full object-cover"
      loading="lazy"
    />
  );

  if (banner.button_link) {
    return (
      <a href={banner.button_link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
        {img}
      </a>
    );
  }
  return img;
}

function MobileCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent(prev => (prev + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
        >
          <BannerSlide banner={banner} />
        </div>
      ))}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, i) => (
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

interface BannerPairSectionProps {
  banners: Banner[];
}

export function BannerPairSection({ banners }: BannerPairSectionProps) {
  const isMobile = useIsMobile();
  const activeBanners = banners.filter(b => b.image_url);

  if (activeBanners.length === 0) return null;

  // Mobile: carousel with all banners
  if (isMobile) {
    return (
      <section className="py-6 bg-background">
        <div className="container">
          <MobileCarousel banners={activeBanners} />
        </div>
      </section>
    );
  }

  // Desktop: first 2 banners side by side 50/50
  const desktopBanners = activeBanners.slice(0, 2);

  return (
    <section className="py-6 bg-background">
      <div className="container">
        <div className="grid grid-cols-2 gap-6">
          {desktopBanners.map(banner => (
            <div key={banner.id} className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/7' }}>
              <BannerSlide banner={banner} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
