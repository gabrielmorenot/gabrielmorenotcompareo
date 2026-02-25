import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useCategories, type DynamicCategory } from '@/hooks/useCategories';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { data: categories } = useCategories();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    }
  };

  return (
    <section id="categorias" className="py-8 bg-card/50">
      <div className="container">
        <h2 className="section-title text-center">Categorias</h2>

        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-full p-1.5 shadow-md hover:shadow-lg transition-all hidden md:flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>

          {/* Scrollable row */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-8 md:px-10 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories?.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(selected === cat.id ? null : cat.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer`}
              >
                {/* Card */}
                <div
                  className={`relative w-[100px] h-[100px] md:w-[160px] md:h-[160px] rounded-2xl border-2 transition-all duration-300 flex items-center justify-center overflow-hidden ${
                    selected === cat.id
                      ? 'border-primary shadow-neon bg-card'
                      : 'border-border bg-card hover:border-primary/50 hover:shadow-md'
                  }`}
                >
                  {/* Neon circle background */}
                  <div className="absolute w-[60px] h-[60px] md:w-[100px] md:h-[100px] rounded-full bg-primary/90" />

                  {/* Image or emoji */}
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="relative z-10 w-[70px] h-[70px] md:w-[110px] md:h-[110px] object-contain drop-shadow-lg"
                    />
                  ) : (
                    <span className="relative z-10 text-3xl md:text-6xl drop-shadow-lg">
                      {cat.icon}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs md:text-sm font-semibold text-center truncate w-[100px] md:w-[160px] transition-colors ${
                    selected === cat.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Right arrow */}
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
