import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Crown, Zap, Shield, Download, Headphones, Calendar, Video } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

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
      <div className="container py-12 md:py-20">
        {/* Header */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mx-auto max-w-3xl text-center mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Planos e Preços</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-lg text-muted-foreground">
            Acesse nossa biblioteca completa de músicas e efeitos sonoros com licença comercial incluída.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2 mb-20">
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={fadeUp}>
              <Card
                className={`relative flex flex-col h-full rounded-2xl p-0 overflow-visible ${
                  plan.popular ? 'border-primary' : 'border-border'
                }`}
              >
                {/* Badge */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="gradient-primary text-white border-0 px-4 py-1 text-xs">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20 px-4 py-1 text-xs">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                {/* Card inner */}
                <div className="flex flex-col h-full p-8 pt-10">
                  {/* Plan name & description */}
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8 flex items-baseline gap-2">
                    {plan.originalPrice && (
                      <span className="text-base text-muted-foreground line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className="text-5xl md:text-6xl font-bold tracking-tight">{plan.price}</span>
                    <span className="text-base text-muted-foreground">{plan.period}</span>
                  </div>

                  {/* CTA */}
                  <Link to={user ? plan.href : '/auth?mode=signup'} className="block mb-8">
                    <Button
                      className={`w-full h-14 text-base rounded-xl ${plan.popular ? 'gradient-primary hover:opacity-90' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                      disabled={isSubscribed && plan.name !== 'Gratuito'}
                    >
                      {isSubscribed ? 'Plano Atual' : plan.cta}
                    </Button>
                  </Link>

                  {/* License info */}
                  <div className="mb-6 pb-6 border-b border-border">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold">Licença Comercial</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Abrange todo o uso pessoal e comercial de música e efeitos sonoros.
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Benefits */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8">
            Benefícios exclusivos para assinantes
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={benefit.title} variants={fadeUp} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Teaser */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mx-auto max-w-2xl text-center mt-16 p-8 rounded-2xl bg-card border border-border">
          <h3 className="text-xl font-semibold mb-2">Tem dúvidas?</h3>
          <p className="text-muted-foreground mb-4">
            Entre em contato conosco ou explore nossa FAQ para mais informações sobre licenciamento e uso comercial.
          </p>
          <Button variant="outline">Ver FAQ</Button>
        </motion.div>
      </div>
    </MainLayout>
  );
}
