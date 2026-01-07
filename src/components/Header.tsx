import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center animate-pulse-neon">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-extrabold">
              <span className="text-gradient">Compareo</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#ofertas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Ofertas do Dia
            </a>
            <a href="#categorias" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Categorias
            </a>
            <a href="#lojas" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Lojas Parceiras
            </a>
          </nav>
          
          <Link 
            to="/admin" 
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors opacity-50 hover:opacity-100"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
