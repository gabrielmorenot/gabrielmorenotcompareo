import { useRef } from 'react';
import { useCashbackSection } from '@/hooks/useCashbackSection';
import { useStores } from '@/hooks/useData';
import { useOffers } from '@/hooks/useData';
import { ArrowRight } from 'lucide-react';

function StoreLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  return (
    <div className="w-[72px] h-[72px] md:w-[100px] md:h-[100px] rounded-2xl border border-white/20 bg-white/10 flex items-center justify-center overflow-hidden">
      {!logoUrl ? (
        <span className="text-lg font-bold text-white/60">{name.charAt(0)}</span>
      ) : (
        <img
          src={logoUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
          }}
        />
      )}
    </div>
  );
}

const FALLBACK_PRODUCTS = [
  { name: 'Smart TV', image: 'https://cdn.dummyjson.com/products/images/mobile-accessories/Samsung-Galaxy-Watch-Ultra/1.png' },
  { name: 'Smartphone', image: 'https://cdn.dummyjson.com/products/images/smartphones/Samsung-Galaxy-S24/1.png' },
  { name: 'Notebook', image: 'https://cdn.dummyjson.com/products/images/laptops/Apple-MacBook-Pro-14-Inch-Space-Grey/1.png' },
];

function ProductCard({ name, imageUrl, fallbackImage }: { name: string; imageUrl: string | null; fallbackImage?: string }) {
  return (
    <div className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] flex-shrink-0 rounded-2xl border border-white/30 bg-white flex items-center justify-center overflow-hidden">
      <img
        src={imageUrl || fallbackImage || ''}
        alt={name}
        className="w-full h-full object-contain p-3"
        onError={(e) => {
          const el = e.target as HTMLImageElement;
          if (fallbackImage && el.src !== fallbackImage) el.src = fallbackImage;
        }}
      />
    </div>
  );
}

export function CashbackSection() {
  const { data: config } = useCashbackSection();
  const { data: stores } = useStores();
  const { data: offers } = useOffers(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!config || !config.active) return null;

  const displayStores = (stores || []).slice(0, 9);
  const displayProducts = (offers || []).slice(0, 3);

  return (
    <section className="py-6 md:py-10 bg-background font-[Poppins]">
      <div className="container">
        <div className="rounded-2xl p-6 md:p-10" style={{ backgroundColor: '#191919' }}>

          {/* DESKTOP */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 items-center">
            {/* Left: Stores grid + CTA */}
            <div className="space-y-6">
              <div className="grid grid-cols-5 gap-2 w-fit">
                {displayStores.map((store) => (
                  <a
                    key={store.id}
                    href={store.link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <StoreLogo name={store.name} logoUrl={store.logo_url} />
                  </a>
                ))}
                {/* + icon as last item */}
                <a
                  href="#lojas-parceiras"
                  className="flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <div className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#E3FF00' }}>
                    <span className="text-2xl md:text-4xl font-bold" style={{ color: '#191919' }}>+</span>
                  </div>
                </a>
              </div>

              {/* CTA Button */}
              <a
                href={config.cta_link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-full border border-[#E3FF00] px-6 py-3 hover:bg-[#E3FF00]/10 transition-colors group"
              >
                <span className="text-white text-sm font-medium">{config.cta_text}</span>
                <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E3FF00' }}>
                  <ArrowRight className="w-5 h-5" style={{ color: '#191919' }} />
                </div>
              </a>
            </div>

            {/* Right: Text + Products + Badge */}
            <div className="space-y-6">
              <div>
                <p className="text-white/70 text-sm mb-2">{config.subtitle}</p>
                <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight">{config.title}</h2>
              </div>

              <div className="flex gap-4">
                {displayProducts.map((offer, i) => (
                  <a key={offer.id} href={offer.affiliate_link} target="_blank" rel="noopener noreferrer">
                    <ProductCard name={offer.name} imageUrl={offer.image_url} fallbackImage={FALLBACK_PRODUCTS[i % FALLBACK_PRODUCTS.length].image} />
                  </a>
                ))}
              </div>

              {config.badge_text && (
                <span className="inline-block rounded-full px-4 py-1.5 text-white text-xs font-medium" style={{ border: '1px solid #E3FF00' }}>
                  {config.badge_text}
                </span>
              )}
            </div>
          </div>

          {/* MOBILE */}
          <div className="md:hidden space-y-5">
            {/* Text */}
            <div>
              <p className="text-white/70 text-xs mb-1">{config.subtitle}</p>
              <h2 className="text-white text-2xl font-bold leading-tight">{config.title}</h2>
            </div>

            {/* Products - horizontal scroll with fade */}
            <div className="relative">
              <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {displayProducts.map((offer, i) => (
                  <a key={offer.id} href={offer.affiliate_link} target="_blank" rel="noopener noreferrer">
                    <ProductCard name={offer.name} imageUrl={offer.image_url} fallbackImage={FALLBACK_PRODUCTS[i % FALLBACK_PRODUCTS.length].image} />
                  </a>
                ))}
              </div>
              {/* Fade on right edge */}
              <div className="absolute right-0 top-0 bottom-2 w-12 pointer-events-none" 
                style={{ background: 'linear-gradient(to left, #191919, transparent)' }} />
            </div>

            {/* CTA Button */}
            <a
              href={config.cta_link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-full border border-[#E3FF00] px-5 py-2.5 hover:bg-[#E3FF00]/10 transition-colors"
            >
              <span className="text-white text-xs font-medium">{config.cta_text}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E3FF00' }}>
                <ArrowRight className="w-4 h-4" style={{ color: '#191919' }} />
              </div>
            </a>

            {/* Stores grid */}
            <div className="grid grid-cols-4 gap-2.5">
              {displayStores.map((store) => (
                <a
                  key={store.id}
                  href={store.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center"
                >
                  <StoreLogo name={store.name} logoUrl={store.logo_url} />
                </a>
              ))}
            </div>

            {config.badge_text && (
              <span className="inline-block rounded-full px-3 py-1 text-white text-xs font-medium" style={{ border: '1px solid #E3FF00' }}>
                {config.badge_text}
              </span>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
