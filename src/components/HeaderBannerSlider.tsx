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
    <section className="w-full px-2.5 pt-2.5">
      <div className="max-w-[1365px] mx-auto">
        <Carousel
          opts={{ loop: true, align: 'center' }}
          plugins={[autoplayPlugin]}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {banners.map((banner) => {
              const imgContent = (
                <>
                  <img
                    src={banner.image_url}
                    alt=""
                    className="hidden md:block w-full h-[300px] object-cover rounded-xl"
                    loading="lazy"
                  />
                  <img
                    src={banner.mobile_image_url || banner.image_url}
                    alt=""
                    className="block md:hidden w-full h-auto object-cover rounded-xl"
                    loading="lazy"
                  />
                </>
              );
              return (
                <CarouselItem key={banner.id} className="pl-0">
                  {banner.link ? (
                    <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block">
                      {imgContent}
                    </a>
                  ) : (
                    imgContent
                  )}
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {banners.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}
