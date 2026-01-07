import { motion } from 'framer-motion';
import { Zap, TrendingDown, ShieldCheck } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 text-primary" />
            As melhores ofertas em um só lugar
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Compare preços e <span className="text-gradient">economize</span> nas suas compras
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Encontre os melhores descontos em TVs, celulares, eletrodomésticos e muito mais. 
            Atualizamos as ofertas todos os dias para você!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a href="#ofertas" className="btn-neon">
              Ver Ofertas do Dia
            </a>
            <a href="#categorias" className="px-6 py-3 rounded-lg border border-border font-semibold hover:bg-secondary transition-colors">
              Explorar Categorias
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
