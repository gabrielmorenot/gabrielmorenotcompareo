import { useState, useRef } from 'react';
import { useAllCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, type DynamicCategory } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function AdminCategories() {
  const { data: categories, isLoading } = useAllCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DynamicCategory | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', icon: '📦', image_url: '', display_order: 0, active: true });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setForm({ name: '', slug: '', icon: '📦', image_url: '', display_order: 0, active: true });
    setEditing(null);
  }

  function handleEdit(cat: DynamicCategory) {
    setEditing(cat);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || '📦', image_url: cat.image_url || '', display_order: cat.display_order ?? 0, active: cat.active });
    setOpen(true);
  }

  function generateSlug(name: string) {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem');
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `categories/${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      setForm(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Imagem enviada!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = { ...form, image_url: form.image_url || null };
    try {
      if (editing) {
        await updateCategory.mutateAsync({ id: editing.id, ...data });
        toast.success('Categoria atualizada!');
      } else {
        await createCategory.mutateAsync(data);
        toast.success('Categoria criada!');
      }
      setOpen(false);
      resetForm();
    } catch {
      toast.error('Erro ao salvar categoria');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir esta categoria?')) return;
    try { await deleteCategory.mutateAsync(id); toast.success('Categoria excluída'); }
    catch { toast.error('Erro ao excluir'); }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild><Button className="btn-neon"><Plus className="w-4 h-4 mr-2" />Nova Categoria</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={form.name} onChange={e => { setForm({ ...form, name: e.target.value, slug: editing ? form.slug : generateSlug(e.target.value) }); }} required />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ícone (emoji)</Label>
                  <Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} />
                </div>
                <div>
                  <Label>Ordem</Label>
                  <Input type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>

              {/* Image upload section */}
              <div>
                <Label>Imagem / Ícone personalizado</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Recomendado: PNG transparente (300×300px). Exibida sobre o círculo neon.
                </p>

                {form.image_url ? (
                  <div className="relative w-full rounded-lg border border-border bg-secondary/50 p-4 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-card flex items-center justify-center overflow-hidden border border-border">
                      <img src={form.image_url} alt="Preview" className="w-16 h-16 object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground truncate">{form.image_url}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setForm(prev => ({ ...prev, image_url: '' }))}
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-secondary/30 p-6 flex flex-col items-center gap-2 cursor-pointer transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Clique para enviar imagem</span>
                        <span className="text-xs text-muted-foreground">PNG, JPG, WebP</span>
                      </>
                    )}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* URL fallback */}
                <div className="mt-2">
                  <Label className="text-xs text-muted-foreground">Ou cole a URL da imagem:</Label>
                  <Input
                    value={form.image_url}
                    onChange={e => setForm({ ...form, image_url: e.target.value })}
                    placeholder="https://exemplo.com/icone.png"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />
                <Label>Ativa</Label>
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
              <th className="text-left py-3 px-4 font-medium">Imagem</th>
              <th className="text-left py-3 px-4 font-medium">Nome</th>
              <th className="text-left py-3 px-4 font-medium">Slug</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-right py-3 px-4 font-medium">Ações</th>
            </tr></thead>
            <tbody>
              {categories?.map(cat => (
                <tr key={cat.id} className="border-b border-border/50">
                  <td className="py-3 px-4 text-muted-foreground">{cat.display_order}</td>
                  <td className="py-3 px-4">
                    {cat.image_url ? (
                      <img src={cat.image_url} alt={cat.name} className="w-10 h-10 object-contain rounded" />
                    ) : (
                      <span className="text-xl">{cat.icon}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium">{cat.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{cat.slug}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {cat.active ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(cat)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
