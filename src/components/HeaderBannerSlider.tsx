import { useHeaderBanners } from '@/hooks/useHeaderBanners';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useMemo } from 'react';

export function HeaderBannerSlider() {
  const { data: banners } = useHeaderBanners();

  const autoplayPlugin = useMemo(
    () => Autoplay({ delay: (banners?.[0]?.autoplay_interval || 5) * 1000, stopOnInteraction: false }),
    [banners]
  );

  if (!banners || banners.length === 0) return null;

  return (
    <section className="w-full">
      <Carousel
        opts={{ loop: true, align: 'center' }}
        plugins={[autoplayPlugin]}
        className="w-full"
      >
          <CarouselContent className="ml-0">
            {banners.map((banner) => (
              <CarouselItem key={banner.id} className="pl-0">
                {banner.link ? (
                  <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block">
                    <img
                      src={banner.image_url}
                      alt=""
                      className="w-full h-[300px] object-cover"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <img
                    src={banner.image_url}
                    alt=""
                    className="w-full h-[300px] object-cover"
                    loading="lazy"
                  />
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          {banners.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
    </section>
  );
}
