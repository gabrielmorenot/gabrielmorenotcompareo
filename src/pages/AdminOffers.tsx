import { useState } from 'react';
import { useAllOffers, useCreateOffer, useUpdateOffer, useDeleteOffer, useAllStores } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Upload, Loader2 } from 'lucide-react';
import { CATEGORIES, type Category, type Offer } from '@/types';
import { toast } from 'sonner';

export default function AdminOffers() {
  const { data: offers, isLoading } = useAllOffers();
  const { data: stores } = useAllStores();
  const createOffer = useCreateOffer();
  const updateOffer = useUpdateOffer();
  const deleteOffer = useDeleteOffer();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Offer | null>(null);
  const [csvOpen, setCsvOpen] = useState(false);

  const [form, setForm] = useState({
    name: '', category: 'tv' as Category, price: '', discount: '', store_id: '',
    affiliate_link: '', image_url: '', is_daily_offer: false, active: true,
  });

  function resetForm() {
    setForm({ name: '', category: 'tv', price: '', discount: '', store_id: '', affiliate_link: '', image_url: '', is_daily_offer: false, active: true });
    setEditing(null);
  }

  function handleEdit(offer: Offer) {
    setEditing(offer);
    setForm({
      name: offer.name, category: offer.category, price: String(offer.price),
      discount: offer.discount ? String(offer.discount) : '', store_id: offer.store_id || '',
      affiliate_link: offer.affiliate_link, image_url: offer.image_url || '',
      is_daily_offer: offer.is_daily_offer, active: offer.active,
    });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = { ...form, price: parseFloat(form.price), discount: form.discount ? parseInt(form.discount) : 0, store_id: form.store_id || null };
    try {
      if (editing) {
        await updateOffer.mutateAsync({ id: editing.id, ...data });
        toast.success('Oferta atualizada!');
      } else {
        await createOffer.mutateAsync(data);
        toast.success('Oferta criada!');
      }
      setOpen(false);
      resetForm();
    } catch { toast.error('Erro ao salvar oferta'); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta oferta?')) return;
    try { await deleteOffer.mutateAsync(id); toast.success('Oferta excluída'); } 
    catch { toast.error('Erro ao excluir'); }
  }

  async function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split('\n').slice(1);
    for (const line of lines) {
      const [nome, categoria, preco, desconto, loja, affiliate_link, imagem_url, oferta_do_dia] = line.split(',');
      if (!nome || !preco) continue;
      const store = stores?.find(s => s.name.toLowerCase() === loja?.toLowerCase().trim());
      try {
        await createOffer.mutateAsync({
          name: nome.trim(), category: (categoria?.trim() || 'tv') as Category,
          price: parseFloat(preco), discount: parseInt(desconto) || 0,
          store_id: store?.id || null, affiliate_link: affiliate_link?.trim() || '#',
          image_url: imagem_url?.trim() || null, is_daily_offer: oferta_do_dia?.trim() === 'true', active: true,
        });
      } catch {}
    }
    toast.success('Importação concluída!');
    setCsvOpen(false);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ofertas</h1>
        <div className="flex gap-2">
          <Dialog open={csvOpen} onOpenChange={setCsvOpen}>
            <DialogTrigger asChild><Button variant="outline"><Upload className="w-4 h-4 mr-2" />Importar CSV</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Importar CSV</DialogTitle></DialogHeader>
              <p className="text-sm text-muted-foreground mb-4">Colunas: nome, categoria, preco, desconto, loja, affiliate_link, imagem_url, oferta_do_dia</p>
              <Input type="file" accept=".csv" onChange={handleCsvUpload} />
            </DialogContent>
          </Dialog>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DialogTrigger asChild><Button className="btn-neon"><Plus className="w-4 h-4 mr-2" />Nova Oferta</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{editing ? 'Editar Oferta' : 'Nova Oferta'}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Categoria</Label>
                    <Select value={form.category} onValueChange={v => setForm({...form, category: v as Category})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Loja</Label>
                    <Select value={form.store_id} onValueChange={v => setForm({...form, store_id: v})}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{stores?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Preço (R$)</Label><Input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required /></div>
                  <div><Label>Desconto (%)</Label><Input type="number" value={form.discount} onChange={e => setForm({...form, discount: e.target.value})} /></div>
                </div>
                <div><Label>Link Afiliado</Label><Input value={form.affiliate_link} onChange={e => setForm({...form, affiliate_link: e.target.value})} required /></div>
                <div><Label>URL da Imagem</Label><Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} /></div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2"><Switch checked={form.is_daily_offer} onCheckedChange={v => setForm({...form, is_daily_offer: v})} /><Label>Oferta do Dia</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm({...form, active: v})} /><Label>Ativo</Label></div>
                </div>
                <Button type="submit" className="w-full btn-neon">{editing ? 'Salvar' : 'Criar'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-secondary/50">
              <th className="text-left py-3 px-4 font-medium">Produto</th>
              <th className="text-left py-3 px-4 font-medium">Categoria</th>
              <th className="text-left py-3 px-4 font-medium">Preço</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-right py-3 px-4 font-medium">Ações</th>
            </tr></thead>
            <tbody>
              {offers?.map(offer => (
                <tr key={offer.id} className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium">{offer.name}</td>
                  <td className="py-3 px-4 capitalize">{offer.category}</td>
                  <td className="py-3 px-4">R$ {Number(offer.price).toFixed(2)}</td>
                  <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${offer.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{offer.active ? 'Ativo' : 'Inativo'}</span></td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(offer)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(offer.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
