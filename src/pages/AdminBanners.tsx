import { useState, useRef } from 'react';
import { useAllBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from '@/hooks/useData';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2, Upload } from 'lucide-react';
import type { Banner } from '@/types';
import { toast } from 'sonner';

async function uploadBannerImage(file: File, prefix: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `banners/${prefix}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('site-assets').upload(path, file, { upsert: true });
  if (error) throw error;
  const { data } = supabase.storage.from('site-assets').getPublicUrl(path);
  return data.publicUrl;
}

export default function AdminBanners() {
  const { data: banners, isLoading } = useAllBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState({ title: 'Banner', image_url: '', mobile_image_url: '', button_link: '', display_order: 0, active: true });
  const [uploading, setUploading] = useState(false);
  const [desktopPreview, setDesktopPreview] = useState<string | null>(null);
  const [mobilePreview, setMobilePreview] = useState<string | null>(null);
  const desktopRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setForm({ title: 'Banner', image_url: '', mobile_image_url: '', button_link: '', display_order: 0, active: true });
    setEditing(null);
    setDesktopPreview(null);
    setMobilePreview(null);
  }

  function handleEdit(banner: Banner) {
    setEditing(banner);
    setForm({
      title: banner.title || 'Banner',
      image_url: banner.image_url || '',
      mobile_image_url: (banner as any).mobile_image_url || '',
      button_link: banner.button_link || '',
      display_order: banner.display_order ?? 0,
      active: banner.active,
    });
    setDesktopPreview(banner.image_url || null);
    setMobilePreview((banner as any).mobile_image_url || null);
    setOpen(true);
  }

  function handleFilePreview(file: File, setter: (url: string) => void) {
    const reader = new FileReader();
    reader.onload = (e) => setter(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    try {
      let image_url = form.image_url;
      let mobile_image_url = form.mobile_image_url;

      // Upload desktop image if a new file was selected
      if (desktopRef.current?.files?.[0]) {
        image_url = await uploadBannerImage(desktopRef.current.files[0], 'desktop');
      }
      // Upload mobile image if a new file was selected
      if (mobileRef.current?.files?.[0]) {
        mobile_image_url = await uploadBannerImage(mobileRef.current.files[0], 'mobile');
      }

      const payload = { ...form, image_url, mobile_image_url };

      if (editing) {
        await updateBanner.mutateAsync({ id: editing.id, ...payload } as any);
        toast.success('Banner atualizado!');
      } else {
        await createBanner.mutateAsync(payload as any);
        toast.success('Banner criado!');
      }
      setOpen(false);
      resetForm();
    } catch {
      toast.error('Erro ao salvar');
    } finally {
      setUploading(false);
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
        <h1 className="text-2xl font-bold">Banners</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="btn-neon"><Plus className="w-4 h-4 mr-2" />Novo Banner</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Editar Banner' : 'Novo Banner'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Desktop image upload */}
              <div>
                <Label>Imagem Desktop</Label>
                <div
                  className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => desktopRef.current?.click()}
                >
                  {desktopPreview ? (
                    <img src={desktopPreview} alt="Preview desktop" className="w-full h-28 object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <Upload className="w-6 h-6" />
                      <span className="text-sm">Clique para enviar</span>
                    </div>
                  )}
                </div>
                <input
                  ref={desktopRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFilePreview(file, setDesktopPreview);
                  }}
                />
              </div>

              {/* Mobile image upload */}
              <div>
                <Label>Imagem Mobile (opcional)</Label>
                <div
                  className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => mobileRef.current?.click()}
                >
                  {mobilePreview ? (
                    <img src={mobilePreview} alt="Preview mobile" className="w-full h-28 object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <Upload className="w-6 h-6" />
                      <span className="text-sm">Clique para enviar</span>
                    </div>
                  )}
                </div>
                <input
                  ref={mobileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFilePreview(file, setMobilePreview);
                  }}
                />
              </div>

              <div>
                <Label>Link (destino ao clicar)</Label>
                <Input
                  value={form.button_link}
                  onChange={e => setForm({ ...form, button_link: e.target.value })}
                  placeholder="https://blog.compareo.com.br/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={form.display_order}
                    onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />
                  <Label>Ativo</Label>
                </div>
              </div>

              <Button type="submit" className="w-full btn-neon" disabled={uploading}>
                {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Enviando...</> : editing ? 'Salvar' : 'Criar'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners?.map(banner => (
            <div key={banner.id} className="bg-card rounded-xl border border-border overflow-hidden">
              {banner.image_url && <img src={banner.image_url} alt="" className="w-full h-32 object-cover" />}
              <div className="p-4">
                <p className="text-xs text-muted-foreground truncate mb-2">{banner.button_link || 'Sem link'}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(banner)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(banner.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
