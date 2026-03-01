import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useCategories } from '@/hooks/useCategories';
import { useProductTypes } from '@/hooks/useProductTypes';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: menuItems } = useMenuItems();
  const { data: categories } = useCategories();
  const { data: productTypes } = useProductTypes();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const subNavRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = subNavRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories, productTypes]);

  const scroll = (dir: 'left' | 'right') => {
    const el = subNavRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For now navigate to home with search - can be expanded later
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Build sub-nav links: mix of categories, fixed links, and product types
  const subNavLinks = [
    ...(categories?.slice(0, 4).map(c => ({ label: c.name, href: `/#categorias`, key: `cat-${c.id}` })) || []),
    { label: 'Oferta do Dia', href: '/#ofertas', key: 'ofertas' },
    { label: 'Cashback', href: '/#lojas', key: 'cashback' },
    ...(productTypes?.slice(0, 4).map(pt => ({ label: pt.name, href: `/#tipos`, key: `pt-${pt.id}` })) || []),
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Main header bar */}
      <div className="bg-primary">
        <div className="container py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Logo" style={{ height: `${(Number(settings.header_logo_size) || 100) * 0.4}px` }} className="w-auto" />
              ) : (
                <span className="text-2xl font-extrabold text-primary-foreground">Compareo</span>
              )}
            </Link>

            {/* Search bar - centered */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-auto">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Pesquise no Compareo"
                  className="w-full h-10 pl-4 pr-12 rounded-lg bg-card text-foreground border-none outline-none text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-3 flex items-center text-muted-foreground hover:text-foreground transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Right side menu items */}
            <nav className="hidden md:flex items-center gap-4 flex-shrink-0">
              {menuItems?.slice(0, 3).map(item => (
                item.is_external ? (
                  <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary-foreground hover:text-primary-foreground/80 transition-colors whitespace-nowrap">
                    {item.label}
                  </a>
                ) : (
                  <a key={item.id} href={item.url} className="text-sm font-semibold text-primary-foreground hover:text-primary-foreground/80 transition-colors whitespace-nowrap">
                    {item.label}
                  </a>
                )
              ))}
            </nav>

            {/* Mobile hamburger */}
            <button className="md:hidden p-2 text-primary-foreground ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile search */}
          <form onSubmit={handleSearch} className="md:hidden mt-3">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Pesquise no Compareo"
                className="w-full h-10 pl-4 pr-12 rounded-lg bg-card text-foreground border-none outline-none text-sm placeholder:text-muted-foreground"
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-3 flex items-center text-muted-foreground">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-primary-foreground/20 px-4 pb-4 pt-3 space-y-2">
            {menuItems?.map(item => (
              item.is_external ? (
                <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors py-1" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </a>
              ) : (
                <a key={item.id} href={item.url} className="block text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground transition-colors py-1" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </a>
              )
            ))}
          </nav>
        )}
      </div>

      {/* Sub navigation bar */}
      <div className="bg-primary/90 border-t border-primary-foreground/10">
        <div className="container relative">
          {canScrollLeft && (
            <button onClick={() => scroll('left')} className="absolute left-0 top-0 h-full z-10 px-1 bg-gradient-to-r from-primary/90 to-transparent text-primary-foreground">
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div
            ref={subNavRef}
            onScroll={checkScroll}
            className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-2.5"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {subNavLinks.map(link => (
              <a
                key={link.key}
                href={link.href}
                className="text-sm font-medium text-primary-foreground/90 hover:text-primary-foreground whitespace-nowrap transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          {canScrollRight && (
            <button onClick={() => scroll('right')} className="absolute right-0 top-0 h-full z-10 px-1 bg-gradient-to-l from-primary/90 to-transparent text-primary-foreground">
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
