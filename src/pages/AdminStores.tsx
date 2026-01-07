import { useState } from 'react';
import { useAllStores, useCreateStore, useUpdateStore, useDeleteStore } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Store } from '@/types';
import { toast } from 'sonner';

export default function AdminStores() {
  const { data: stores, isLoading } = useAllStores();
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();
  const deleteStore = useDeleteStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Store | null>(null);
  const [form, setForm] = useState({ name: '', logo_url: '', link: '', active: true });

  function resetForm() { setForm({ name: '', logo_url: '', link: '', active: true }); setEditing(null); }

  function handleEdit(store: Store) {
    setEditing(store);
    setForm({ name: store.name, logo_url: store.logo_url || '', link: store.link || '', active: store.active });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) { await updateStore.mutateAsync({ id: editing.id, ...form }); toast.success('Loja atualizada!'); }
      else { await createStore.mutateAsync(form); toast.success('Loja criada!'); }
      setOpen(false); resetForm();
    } catch { toast.error('Erro ao salvar'); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta loja?')) return;
    try { await deleteStore.mutateAsync(id); toast.success('Loja excluída'); } catch { toast.error('Erro ao excluir'); }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lojas Parceiras</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild><Button className="btn-neon"><Plus className="w-4 h-4 mr-2" />Nova Loja</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Editar Loja' : 'Nova Loja'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div><Label>URL do Logo</Label><Input value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} /></div>
              <div><Label>Link da Loja</Label><Input value={form.link} onChange={e => setForm({...form, link: e.target.value})} /></div>
              <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm({...form, active: v})} /><Label>Ativa</Label></div>
              <Button type="submit" className="w-full btn-neon">{editing ? 'Salvar' : 'Criar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores?.map(store => (
            <div key={store.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              {store.logo_url && <img src={store.logo_url} alt={store.name} className="w-12 h-12 object-contain rounded" />}
              <div className="flex-1">
                <h3 className="font-semibold">{store.name}</h3>
                <span className={`text-xs ${store.active ? 'text-green-600' : 'text-red-600'}`}>{store.active ? 'Ativa' : 'Inativa'}</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(store)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(store.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
