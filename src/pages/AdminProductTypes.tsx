import { useState } from 'react';
import { useAllProductTypes, useCreateProductType, useUpdateProductType, useDeleteProductType, type ProductType } from '@/hooks/useProductTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminProductTypes() {
  const { data: productTypes, isLoading } = useAllProductTypes();
  const createPT = useCreateProductType();
  const updatePT = useUpdateProductType();
  const deletePT = useDeleteProductType();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductType | null>(null);
  const [form, setForm] = useState({ name: '', emoji: '📦', image_url: '', display_order: 0, active: true });

  function resetForm() {
    setForm({ name: '', emoji: '📦', image_url: '', display_order: 0, active: true });
    setEditing(null);
  }

  function handleEdit(pt: ProductType) {
    setEditing(pt);
    setForm({ name: pt.name, emoji: pt.emoji || '📦', image_url: pt.image_url || '', display_order: pt.display_order ?? 0, active: pt.active });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = { ...form, image_url: form.image_url || null };
    try {
      if (editing) {
        await updatePT.mutateAsync({ id: editing.id, ...data });
        toast.success('Tipo de produto atualizado!');
      } else {
        await createPT.mutateAsync(data);
        toast.success('Tipo de produto criado!');
      }
      setOpen(false);
      resetForm();
    } catch {
      toast.error('Erro ao salvar tipo de produto');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este tipo de produto?')) return;
    try { await deletePT.mutateAsync(id); toast.success('Tipo excluído'); }
    catch { toast.error('Erro ao excluir'); }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tipos de Produto</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild><Button className="btn-neon"><Plus className="w-4 h-4 mr-2" />Novo Tipo</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Editar Tipo' : 'Novo Tipo de Produto'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Emoji</Label>
                  <Input value={form.emoji} onChange={e => setForm({ ...form, emoji: e.target.value })} />
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <Label>URL da Imagem (opcional)</Label>
                <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />
                <Label>Ativo</Label>
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
              <th className="text-left py-3 px-4 font-medium">Emoji</th>
              <th className="text-left py-3 px-4 font-medium">Nome</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-right py-3 px-4 font-medium">Ações</th>
            </tr></thead>
            <tbody>
              {productTypes?.map(pt => (
                <tr key={pt.id} className="border-b border-border/50">
                  <td className="py-3 px-4 text-muted-foreground">{pt.display_order}</td>
                  <td className="py-3 px-4 text-xl">{pt.emoji}</td>
                  <td className="py-3 px-4 font-medium">{pt.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${pt.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {pt.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(pt)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(pt.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
