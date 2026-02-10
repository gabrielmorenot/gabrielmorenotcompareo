import { useState } from 'react';
import { useAllMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem, type MenuItem } from '@/hooks/useMenuItems';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMenu() {
  const { data: items, isLoading } = useAllMenuItems();
  const createItem = useCreateMenuItem();
  const updateItem = useUpdateMenuItem();
  const deleteItem = useDeleteMenuItem();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ label: '', url: '', is_external: false, display_order: 0, active: true });

  function resetForm() {
    setForm({ label: '', url: '', is_external: false, display_order: 0, active: true });
    setEditing(null);
  }

  function handleEdit(item: MenuItem) {
    setEditing(item);
    setForm({ label: item.label, url: item.url, is_external: item.is_external, display_order: item.display_order, active: item.active });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) {
        await updateItem.mutateAsync({ id: editing.id, ...form });
        toast.success('Item atualizado!');
      } else {
        await createItem.mutateAsync(form);
        toast.success('Item criado!');
      }
      setOpen(false);
      resetForm();
    } catch {
      toast.error('Erro ao salvar item');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este item?')) return;
    try { await deleteItem.mutateAsync(id); toast.success('Item excluído'); }
    catch { toast.error('Erro ao excluir'); }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Menu Principal</h1>
          <p className="text-sm text-muted-foreground">Gerencie os itens do menu de navegação</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild><Button className="btn-neon"><Plus className="w-4 h-4 mr-2" />Novo Item</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Editar Item' : 'Novo Item'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Label</Label><Input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} required /></div>
              <div><Label>URL</Label><Input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} required placeholder="/pagina ou https://..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Ordem</Label><Input type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} /></div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2"><Switch checked={form.is_external} onCheckedChange={v => setForm({ ...form, is_external: v })} /><Label>Link Externo</Label></div>
                <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /><Label>Ativo</Label></div>
              </div>
              <Button type="submit" className="w-full btn-neon">{editing ? 'Salvar' : 'Criar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-secondary/50">
              <th className="text-left py-3 px-4 font-medium w-12">#</th>
              <th className="text-left py-3 px-4 font-medium">Label</th>
              <th className="text-left py-3 px-4 font-medium">URL</th>
              <th className="text-left py-3 px-4 font-medium">Tipo</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-right py-3 px-4 font-medium">Ações</th>
            </tr></thead>
            <tbody>
              {items?.map(item => (
                <tr key={item.id} className="border-b border-border/50">
                  <td className="py-3 px-4 text-muted-foreground">{item.display_order}</td>
                  <td className="py-3 px-4 font-medium">{item.label}</td>
                  <td className="py-3 px-4 text-muted-foreground">{item.url}</td>
                  <td className="py-3 px-4">
                    {item.is_external && <ExternalLink className="w-4 h-4 text-muted-foreground" />}
                    {!item.is_external && <span className="text-xs text-muted-foreground">Interno</span>}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
