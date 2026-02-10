import { motion } from 'framer-motion';
import { useCategories, type DynamicCategory } from '@/hooks/useCategories';

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { data: categories } = useCategories();

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
          
          {categories?.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(cat.id)}
              className={`category-chip ${selected === cat.id ? 'active' : ''}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
