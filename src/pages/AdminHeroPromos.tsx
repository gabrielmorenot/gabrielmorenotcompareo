import { useState } from 'react';
import { useAllHeroPromos, useCreateHeroPromo, useUpdateHeroPromo, useDeleteHeroPromo, type HeroPromo, type HeroSlot } from '@/hooks/useHeroPromos';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const SLOT_LABELS: Record<HeroSlot, string> = {
  desktop_left: 'Desktop Esquerdo',
  desktop_right: 'Desktop Direito',
  mobile: 'Mobile',
};

const SLOT_DESCRIPTIONS: Record<HeroSlot, string> = {
  desktop_left: 'Slide menor (1/3) com paginação vertical',
  desktop_right: 'Slide maior (2/3) com paginação horizontal',
  mobile: 'Slide único na versão mobile',
};

export default function AdminHeroPromos() {
  const { data: allPromos, isLoading } = useAllHeroPromos();
  const createPromo = useCreateHeroPromo();
  const updatePromo = useUpdateHeroPromo();
  const deletePromo = useDeleteHeroPromo();
  const [activeTab, setActiveTab] = useState<HeroSlot>('desktop_left');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HeroPromo | null>(null);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formOrder, setFormOrder] = useState(0);
  const [formActive, setFormActive] = useState(true);
  const [formAutoplay, setFormAutoplay] = useState(5);
  const [uploading, setUploading] = useState(false);

  const promosForSlot = allPromos?.filter(p => p.slot === activeTab) || [];
  const canAddMore = promosForSlot.length < 5;

  function resetForm() {
    setFormImageUrl('');
    setFormLink('');
    setFormOrder(promosForSlot.length);
    setFormActive(true);
    setFormAutoplay(5);
    setEditing(null);
  }

  function openCreate() {
    resetForm();
    setFormOrder(promosForSlot.length);
    setDialogOpen(true);
  }

  function openEdit(promo: HeroPromo) {
    setEditing(promo);
    setFormImageUrl(promo.image_url);
    setFormLink(promo.link || '');
    setFormOrder(promo.display_order);
    setFormActive(promo.active);
    setFormAutoplay(promo.autoplay_interval);
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
      const path = `hero-promos/${Date.now()}.${ext}`;
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
        image_url: formImageUrl,
        link: formLink || null,
        slot: activeTab,
        display_order: formOrder,
        active: formActive,
        autoplay_interval: formAutoplay,
      };
      if (editing) {
        await updatePromo.mutateAsync({ id: editing.id, ...payload });
        toast.success('Slide atualizado!');
      } else {
        await createPromo.mutateAsync(payload as any);
        toast.success('Slide criado!');
      }
      setDialogOpen(false);
      resetForm();
    } catch {
      toast.error('Erro ao salvar');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este slide?')) return;
    try {
      await deletePromo.mutateAsync(id);
      toast.success('Excluído');
    } catch {
      toast.error('Erro ao excluir');
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hero Promocional</h1>

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as HeroSlot)}>
        <TabsList className="mb-4">
          <TabsTrigger value="desktop_left">Desktop Esquerdo</TabsTrigger>
          <TabsTrigger value="desktop_right">Desktop Direito</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
        </TabsList>

        {(['desktop_left', 'desktop_right', 'mobile'] as HeroSlot[]).map(slot => (
          <TabsContent key={slot} value={slot}>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">{SLOT_DESCRIPTIONS[slot]}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {promosForSlot.length}/5 slides • {canAddMore ? 'Você pode adicionar mais' : 'Limite atingido'}
              </p>
            </div>

            <div className="flex justify-end mb-4">
              <Button onClick={openCreate} disabled={!canAddMore} className="btn-neon">
                <Plus className="w-4 h-4 mr-2" />Novo Slide
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>
            ) : promosForSlot.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                Nenhum slide criado para {SLOT_LABELS[slot]}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {promosForSlot.map(promo => (
                  <div key={promo.id} className="bg-card rounded-xl border border-border overflow-hidden">
                    <img src={promo.image_url} alt="" className="w-full h-36 object-cover" />
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${promo.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {promo.active ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="text-xs text-muted-foreground">Ordem: {promo.display_order}</span>
                      </div>
                      {promo.link && <p className="text-xs text-muted-foreground truncate">{promo.link}</p>}
                      <div className="flex gap-2 mt-3">
                        <Button variant="outline" size="sm" onClick={() => openEdit(promo)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(promo.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={dialogOpen} onOpenChange={v => { setDialogOpen(v); if (!v) resetForm(); }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Slide' : `Novo Slide - ${SLOT_LABELS[activeTab]}`}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Imagem *</Label>
              <p className="text-xs text-muted-foreground mb-1">
                {activeTab === 'mobile' ? 'Recomendado: 800×450px' : activeTab === 'desktop_left' ? 'Recomendado: 400×400px' : 'Recomendado: 1000×400px'}
              </p>
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
              <Label>Link (opcional)</Label>
              <Input value={formLink} onChange={e => setFormLink(e.target.value)} placeholder="https://..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ordem</Label>
                <Input type="number" value={formOrder} onChange={e => setFormOrder(parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <Label>Autoplay (seg.)</Label>
                <Input type="number" value={formAutoplay} onChange={e => setFormAutoplay(parseInt(e.target.value) || 5)} min={1} max={30} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={formActive} onCheckedChange={setFormActive} />
              <Label>Ativo</Label>
            </div>

            <Button type="submit" className="w-full btn-neon">{editing ? 'Salvar' : 'Criar'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
