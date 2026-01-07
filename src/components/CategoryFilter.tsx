import { motion } from 'framer-motion';
import { CATEGORIES, type Category } from '@/types';

interface CategoryFilterProps {
  selected: Category | null;
  onSelect: (category: Category | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <section id="categorias" className="py-8 bg-card/50">
      <div className="container">
        <h2 className="section-title text-center">Categorias</h2>
        
        <div className="flex flex-wrap justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(null)}
            className={`category-chip ${selected === null ? 'active' : ''}`}
          >
            🏷️ Ver todas
          </motion.button>
          
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(cat.value)}
              className={`category-chip ${selected === cat.value ? 'active' : ''}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
