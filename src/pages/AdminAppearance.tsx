import { useState, useEffect, useRef } from 'react';
import { useAllSettings, useUpdateSetting } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Palette, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

function hslToHex(hsl: string): string {
  try {
    const parts = hsl.trim().split(/\s+/);
    if (parts.length < 3) return '#cccccc';
    const h = parseFloat(parts[0]);
    const s = parseFloat(parts[1]) / 100;
    const l = parseFloat(parts[2]) / 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  } catch { return '#cccccc'; }
}

function hexToHsl(hex: string): string {
  try {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (max === g) h = ((b - r) / d + 2) * 60;
      else h = ((r - g) / d + 4) * 60;
    }
    return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  } catch { return '0 0% 50%'; }
}

const COLOR_FIELDS = [
  { key: 'primary_color', label: 'Cor Primária' },
  { key: 'secondary_color', label: 'Cor Secundária' },
  { key: 'background_color', label: 'Cor de Fundo' },
  { key: 'text_color', label: 'Cor dos Textos' },
  { key: 'button_color', label: 'Cor dos Botões' },
];

export default function AdminAppearance() {
  const { data: settings, isLoading } = useAllSettings();
  const updateSetting = useUpdateSetting();
  const [form, setForm] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach(s => { map[s.key] = s.value || ''; });
      setForm(map);
    }
  }, [settings]);

  async function handleFileUpload(key: string, file: File) {
    setUploading(prev => ({ ...prev, [key]: true }));
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${key}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      setForm(prev => ({ ...prev, [key]: publicUrl }));
      toast.success('Imagem enviada!');
    } catch {
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(prev => ({ ...prev, [key]: false }));
    }
  }

  async function handleSave() {
    try {
      for (const [key, value] of Object.entries(form)) {
        const original = settings?.find(s => s.key === key)?.value || '';
        if (value !== original) {
          await updateSetting.mutateAsync({ key, value: value || null });
        }
      }
      toast.success('Configurações salvas!');
    } catch {
      toast.error('Erro ao salvar configurações');
    }
  }

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Aparência do Site</h1>
          <p className="text-sm text-muted-foreground">Personalize a identidade visual do seu site</p>
        </div>
        <Button className="btn-neon" onClick={handleSave} disabled={updateSetting.isPending}>
          {updateSetting.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Salvar
        </Button>
      </div>

      <div className="space-y-8">
        {/* Logo & Favicon */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Logotipo e Ícone</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Logo upload */}
            <div>
              <Label>Logotipo</Label>
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload('logo_url', f); }} />
              <div className="mt-2 border-2 border-dashed border-border rounded-xl p-4 text-center">
                {form.logo_url ? (
                  <div className="relative inline-block">
                    <img src={form.logo_url} alt="Logo" className="h-16 object-contain mx-auto" />
                    <button onClick={() => setForm({ ...form, logo_url: '' })} className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : null}
                <Button variant="outline" size="sm" className="mt-2" onClick={() => logoInputRef.current?.click()} disabled={uploading.logo_url}>
                  {uploading.logo_url ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {form.logo_url ? 'Trocar' : 'Enviar logo'}
                </Button>
              </div>
            </div>
            {/* Favicon upload */}
            <div>
              <Label>Favicon / Ícone</Label>
              <input ref={faviconInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload('favicon_url', f); }} />
              <div className="mt-2 border-2 border-dashed border-border rounded-xl p-4 text-center">
                {form.favicon_url ? (
                  <div className="relative inline-block">
                    <img src={form.favicon_url} alt="Favicon" className="h-10 object-contain mx-auto" />
                    <button onClick={() => setForm({ ...form, favicon_url: '' })} className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : null}
                <Button variant="outline" size="sm" className="mt-2" onClick={() => faviconInputRef.current?.click()} disabled={uploading.favicon_url}>
                  {uploading.favicon_url ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {form.favicon_url ? 'Trocar' : 'Enviar favicon'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Fonts */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Fontes</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Fonte de Títulos</Label>
              <Input value={form.heading_font || ''} onChange={e => setForm({ ...form, heading_font: e.target.value })} placeholder="Plus Jakarta Sans" />
            </div>
            <div>
              <Label>Fonte do Texto</Label>
              <Input value={form.body_font || ''} onChange={e => setForm({ ...form, body_font: e.target.value })} placeholder="Plus Jakarta Sans" />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Palette className="w-5 h-5" /> Cores</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {COLOR_FIELDS.map(({ key, label }) => (
              <div key={key}>
                <Label>{label}</Label>
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="color"
                    value={hslToHex(form[key] || '0 0% 50%')}
                    onChange={e => setForm({ ...form, [key]: hexToHsl(e.target.value) })}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <Input
                    value={form[key] || ''}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder="H S% L%"
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold mb-4">Preview</h2>
          <div className="rounded-lg p-6" style={{ backgroundColor: `hsl(${form.background_color || '0 0% 100%'})` }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: `hsl(${form.text_color || '0 0% 0%'})`, fontFamily: form.heading_font }}>
              Título de Exemplo
            </h3>
            <p className="mb-4" style={{ color: `hsl(${form.text_color || '0 0% 0%'})`, fontFamily: form.body_font }}>
              Este é um texto de exemplo para visualizar as configurações.
            </p>
            <button className="px-6 py-2 rounded-lg font-semibold" style={{ backgroundColor: `hsl(${form.button_color || form.primary_color || '67 100% 50%'})`, color: `hsl(${form.text_color || '0 0% 0%'})` }}>
              Botão de Exemplo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
