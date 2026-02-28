import { useState } from 'react';
import { useAllBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from '@/hooks/useData';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2, Upload, X } from 'lucide-react';
import type { Banner } from '@/types';
import { toast } from 'sonner';

export default function AdminBanners() {
  const { data: banners, isLoading } = useAllBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formOrder, setFormOrder] = useState(0);
  const [formActive, setFormActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  function resetForm() {
    setFormImageUrl('');
    setFormLink('');
    setFormOrder(banners?.length || 0);
    setFormActive(true);
    setEditing(null);
  }

  function openCreate() {
    resetForm();
    setDialogOpen(true);
  }

  function openEdit(banner: Banner) {
    setEditing(banner);
    setFormImageUrl(banner.image_url || '');
    setFormLink(banner.button_link || '');
    setFormOrder(banner.display_order ?? 0);
    setFormActive(banner.active);
    setDialogOpen(true);
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Imagem deve ter no máximo 2MB');
        return;
      }
      const ext = file.name.split('.').pop();
      const path = `banners/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('site-assets').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(path);
      setFormImageUrl(publicUrl);
      toast.success('Imagem enviada!');
    } catch {
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formImageUrl) {
      toast.error('Imagem é obrigatória');
      return;
    }
    try {
      const payload = {
        title: 'Banner',
        image_url: formImageUrl,
        button_link: formLink || null,
        display_order: formOrder,
        active: formActive,
      };
      if (editing) {
        await updateBanner.mutateAsync({ id: editing.id, ...payload } as any);
        toast.success('Banner atualizado!');
      } else {
        await createBanner.mutateAsync(payload as any);
        toast.success('Banner criado!');
      }
      setDialogOpen(false);
      resetForm();
    } catch {
      toast.error('Erro ao salvar');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este banner?')) return;
    try {
      await deleteBanner.mutateAsync(id);
      toast.success('Banner excluído');
    } catch {
      toast.error('Erro ao excluir');
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Desktop: 2 banners lado a lado (50/50) • Mobile: carrossel com todos os banners
          </p>
        </div>
        <Button onClick={openCreate} className="btn-neon">
          <Plus className="w-4 h-4 mr-2" />Novo Banner
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : !banners?.length ? (
        <div className="text-center py-16 text-muted-foreground">Nenhum banner criado</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map(banner => (
            <div key={banner.id} className="bg-card rounded-xl border border-border overflow-hidden">
              {banner.image_url && <img src={banner.image_url} alt="" className="w-full h-36 object-cover" />}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${banner.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {banner.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-xs text-muted-foreground">Ordem: {banner.display_order}</span>
                </div>
                {banner.button_link && <p className="text-xs text-muted-foreground truncate">{banner.button_link}</p>}
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => openEdit(banner)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(banner.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={v => { setDialogOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Banner' : 'Novo Banner'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Imagem *</Label>
              <p className="text-xs text-muted-foreground mb-1">Recomendado: 700×250px</p>
              {formImageUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img src={formImageUrl} alt="" className="w-full h-32 object-contain bg-muted" />
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('')}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                    <>
                      <Upload className="w-6 h-6 mb-1 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Clique para enviar</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
                </label>
              )}
            </div>

            <div>
              <Label>Link (destino ao clicar)</Label>
              <Input value={formLink} onChange={e => setFormLink(e.target.value)} placeholder="https://blog.compareo.com.br/..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ordem</Label>
                <Input type="number" value={formOrder} onChange={e => setFormOrder(parseInt(e.target.value) || 0)} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch checked={formActive} onCheckedChange={setFormActive} />
                <Label>Ativo</Label>
              </div>
            </div>

            <Button type="submit" className="w-full btn-neon">{editing ? 'Salvar' : 'Criar'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
