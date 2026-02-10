import { useState } from 'react';
import { useAllBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import type { Banner } from '@/types';
import { toast } from 'sonner';

export default function AdminBanners() {
  const { data: banners, isLoading } = useAllBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: '', subtitle: '', image_url: '', mobile_image_url: '', button_text: 'Ver ofertas', button_link: '', display_order: 0, active: true });

  function resetForm() { setForm({ title: '', subtitle: '', image_url: '', mobile_image_url: '', button_text: 'Ver ofertas', button_link: '', display_order: 0, active: true }); setEditing(null); }

  function handleEdit(banner: Banner) {
    setEditing(banner);
    setForm({ title: banner.title, subtitle: banner.subtitle || '', image_url: banner.image_url || '', mobile_image_url: (banner as any).mobile_image_url || '', button_text: banner.button_text || 'Ver ofertas', button_link: banner.button_link || '', display_order: banner.display_order, active: banner.active });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) { await updateBanner.mutateAsync({ id: editing.id, ...form } as any); toast.success('Banner atualizado!'); }
      else { await createBanner.mutateAsync(form as any); toast.success('Banner criado!'); }
      setOpen(false); resetForm();
    } catch { toast.error('Erro ao salvar'); }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este banner?')) return;
    try { await deleteBanner.mutateAsync(id); toast.success('Banner excluído'); } catch { toast.error('Erro ao excluir'); }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Banners</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild><Button className="btn-neon"><Plus className="w-4 h-4 mr-2" />Novo Banner</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? 'Editar Banner' : 'Novo Banner'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Título</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div><Label>Subtítulo</Label><Input value={form.subtitle} onChange={e => setForm({...form, subtitle: e.target.value})} /></div>
              <div><Label>Imagem Desktop (URL)</Label><Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} /></div>
              <div><Label>Imagem Mobile (URL)</Label><Input value={form.mobile_image_url} onChange={e => setForm({...form, mobile_image_url: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Texto do Botão</Label><Input value={form.button_text} onChange={e => setForm({...form, button_text: e.target.value})} /></div>
                <div><Label>Link do Botão</Label><Input value={form.button_link} onChange={e => setForm({...form, button_link: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Ordem</Label><Input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: parseInt(e.target.value) || 0})} /></div>
                <div className="flex items-center gap-2 pt-6"><Switch checked={form.active} onCheckedChange={v => setForm({...form, active: v})} /><Label>Ativo</Label></div>
              </div>
              <Button type="submit" className="w-full btn-neon">{editing ? 'Salvar' : 'Criar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners?.map(banner => (
            <div key={banner.id} className="bg-card rounded-xl border border-border p-4">
              <h3 className="font-semibold">{banner.title}</h3>
              <p className="text-sm text-muted-foreground">{banner.subtitle}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleEdit(banner)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => handleDelete(banner.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
