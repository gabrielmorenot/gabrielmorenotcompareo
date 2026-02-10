import { useState } from 'react';
import { useAllPopups, useCreatePopup, useUpdatePopup, useDeletePopup } from '@/hooks/usePopups';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import type { Popup, PopupType, PopupDisplayTarget, PopupDeviceTarget } from '@/types';

const POPUP_TYPE_LABELS: Record<PopupType, string> = {
  informativo: 'Informativo',
  promocao: 'Promoção',
  captura_lead: 'Captura de Lead',
};

const DISPLAY_TARGET_LABELS: Record<PopupDisplayTarget, string> = {
  home: 'Apenas Home',
  all: 'Todas as páginas',
  specific: 'Páginas específicas',
};

const DEVICE_TARGET_LABELS: Record<PopupDeviceTarget, string> = {
  desktop: 'Desktop',
  mobile: 'Mobile',
  both: 'Ambos',
};

const emptyForm = {
  title: '',
  description: '',
  image_url: '',
  cta_text: '',
  cta_link: '',
  popup_type: 'informativo' as PopupType,
  display_target: 'home' as PopupDisplayTarget,
  specific_pages: '' ,
  device_target: 'both' as PopupDeviceTarget,
  delay_seconds: 0,
  once_per_session: true,
  active: true,
  display_order: 0,
};

export default function AdminPopups() {
  const { data: popups, isLoading } = useAllPopups();
  const createPopup = useCreatePopup();
  const updatePopup = useUpdatePopup();
  const deletePopup = useDeletePopup();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (p: Popup) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description || '',
      image_url: p.image_url || '',
      cta_text: p.cta_text || '',
      cta_link: p.cta_link || '',
      popup_type: p.popup_type,
      display_target: p.display_target,
      specific_pages: p.specific_pages?.join(', ') || '',
      device_target: p.device_target,
      delay_seconds: p.delay_seconds,
      once_per_session: p.once_per_session,
      active: p.active,
      display_order: p.display_order ?? 0,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }
    const payload: any = {
      title: form.title,
      description: form.description || null,
      image_url: form.image_url || null,
      cta_text: form.cta_text || null,
      cta_link: form.cta_link || null,
      popup_type: form.popup_type,
      display_target: form.display_target,
      specific_pages: form.display_target === 'specific'
        ? form.specific_pages.split(',').map(s => s.trim()).filter(Boolean)
        : null,
      device_target: form.device_target,
      delay_seconds: form.delay_seconds,
      once_per_session: form.once_per_session,
      active: form.active,
      display_order: form.display_order,
    };

    try {
      if (editingId) {
        await updatePopup.mutateAsync({ id: editingId, ...payload });
        toast.success('Popup atualizado');
      } else {
        await createPopup.mutateAsync(payload);
        toast.success('Popup criado');
      }
      setDialogOpen(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este popup?')) return;
    try {
      await deletePopup.mutateAsync(id);
      toast.success('Popup excluído');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleToggleActive = async (p: Popup) => {
    try {
      await updatePopup.mutateAsync({ id: p.id, active: !p.active });
      toast.success(p.active ? 'Popup desativado' : 'Popup ativado');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Popups</h1>
          <p className="text-muted-foreground">Gerencie campanhas, avisos e ações promocionais</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Novo Popup
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !popups?.length ? (
        <div className="text-center py-20 text-muted-foreground">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum popup cadastrado</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {popups.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">{p.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                    {POPUP_TYPE_LABELS[p.popup_type]}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {DISPLAY_TARGET_LABELS[p.display_target]} · {DEVICE_TARGET_LABELS[p.device_target]} · {p.delay_seconds}s delay
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={p.active} onCheckedChange={() => handleToggleActive(p)} />
                <Button variant="outline" size="icon" onClick={() => openEdit(p)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleDelete(p.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Popup' : 'Novo Popup'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label>Título *</Label>
              <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
            </div>
            <div>
              <Label>URL da Imagem</Label>
              <Input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Texto do Botão (CTA)</Label>
                <Input value={form.cta_text} onChange={e => setForm({...form, cta_text: e.target.value})} />
              </div>
              <div>
                <Label>Link do CTA</Label>
                <Input value={form.cta_link} onChange={e => setForm({...form, cta_link: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipo</Label>
                <Select value={form.popup_type} onValueChange={v => setForm({...form, popup_type: v as PopupType})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(POPUP_TYPE_LABELS).map(([k,v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Dispositivo</Label>
                <Select value={form.device_target} onValueChange={v => setForm({...form, device_target: v as PopupDeviceTarget})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(DEVICE_TARGET_LABELS).map(([k,v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Exibir em</Label>
              <Select value={form.display_target} onValueChange={v => setForm({...form, display_target: v as PopupDisplayTarget})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(DISPLAY_TARGET_LABELS).map(([k,v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.display_target === 'specific' && (
              <div>
                <Label>Páginas (separadas por vírgula)</Label>
                <Input value={form.specific_pages} onChange={e => setForm({...form, specific_pages: e.target.value})} placeholder="/produto, /categorias" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Delay (segundos)</Label>
                <Input type="number" min={0} value={form.delay_seconds} onChange={e => setForm({...form, delay_seconds: Number(e.target.value)})} />
              </div>
              <div>
                <Label>Ordem de exibição</Label>
                <Input type="number" value={form.display_order} onChange={e => setForm({...form, display_order: Number(e.target.value)})} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.once_per_session} onCheckedChange={v => setForm({...form, once_per_session: v})} />
              <Label>Exibir apenas uma vez por sessão</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={v => setForm({...form, active: v})} />
              <Label>Ativo</Label>
            </div>
            <Button className="w-full" onClick={handleSave} disabled={createPopup.isPending || updatePopup.isPending}>
              {(createPopup.isPending || updatePopup.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingId ? 'Salvar Alterações' : 'Criar Popup'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
