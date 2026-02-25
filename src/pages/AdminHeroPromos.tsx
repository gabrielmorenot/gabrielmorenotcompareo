import { useState } from 'react';
import { useAllHeroPromos, useCreateHeroPromo, useUpdateHeroPromo, useDeleteHeroPromo, type HeroPromo } from '@/hooks/useHeroPromos';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

const SIZE_OPTIONS = [
  { value: 'small', label: 'Pequeno (1/3)' },
  { value: 'medium', label: 'Médio (1/2)' },
  { value: 'large', label: 'Grande (2/3)' },
  { value: 'full', label: 'Full (100%)' },
];

const defaultForm = {
  desktop_image_url: '',
  mobile_image_url: '',
  link: '',
  banner_size: 'medium' as 'small' | 'medium' | 'large' | 'full',
  display_order: 0,
  active: true,
  autoplay_interval: 5,
  show_on_mobile: true,
};

export default function AdminHeroPromos() {
  const { data: promos, isLoading } = useAllHeroPromos();
  const createPromo = useCreateHeroPromo();
  const updatePromo = useUpdateHeroPromo();
  const deletePromo = useDeleteHeroPromo();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<HeroPromo | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  function resetForm() {
    setForm(defaultForm);
    setEditing(null);
  }

  function handleEdit(promo: HeroPromo) {
    setEditing(promo);
    setForm({
      desktop_image_url: promo.desktop_image_url,
      mobile_image_url: promo.mobile_image_url || '',
      link: promo.link || '',
      banner_size: promo.banner_size as 'small' | 'medium' | 'large' | 'full',
      display_order: promo.display_order,
      active: promo.active,
      autoplay_interval: promo.autoplay_interval,
      show_on_mobile: promo.show_on_mobile,
    });
    setOpen(true);
  }

  async function handleImageUpload(file: File, type: 'desktop' | 'mobile') {
    const setUploading = type === 'desktop' ? setUploadingDesktop : setUploadingMobile;
    setUploading(true);
    try {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Imagem deve ter no máximo 2MB');
        return;
      }
      const ext = file.name.split('.').pop();
      const path = `hero-promos/${Date.now()}-${type}.${ext}`;
      const { error } = await supabase.storage.from('site-assets').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('site-assets').getPublicUrl(path);
      const key = type === 'desktop' ? 'desktop_image_url' : 'mobile_image_url';
      setForm(prev => ({ ...prev, [key]: publicUrl }));
      toast.success('Imagem enviada!');
    } catch {
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.desktop_image_url) {
      toast.error('Imagem desktop é obrigatória');
      return;
    }
    try {
      const payload = {
        desktop_image_url: form.desktop_image_url,
        mobile_image_url: form.mobile_image_url || null,
        link: form.link || null,
        banner_size: form.banner_size,
        display_order: form.display_order,
        active: form.active,
        autoplay_interval: form.autoplay_interval,
        show_on_mobile: form.show_on_mobile,
      };
      if (editing) {
        await updatePromo.mutateAsync({ id: editing.id, ...payload });
        toast.success('Hero atualizado!');
      } else {
        await createPromo.mutateAsync(payload as any);
        toast.success('Hero criado!');
      }
      setOpen(false);
      resetForm();
    } catch {
      toast.error('Erro ao salvar');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Excluir este hero promo?')) return;
    try {
      await deletePromo.mutateAsync(id);
      toast.success('Excluído');
    } catch {
      toast.error('Erro ao excluir');
    }
  }

  function ImageUploadArea({ label, value, type, uploading }: { label: string; value: string; type: 'desktop' | 'mobile'; uploading: boolean }) {
    return (
      <div>
        <Label>{label}</Label>
        <p className="text-xs text-muted-foreground mb-1">
          {type === 'desktop' ? 'Recomendado: 1200×400px' : 'Recomendado: 800×400px'}
        </p>
        {value ? (
          <div className="relative rounded-lg overflow-hidden border border-border">
            <img src={value} alt="" className="w-full h-32 object-cover" />
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, [type === 'desktop' ? 'desktop_image_url' : 'mobile_image_url']: '' }))}
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
            <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], type)} />
          </label>
        )}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hero Promocional</h1>
        <Dialog open={open} onOpenChange={v => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="btn-neon"><Plus className="w-4 h-4 mr-2" />Novo Hero</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? 'Editar Hero' : 'Novo Hero'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <ImageUploadArea label="Imagem Desktop *" value={form.desktop_image_url} type="desktop" uploading={uploadingDesktop} />
              <ImageUploadArea label="Imagem Mobile (opcional)" value={form.mobile_image_url} type="mobile" uploading={uploadingMobile} />
              <div>
                <Label>Link de redirecionamento (opcional)</Label>
                <Input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <Label>Tamanho do Banner</Label>
                <Select value={form.banner_size} onValueChange={(v: any) => setForm({ ...form, banner_size: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SIZE_OPTIONS.map(o => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ordem</Label>
                  <Input type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>Autoplay (seg.)</Label>
                  <Input type="number" value={form.autoplay_interval} onChange={e => setForm({ ...form, autoplay_interval: parseInt(e.target.value) || 5 })} min={1} max={30} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} />
                <Label>Ativo</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.show_on_mobile} onCheckedChange={v => setForm({ ...form, show_on_mobile: v })} />
                <Label>Exibir no Mobile</Label>
              </div>
              <Button type="submit" className="w-full btn-neon">{editing ? 'Salvar' : 'Criar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promos?.map(promo => (
            <div key={promo.id} className="bg-card rounded-xl border border-border overflow-hidden">
              <img src={promo.desktop_image_url} alt="" className="w-full h-36 object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${promo.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {promo.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {SIZE_OPTIONS.find(o => o.value === promo.banner_size)?.label}
                  </span>
                </div>
                {promo.link && <p className="text-xs text-muted-foreground truncate">{promo.link}</p>}
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(promo)}><Pencil className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(promo.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
