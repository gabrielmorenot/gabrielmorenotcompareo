import { useAllOffers, useAllBanners, useAllStores } from '@/hooks/useData';
import { Package, Image, Store, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { data: offers } = useAllOffers();
  const { data: banners } = useAllBanners();
  const { data: stores } = useAllStores();

  const stats = [
    { label: 'Total de Ofertas', value: offers?.length ?? 0, icon: Package, color: 'bg-primary' },
    { label: 'Ofertas Ativas', value: offers?.filter(o => o.active).length ?? 0, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Banners', value: banners?.length ?? 0, icon: Image, color: 'bg-blue-500' },
    { label: 'Lojas Parceiras', value: stores?.length ?? 0, icon: Store, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="text-lg font-semibold mb-4">Últimas Ofertas</h2>
        {offers && offers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Produto</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Categoria</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Preço</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {offers.slice(0, 5).map((offer) => (
                  <tr key={offer.id} className="border-b border-border/50">
                    <td className="py-3 px-4 font-medium">{offer.name}</td>
                    <td className="py-3 px-4 capitalize">{offer.category}</td>
                    <td className="py-3 px-4">R$ {Number(offer.price).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        offer.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {offer.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">Nenhuma oferta cadastrada.</p>
        )}
      </div>
    </div>
  );
}
