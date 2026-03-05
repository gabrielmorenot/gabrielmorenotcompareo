import { useState, useRef } from 'react';
import { useAllStores, useCreateStore, useUpdateStore, useDeleteStore } from '@/hooks/useData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil, Trash2, Loader2, Upload, X } from 'lucide-react';
import type { Store } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export default function AdminStores() {
  const { data: stores, isLoading } = useAllStores();
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();
  const deleteStore = useDeleteStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Store | null>(null);
  const [form, setForm] = useState({ name: '', logo_url: '', link: '', active: true, cashback_percent: 0, cta_text: 'Resgatar cashback' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setForm({ name: '', logo_url: '', link: '', active: true, cashback_percent: 0, cta_text: 'Resgatar cashback' });
    setEditing(null);
  }

  function handleEdit(store: Store) {
    setEditing(store);
    setForm({
      name: store.name,
      logo_url: store.logo_url || '',
      link: store.link || '',
      active: store.active,
      cashback_percent: store.cashback_percent || 0,
      cta_text: store.cta_text || 'Resgatar cashback',
    });
    setOpen(true);
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `stores/${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const { error } = await supabase.storage.from('site-assets').upload(fileName, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(fileName);
      setForm(prev => ({ ...prev, logo_url: urlData.publicUrl }));
      toast.success('Logo enviado!');
    } catch {
      toast.error('Erro ao enviar logo');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editing) {
        await updateStore.mutateAsync({ id: editing.id, ...form, cashback_percent: Number(form.cashback_percent) });
        toast.success('Loja atualizada!');
      } else {
        await createStore.mutateAsync({ ...form, cashback_percent: Number(form.cashback_percent) } as any);
        toast.success('Loja criada!');
      }
      setOpen(false);
      resetForm();
    } catch {
      toast.error('Erro ao salvar');
    }
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
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? 'Editar Loja' : 'Nova Loja'}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Nome</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>

              {/* Logo upload */}
              <div className="space-y-2">
                <Label>Logo da Loja</Label>
                {form.logo_url ? (
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                      <img src={form.logo_url} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, logo_url: '' })}>
                      <X className="w-4 h-4 mr-1" /> Remover
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Clique para enviar o logo</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }}
                />
                <Input
                  placeholder="Ou cole a URL do logo"
                  value={form.logo_url}
                  onChange={e => setForm({ ...form, logo_url: e.target.value })}
                />
              </div>

              <div><Label>Link da Loja</Label><Input value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} /></div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cashback (%)</Label>
                  <Input type="number" min={0} max={100} value={form.cashback_percent} onChange={e => setForm({ ...form, cashback_percent: Number(e.target.value) })} />
                </div>
                <div>
                  <Label>Texto do CTA</Label>
                  <Input value={form.cta_text} onChange={e => setForm({ ...form, cta_text: e.target.value })} />
                </div>
              </div>

              <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm({ ...form, active: v })} /><Label>Ativa</Label></div>
              <Button type="submit" className="w-full btn-neon">{editing ? 'Salvar' : 'Criar'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores?.map(store => (
            <div key={store.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {store.logo_url ? (
                  <img src={store.logo_url} alt={store.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-muted-foreground">{store.name.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{store.name}</h3>
                <div className="flex items-center gap-2 text-xs">
                  <span className={store.active ? 'text-green-600' : 'text-red-600'}>{store.active ? 'Ativa' : 'Inativa'}</span>
                  {store.cashback_percent > 0 && <span className="text-primary font-medium">{store.cashback_percent}% cashback</span>}
                </div>
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
