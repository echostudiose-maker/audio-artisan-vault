import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  Music, 
  Waves, 
  Download, 
  Crown, 
  Play,
  Headphones,
  Zap,
  Shield,
} from 'lucide-react';

const features = [
  {
    icon: Music,
    title: 'Músicas por Emoção',
    description: 'Navegue por 15 categorias de emoção para encontrar a trilha perfeita.',
  },
  {
    icon: Waves,
    title: 'Efeitos Sonoros',
    description: 'Mais de 10 estilos de SFX para dar vida aos seus projetos.',
  },
  {
    icon: Download,
    title: 'Downloads Ilimitados',
    description: 'Assinantes têm acesso a downloads ilimitados em alta qualidade.',
  },
  {
    icon: Zap,
    title: 'Atualizações Constantes',
    description: 'Novos arquivos adicionados a cada 15 dias.',
  },
];

const stats = [
  { value: '1000+', label: 'Músicas' },
  { value: '500+', label: 'Efeitos' },
  { value: '15', label: 'Emoções' },
  { value: '11', label: 'Estilos' },
];

export default function Index() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Echo Sound</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Músicas e efeitos sonoros{' '}
              <span className="gradient-text">para criadores</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Músicas e efeitos sonoros de alta qualidade para seus vídeos, podcasts e projetos criativos. 
              Encontre, ouça e baixe em segundos.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/explore">
                <Button size="lg" className="gap-2 gradient-primary hover:opacity-90">
                  <Play className="h-5 w-5" />
                  Explorar Biblioteca
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="gap-2">
                  <Crown className="h-5 w-5" />
                  Ver Planos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50">
        <div className="container py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold gradient-text md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">Tudo que você precisa</h2>
          <p className="text-muted-foreground">
            Recursos pensados para acelerar seu fluxo de trabalho
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pb-20">
        <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 md:p-12">
          <div className="relative z-10 mx-auto max-w-2xl text-center text-white">
            <Headphones className="mx-auto mb-4 h-12 w-12" />
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Comece a criar hoje mesmo
            </h2>
            <p className="mb-6 text-white/80">
              Acesse toda a biblioteca de áudio com uma assinatura simples. 
              Cancele quando quiser.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/auth?mode=signup">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Shield className="h-5 w-5" />
                  Criar Conta Grátis
                </Button>
              </Link>
              <Link to="/explore">
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/20">
                  Explorar Previews
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
