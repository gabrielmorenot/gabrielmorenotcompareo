import { useRef, useState, useEffect, useCallback } from 'react';
import { useStores } from '@/hooks/useData';
import { ChevronRight, ChevronLeft } from 'lucide-react';

function Storelogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const [failed, setFailed] = useState(false);
  const showFallback = !logoUrl || failed;

  return (
    <div className="w-[70px] h-[70px] md:w-[80px] md:h-[80px] rounded-full bg-card flex items-center justify-center overflow-hidden">
      {showFallback ? (
        <span className="text-2xl font-bold text-muted-foreground">{name.charAt(0)}</span>
      ) : (
        <img
          src={logoUrl}
          alt={name}
          className="w-full h-full object-contain p-2"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export function StoresSection() {
  const { data: stores } = useStores();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function checkScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el?.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [stores]);

  function scroll(dir: 'left' | 'right') {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -220 : 220, behavior: 'smooth' });
  }

  if (!stores || stores.length === 0) return null;

  return (
    <section className="py-10 bg-background">
      <div className="container">
        <h2 className="section-title mb-6">Compare e compre nas lojas mais confiáveis!</h2>

        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border shadow-md items-center justify-center hover:bg-accent transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {stores.map((store) => (
              <a
                key={store.id}
                href={store.link || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="snap-start flex-shrink-0 w-[130px] md:w-[150px] rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300 p-4 flex flex-col items-center gap-2 group"
              >
                {/* Logo circle */}
                <Storelogo name={store.name} logoUrl={store.logo_url} />

                {/* Name */}
                <span className="text-xs md:text-sm font-semibold text-center truncate w-full">
                  {store.name}
                </span>

                {/* CTA + cashback */}
                <div className="text-center">
                  <span className="text-[10px] md:text-xs text-muted-foreground block">
                    {store.cta_text || 'Resgatar cashback'}
                  </span>
                  {store.cashback_percent > 0 && (
                    <span className="text-[10px] md:text-xs font-bold text-primary">
                      {store.cashback_percent}%
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card border border-border shadow-md items-center justify-center hover:bg-accent transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
