import { useHeaderBanners } from '@/hooks/useHeaderBanners';
import { useState, useEffect, useCallback, useMemo } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeaderBannerSlider() {
  const { data: banners } = useHeaderBanners();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const autoplayPlugin = useMemo(
    () => Autoplay({ delay: (banners?.[0]?.autoplay_interval || 5) * 1000, stopOnInteraction: false }),
    [banners]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', containScroll: false },
    [autoplayPlugin]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  if (!banners || banners.length === 0) return null;

  const Img = ({ banner }: { banner: typeof banners[0] }) => (
    <img
      src={banner.image_url}
      alt=""
      className="w-full h-full object-cover rounded-lg"
      loading="lazy"
    />
  );

  return (
    <section className="w-full bg-gradient-to-b from-muted/50 to-background py-2 md:py-4">
      <div className="relative">
        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="flex-[0_0_92%] md:flex-[0_0_85%] lg:flex-[0_0_75%] min-w-0 px-1.5 md:px-2"
              >
                <div className="aspect-[1365/300] w-full overflow-hidden rounded-lg">
                  {banner.link ? (
                    <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                      <Img banner={banner} />
                    </a>
                  ) : (
                    <Img banner={banner} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-md"
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-md"
            >
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {banners.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2 md:mt-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  i === selectedIndex ? "bg-primary w-5" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
