import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';
import { useMenuItems } from '@/hooks/useMenuItems';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: menuItems } = useMenuItems();
  const { settings } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo" className="h-10 w-auto" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center animate-pulse-neon">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
            )}
            <span className="text-2xl font-extrabold">
              <span className="text-gradient">Compareo</span>
            </span>
          </Link>
          
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems?.map(item => (
              item.is_external ? (
                <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </a>
              ) : (
                <a key={item.id} href={item.url} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </a>
              )
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              to="/admin" 
              className="hidden md:inline text-xs font-medium text-muted-foreground hover:text-foreground transition-colors opacity-50 hover:opacity-100"
            >
              Admin
            </Link>
            
            {/* Mobile hamburger */}
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-3">
            {menuItems?.map(item => (
              item.is_external ? (
                <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </a>
              ) : (
                <a key={item.id} href={item.url} className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </a>
              )
            ))}
            <Link to="/admin" className="block text-xs text-muted-foreground" onClick={() => setMobileOpen(false)}>Admin</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
