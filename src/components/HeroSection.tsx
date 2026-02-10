import { motion } from 'framer-motion';
import { TrendingDown, ShieldCheck, Zap } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function HeroSection() {
  const { settings } = useSiteSettings();

  const coverStyle: React.CSSProperties = settings.cover_image_url
    ? {
        backgroundImage: `url(${settings.cover_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: `linear-gradient(135deg, hsl(${settings.cover_color} / 0.15) 0%, hsl(var(--background)) 50%, hsl(${settings.cover_color} / 0.08) 100%)`,
      };

  return (
    <section className="relative overflow-hidden py-16 md:py-24" style={coverStyle}>
      {/* Overlay for readability when using image */}
      {settings.cover_image_url && (
        <div className="absolute inset-0 bg-background/70" />
      )}

      {/* Background decoration (only without image) */}
      {!settings.cover_image_url && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: `hsl(${settings.cover_color} / 0.2)` }} />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: `hsl(${settings.cover_color} / 0.1)` }} />
        </div>
      )}
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 text-primary" />
            {settings.hero_badge_text}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            {settings.hero_title.split('**').map((part, i) =>
              i % 2 === 1 ? <span key={i} className="text-gradient">{part}</span> : part
            )}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {settings.hero_subtitle}
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a href={settings.hero_button_primary_link} className="btn-neon">
              {settings.hero_button_primary_text}
            </a>
            <a href={settings.hero_button_secondary_link} className="px-6 py-3 rounded-lg border border-border font-semibold hover:bg-secondary transition-colors">
              {settings.hero_button_secondary_text}
            </a>
          </div>
          
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { icon: TrendingDown, label: 'Melhores Preços' },
              { icon: ShieldCheck, label: 'Lojas Confiáveis' },
              { icon: Zap, label: 'Ofertas Diárias' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50"
              >
                <item.icon className="w-6 h-6 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
