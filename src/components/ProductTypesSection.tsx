import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductTypes } from '@/hooks/useProductTypes';

interface ProductTypesSectionProps {
  selected: string | null;
  onSelect: (type: string | null) => void;
}

export function ProductTypesSection({ selected, onSelect }: ProductTypesSectionProps) {
  const { data: productTypes } = useProductTypes();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 bg-card/50">
      <div className="container">
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-full p-1.5 shadow-md hover:shadow-lg transition-all hidden md:flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-8 md:px-10 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {productTypes?.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(selected === type.name ? null : type.name)}
                className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div
                  className={`relative w-[100px] h-[100px] md:w-[160px] md:h-[160px] rounded-2xl border-2 transition-all duration-300 flex items-center justify-center overflow-hidden ${
                    selected === type.name
                      ? 'border-primary shadow-neon bg-card'
                      : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                  }`}
                >
                  <div className="absolute w-[60px] h-[60px] md:w-[100px] md:h-[100px] rounded-full bg-primary/90" />
                  {type.image_url ? (
                    <img
                      src={type.image_url}
                      alt={type.name}
                      className="relative z-10 w-[70px] h-[70px] md:w-[110px] md:h-[110px] object-contain drop-shadow-lg"
                    />
                  ) : (
                    <span className="relative z-10 text-3xl md:text-6xl drop-shadow-lg">
                      {type.emoji}
                    </span>
                  )}
                </div>

                <span
                  className={`text-xs md:text-sm font-semibold text-center truncate w-[100px] md:w-[160px] transition-colors ${
                    selected === type.name ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {type.name}
                </span>
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-full p-1.5 shadow-md hover:shadow-lg transition-all hidden md:flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
}
