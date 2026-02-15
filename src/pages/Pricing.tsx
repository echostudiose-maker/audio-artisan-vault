import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Crown, Zap, Shield, Download, Headphones, Calendar, Video } from 'lucide-react';

const plans = [
  {
    name: 'Premium Mensal',
    description: 'Para criadores frequentes',
    price: 'R$ 49',
    period: '/mês',
    features: [
      'Músicas separadas por emoção',
      'Downloads ilimitados',
      'Atualização de músicas todo dia 7',
      'Acesso a toda biblioteca',
      'Favoritos e playlists',
      'Histórico de downloads',
      'Licença comercial incluída',
      'Suporte prioritário',
    ],
    limitations: [],
    cta: 'Assinar Mensal',
    href: '/checkout?plan=monthly',
    popular: true,
  },
  {
    name: 'Premium Anual',
    description: 'Melhor custo-benefício',
    price: 'R$ 399',
    period: '/ano',
    originalPrice: 'R$ 588',
    features: [
      'Todos os benefícios do Mensal',
      'Live Edit a cada 15 dias',
      '2 meses grátis',
      'Acesso antecipado a novidades',
      'Badge exclusivo de apoiador',
    ],
    limitations: [],
    cta: 'Assinar Anual',
    href: '/checkout?plan=yearly',
    popular: false,
    badge: 'Economia de R$ 189',
  },
];

const benefits = [
  {
    icon: Download,
    title: 'Downloads Ilimitados',
    description: 'Baixe quantos arquivos precisar sem restrições',
  },
  {
    icon: Shield,
    title: 'Licença Comercial',
    description: 'Use em projetos comerciais sem preocupações',
  },
  {
    icon: Calendar,
    title: 'Músicas Novas Todo Dia 7',
    description: 'Biblioteca atualizada mensalmente com novos conteúdos',
  },
  {
    icon: Video,
    title: 'Live Edit (Anual)',
    description: 'Sessões de edição ao vivo a cada 15 dias para assinantes anuais',
  },
];

export default function PricingPage() {
  const { user, isSubscribed } = useAuth();

  return (
    <MainLayout>
      <div className="container py-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Planos e Preços</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg text-muted-foreground">
            Acesse nossa biblioteca completa de músicas e efeitos sonoros com licença comercial incluída.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-2 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular ? 'border-primary shadow-lg shadow-primary/10' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-primary text-white border-0">
                    Mais Popular
                  </Badge>
                </div>
              )}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                    {plan.badge}
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  {plan.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through mr-2">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={user ? plan.href : '/auth?mode=signup'}>
                  <Button
                    className={`w-full ${plan.popular ? 'gradient-primary hover:opacity-90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    disabled={isSubscribed && plan.name !== 'Gratuito'}
                  >
                    {isSubscribed ? 'Plano Atual' : plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8">
            Benefícios exclusivos para assinantes
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Teaser */}
        <div className="mx-auto max-w-2xl text-center mt-16 p-8 rounded-2xl bg-card border border-border">
          <h3 className="text-xl font-semibold mb-2">Tem dúvidas?</h3>
          <p className="text-muted-foreground mb-4">
            Entre em contato conosco ou explore nossa FAQ para mais informações sobre licenciamento e uso comercial.
          </p>
          <Button variant="outline">Ver FAQ</Button>
        </div>
      </div>
    </MainLayout>
  );
}
