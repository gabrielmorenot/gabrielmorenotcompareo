import { useState, useEffect } from 'react';
import { useCashbackSection, useUpdateCashbackSection } from '@/hooks/useCashbackSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

export default function AdminCashbackSection() {
  const { data: config, isLoading } = useCashbackSection();
  const updateMutation = useUpdateCashbackSection();
  const { toast } = useToast();

  const [subtitle, setSubtitle] = useState('');
  const [title, setTitle] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (config) {
      setSubtitle(config.subtitle || '');
      setTitle(config.title || '');
      setCtaText(config.cta_text || '');
      setCtaLink(config.cta_link || '');
      setBadgeText(config.badge_text || '');
      setActive(config.active);
    }
  }, [config]);

  async function handleSave() {
    if (!config) return;
    try {
      await updateMutation.mutateAsync({
        id: config.id,
        subtitle,
        title,
        cta_text: ctaText,
        cta_link: ctaLink || null,
        badge_text: badgeText || null,
        active,
      });
      toast({ title: 'Salvo com sucesso!' });
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Seção Cashback</h1>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Switch checked={active} onCheckedChange={setActive} />
          <Label>Seção ativa</Label>
        </div>

        <div>
          <Label>Subtítulo</Label>
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Clique no seu preferido" />
        </div>

        <div>
          <Label>Título</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Muitas lojas e produtos..." />
        </div>

        <div>
          <Label>Texto do botão CTA</Label>
          <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Compre agora e receba até 12% de cashback" />
        </div>

        <div>
          <Label>Link do CTA</Label>
          <Input value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} placeholder="https://..." />
        </div>

        <div>
          <Label>Badge (ex: Até 24x)</Label>
          <Input value={badgeText} onChange={(e) => setBadgeText(e.target.value)} placeholder="Até 24x" />
        </div>

        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar
        </Button>
      </div>

      <div className="mt-8 p-4 rounded-lg bg-muted text-sm text-muted-foreground">
        <p><strong>Nota:</strong> A seção exibe automaticamente as 8 primeiras lojas ativas e os 3 primeiros produtos cadastrados. Para alterar quais aparecem, gerencie nas seções de Lojas e Ofertas.</p>
      </div>
    </div>
  );
}
