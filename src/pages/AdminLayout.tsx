import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Zap, Package, Image, Store, LogOut, Loader2, LayoutDashboard, Palette, FolderTree, MenuIcon, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/offers', label: 'Ofertas', icon: Package },
  { to: '/admin/banners', label: 'Banners', icon: Image },
  { to: '/admin/stores', label: 'Lojas', icon: Store },
  { to: '/admin/categories', label: 'Categorias', icon: FolderTree },
  { to: '/admin/appearance', label: 'Aparência', icon: Palette },
  { to: '/admin/menu', label: 'Menu', icon: MenuIcon },
  { to: '/admin/popups', label: 'Popups', icon: MessageSquare },
];

export default function AdminLayout() {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate('/admin');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && user && !isAdmin) navigate('/admin');
  }, [isAdmin, loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 admin-sidebar flex flex-col">
        <div className="p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold block">Compareo</span>
              <span className="text-xs text-muted-foreground">Admin</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2 truncate">{user.email}</p>
          <Button variant="outline" size="sm" className="w-full" onClick={() => signOut().then(() => navigate('/admin'))}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
