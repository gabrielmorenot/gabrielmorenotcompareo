import { useState } from 'react';
import { usePromoBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from '@/hooks/useData';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2, Upload, X } from 'lucide-react';
import type { Banner } from '@/types';
import { toast } from 'sonner';

export default function AdminPromoBanners() {
  const { data: banners, isLoading } = usePromoBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formMobileImageUrl, setFormMobileImageUrl] = useState('');
  const [formButtonText, setFormButtonText] = useState('Ver ofertas');
  const [formButtonLink, setFormButtonLink] = useState('');
  const [formOrder, setFormOrder] = useState(0);
  const [formActive, setFormActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  function resetForm() {
    setFormTitle('');
    setFormSubtitle('');
    setFormImageUrl('');
    setFormMobileImageUrl('');
    setFormButtonText('Ver ofertas');
    setFormButtonLink('');
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
    setFormTitle(banner.title || '');
    setFormSubtitle(banner.subtitle || '');
    setFormImageUrl(banner.image_url || '');
    setFormMobileImageUrl((banner as any).mobile_image_url || '');
    setFormButtonText(banner.button_text || 'Ver ofertas');
    setFormButtonLink(banner.button_link || '');
    setFormOrder(banner.display_order ?? 0);
    setFormActive(banner.active);
    setDialogOpen(true);
  }

  async function handleImageUpload(file: File, setUrl: (url: string) => void, setLoading: (v: boolean) => void) {
    setLoading(true);
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
      setUrl(publicUrl);
      toast.success('Imagem enviada!');
    } catch {
      toast.error('Erro ao enviar imagem');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle) {
      toast.error('Título é obrigatório');
      return;
    }
    try {
      const payload: any = {
        title: formTitle,
        subtitle: formSubtitle || null,
        image_url: formImageUrl || null,
        mobile_image_url: formMobileImageUrl || null,
        button_text: formButtonText || null,
        button_link: formButtonLink || null,
        display_order: formOrder,
        active: formActive,
        section: 'promos',
      };
      if (editing) {
        await updateBanner.mutateAsync({ id: editing.id, ...payload });
        toast.success('Banner atualizado!');
      } else {
        await createBanner.mutateAsync(payload);
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
          <h1 className="text-2xl font-bold">Promoções em Destaque</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Banners exibidos na seção "Promoções em Destaque" da home
          </p>
        </div>
        <Button onClick={openCreate} className="btn-neon">
          <Plus className="w-4 h-4 mr-2" />Novo Banner
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : !banners?.length ? (
        <div className="text-center py-16 text-muted-foreground">Nenhum banner de promoção criado</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map(banner => (
            <div key={banner.id} className="bg-card rounded-xl border border-border overflow-hidden">
              {banner.image_url && <img src={banner.image_url} alt="" className="w-full h-36 object-cover" />}
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-1 truncate">{banner.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${banner.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {banner.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-xs text-muted-foreground">Ordem: {banner.display_order}</span>
                </div>
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
            <DialogTitle>{editing ? 'Editar Banner' : 'Novo Banner Promo'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Ex: Black Friday" />
            </div>
            <div>
              <Label>Subtítulo</Label>
              <Input value={formSubtitle} onChange={e => setFormSubtitle(e.target.value)} placeholder="Descrição curta" />
            </div>

            <div>
              <Label>Imagem Desktop</Label>
              {formImageUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img src={formImageUrl} alt="" className="w-full h-28 object-contain bg-muted" />
                  <button type="button" onClick={() => setFormImageUrl('')} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Upload className="w-5 h-5 mb-1 text-muted-foreground" /><span className="text-xs text-muted-foreground">Upload desktop</span></>}
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], setFormImageUrl, setUploading)} />
                </label>
              )}
            </div>

            <div>
              <Label>Imagem Mobile (opcional)</Label>
              {formMobileImageUrl ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img src={formMobileImageUrl} alt="" className="w-full h-28 object-contain bg-muted" />
                  <button type="button" onClick={() => setFormMobileImageUrl('')} className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                  {uploadingMobile ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Upload className="w-5 h-5 mb-1 text-muted-foreground" /><span className="text-xs text-muted-foreground">Upload mobile</span></>}
                  <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], setFormMobileImageUrl, setUploadingMobile)} />
                </label>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Texto do botão</Label>
                <Input value={formButtonText} onChange={e => setFormButtonText(e.target.value)} placeholder="Ver ofertas" />
              </div>
              <div>
                <Label>Link do botão</Label>
                <Input value={formButtonLink} onChange={e => setFormButtonLink(e.target.value)} placeholder="https://..." />
              </div>
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
