import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ChevronLeft, ChevronRight, AlignJustify } from 'lucide-react';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useCategories } from '@/hooks/useCategories';
import { useProductTypes } from '@/hooks/useProductTypes';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const POPULAR_SUGGESTIONS = ['iphone', 'notebook', 'geladeira', 'celular', 'smart tv', 'air fryer'];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: menuItems } = useMenuItems();
  const { data: categories } = useCategories();
  const { data: productTypes } = useProductTypes();
  const { settings } = useSiteSettings();
  const navigate = useNavigate();
  const subNavRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Close categories dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
      setShowSuggestions(false);
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (term: string) => {
    setSearchQuery(term);
    setShowSuggestions(false);
    navigate(`/busca?q=${encodeURIComponent(term)}`);
  };

  // Sub-nav links now navigate to search
  const subNavLinks = [
    { label: 'Oferta do Dia', href: '/#ofertas', key: 'ofertas' },
    { label: 'Cashback', href: '/#lojas', key: 'cashback' },
    ...(productTypes?.map(pt => ({ label: pt.name, href: `/busca?q=${encodeURIComponent(pt.name)}`, key: `pt-${pt.id}` })) || []),
  ];

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* Main header bar - WHITE */}
      <div className="bg-card border-b border-border">
        <div className="container py-3">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Logo" style={{ height: `${(Number(settings.header_logo_size) || 100) * 0.4}px` }} className="w-auto" />
              ) : (
                <span className="text-2xl font-extrabold text-foreground">Compareo</span>
              )}
            </Link>

            {/* Search bar - centered */}
            <div ref={searchRef} className="hidden md:block flex-1 max-w-xl mx-auto relative">
              <form onSubmit={handleSearch}>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Pesquise no Compareo"
                    className="w-full h-10 pl-4 pr-12 rounded-lg bg-secondary text-foreground border border-border outline-none text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
                  />
                  <button type="submit" className="absolute right-0 top-0 h-full px-3 flex items-center text-muted-foreground hover:text-foreground transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* Search suggestions dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg border border-border shadow-lg z-50 py-3 px-4 animate-fade-in">
                  <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                    🔥 Popular agora
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_SUGGESTIONS.map(term => (
                      <button
                        key={term}
                        onClick={() => handleSuggestionClick(term)}
                        className="px-3 py-1.5 text-sm rounded-full border border-border text-foreground hover:bg-secondary transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                  {categories && categories.length > 0 && (
                    <>
                      <p className="text-sm font-semibold text-foreground mt-3 mb-2">Categorias</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.slice(0, 6).map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => handleSuggestionClick(cat.name)}
                            className="px-3 py-1.5 text-sm rounded-full border border-border text-foreground hover:bg-secondary transition-colors flex items-center gap-1"
                          >
                            {cat.icon} {cat.name}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right side menu items */}
            <nav className="hidden md:flex items-center gap-4 flex-shrink-0">
              {menuItems?.slice(0, 3).map(item => (
                item.is_external ? (
                  <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors whitespace-nowrap">
                    {item.label}
                  </a>
                ) : (
                  <a key={item.id} href={item.url} className="text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors whitespace-nowrap">
                    {item.label}
                  </a>
                )
              ))}
            </nav>

            {/* Mobile hamburger */}
            <button className="md:hidden p-2 text-foreground ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile search */}
          <div className="md:hidden mt-3 relative" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Pesquise no Compareo"
                  className="w-full h-10 pl-4 pr-12 rounded-lg bg-secondary text-foreground border border-border outline-none text-sm placeholder:text-muted-foreground"
                />
                <button type="submit" className="absolute right-0 top-0 h-full px-3 flex items-center text-muted-foreground">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card rounded-lg border border-border shadow-lg z-50 py-3 px-4 animate-fade-in">
                <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  🔥 Popular agora
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SUGGESTIONS.map(term => (
                    <button
                      key={term}
                      onClick={() => handleSuggestionClick(term)}
                      className="px-3 py-1.5 text-sm rounded-full border border-border text-foreground hover:bg-secondary transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-border px-4 pb-4 pt-3 space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider pt-1">Categorias</p>
            {categories?.map(cat => (
              <button key={cat.id} onClick={() => { handleSuggestionClick(cat.name); setMobileOpen(false); }} className="block text-sm font-medium text-foreground hover:text-muted-foreground transition-colors py-1 w-full text-left">
                {cat.icon} {cat.name}
              </button>
            ))}
            <div className="border-t border-border my-2" />
            {menuItems?.map(item => (
              item.is_external ? (
                <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-foreground hover:text-muted-foreground transition-colors py-1" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </a>
              ) : (
                <a key={item.id} href={item.url} className="block text-sm font-medium text-foreground hover:text-muted-foreground transition-colors py-1" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </a>
              )
            ))}
          </nav>
        )}
      </div>

      {/* Sub navigation bar - slightly darker white */}
      <div className="bg-secondary border-b border-border">
        <div className="container relative flex items-center">
          {/* Categories hamburger button */}
          <div ref={catRef} className="relative flex-shrink-0">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-1.5 text-sm font-semibold text-foreground py-2.5 pr-4 border-r border-border mr-4 hover:text-muted-foreground transition-colors"
            >
              <AlignJustify className="w-4 h-4" />
              <span className="hidden sm:inline">Categorias</span>
            </button>

            {/* Categories dropdown */}
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-card rounded-lg border border-border shadow-lg z-50 py-2 animate-fade-in">
                {categories?.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { handleSuggestionClick(cat.name); setCatOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors w-full text-left"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Scrollable links */}
          <div className="relative flex-1 min-w-0">
            {canScrollLeft && (
              <button onClick={() => scroll('left')} className="absolute left-0 top-0 h-full z-10 px-1 bg-gradient-to-r from-secondary to-transparent text-foreground">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div
              ref={subNavRef}
              onScroll={checkScroll}
              className="flex items-center gap-6 overflow-x-auto py-2.5"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {subNavLinks.map(link => (
                <a
                  key={link.key}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            {canScrollRight && (
              <button onClick={() => scroll('right')} className="absolute right-0 top-0 h-full z-10 px-1 bg-gradient-to-l from-secondary to-transparent text-foreground">
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
