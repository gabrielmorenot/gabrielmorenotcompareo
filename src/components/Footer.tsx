import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useStores } from '@/hooks/useData';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export function Footer() {
  const { data: stores } = useStores();
  const { settings } = useSiteSettings();

  const institutionalText = `O Compareo é um site de publicidade na internet, não é uma loja e não vende produtos ou serviços para seus usuários. O uso do Compareo é GRATUITO, mas antes de utilizá-lo, você deverá ler e aceitar nossa Política de Privacidade e Termo de Uso. Se não concordar com eles, por favor, não utilize o Compareo. As informações sobre as ofertas são coletadas de forma colaborativa pelos usuários que utilizam a ferramenta do Grupo Compareo. Fique atento à data de atualização de cada oferta, pois todos os preços estão sujeitos à disponibilidade de estoque e duração da oferta. Alterações de preço podem ocorrer a qualquer momento, sem aviso prévio. Por essa razão, você concorda que as informações fornecidas pelas lojas devem ser validadas antes de sua decisão de compra, não responsabilizando o Compareo por eventuais divergências ou problemas na compra. Informamos também que não utilizamos técnicas de injeção, drop cookie ou cookie stuffing para coletar informações. É importante destacar que nossa monetização ocorre através de acordos comerciais estabelecidos com algumas varejistas. No entanto, essa estrutura não se aplica a todas, visto que não temos acordos com todas as varejistas mencionadas em nossa plataforma. Ao utilizar nossas ferramentas, recebemos uma comissão. Essa é a forma como sustentamos nosso serviço, garantindo uma ferramenta útil e confiável para você economizar.`;

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & About */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Logo" style={{ height: `${(Number(settings.footer_logo_size) || 100) * 0.4}px` }} className="w-auto" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-2xl font-extrabold text-primary">Compareo</span>
                </>
              )}
            </Link>
            <p className="text-sm text-background/70 leading-relaxed">
              Encontre as melhores ofertas e economize nas suas compras online.
            </p>
          </div>
          
          {/* Sitemap */}
          <div>
            <h4 className="font-bold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#ofertas" className="text-background/70 hover:text-primary transition-colors">
                  Ofertas do Dia
                </a>
              </li>
              <li>
                <a href="#categorias" className="text-background/70 hover:text-primary transition-colors">
                  Categorias
                </a>
              </li>
              <li>
                <a href="#lojas" className="text-background/70 hover:text-primary transition-colors">
                  Lojas Parceiras
                </a>
              </li>
            </ul>
          </div>
          
          {/* Partner Stores */}
          <div id="lojas">
            <h4 className="font-bold mb-4">Lojas Parceiras</h4>
            <ul className="space-y-2 text-sm">
              {stores?.map((store) => (
                <li key={store.id}>
                  {store.link ? (
                    <a
                      href={store.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-background/70 hover:text-primary transition-colors"
                    >
                      {store.name}
                    </a>
                  ) : (
                    <span className="text-background/70">{store.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Institutional Text */}
        <div className="border-t border-background/20 pt-8">
          <p className="text-xs text-background/50 leading-relaxed">
            {institutionalText}
          </p>
          <p className="text-xs text-background/50 mt-4">
            © {new Date().getFullYear()} Compareo. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
