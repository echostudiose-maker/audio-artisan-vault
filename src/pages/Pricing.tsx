import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Crown, Download, Calendar, Video, Sparkles, Headphones, ExternalLink } from 'lucide-react';

const HOTMART_CHECKOUT_URL =
  import.meta.env.VITE_HOTMART_CHECKOUT_URL || 'https://pay.hotmart.com/R105509213E';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const features = [
  'Todas as músicas',
  'Todos os Efeitos Sonoros',
  'Downloads ilimitados',
  'Atualização de músicas',
  'Live Edit 1x por mês no Discord',
  'Garantia de 7 dias',
  'Acesso de 1 ano',
  'Histórico de downloads',
  'Suporte',
];

const benefits = [
  {
    icon: Download,
    title: 'Downloads Ilimitados',
    description: 'Baixe quantos arquivos precisar sem restrições',
  },
  {
    icon: Headphones,
    title: 'Acesso Completo',
    description: 'Todas as músicas e efeitos sonoros disponíveis',
  },
  {
    icon: Calendar,
    title: 'Músicas Novas',
    description: 'Biblioteca atualizada mensalmente com novos conteúdos',
  },
  {
    icon: Video,
    title: 'Live Edit',
    description: 'Sessões de edição ao vivo no Discord',
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
            <span className="text-sm font-medium text-primary">Premium</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Garanta o seu acesso de 1 ano
          </h1>
          <p className="text-lg text-muted-foreground">
            Acesse nossa biblioteca completa de músicas e efeitos sonoros para usar nos seu vídeos.
          </p>
        </motion.div>

        {/* Single Plan Card */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mx-auto max-w-lg mb-20">
          <div className="relative rounded-2xl border border-primary/40 p-1 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)]">
            {/* Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20 px-4 py-1 text-xs flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Melhor custo-benefício
              </Badge>
            </div>

            {/* Inner card: price + CTA */}
            <div className="rounded-xl bg-secondary/50 p-8 pt-10">
              <h3 className="text-2xl font-bold mb-6">Premium</h3>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-bold tracking-tight">R$ 97</span>
                <span className="text-base text-muted-foreground">pagamento único</span>
              </div>

              {isSubscribed ? (
                <Button className="w-full h-14 text-base rounded-xl" size="lg" disabled>
                  Acesso Ativo
                </Button>
              ) : user ? (
                <a
                  href={`${HOTMART_CHECKOUT_URL}?email=${encodeURIComponent(user.email || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    className="w-full h-14 text-base rounded-xl gradient-primary hover:opacity-90 gap-2"
                    size="lg"
                  >
                    Acessar agora <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <a
                  href={HOTMART_CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    className="w-full h-14 text-base rounded-xl gradient-primary hover:opacity-90 gap-2"
                    size="lg"
                  >
                    Quero acessar <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>

            {/* Features */}
            <div className="p-8">
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="mx-auto max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 leading-tight">
            O que você recebe
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <motion.div key={benefit.title} variants={fadeUp} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-base">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ Teaser */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mx-auto max-w-2xl text-center mt-20 p-10 rounded-2xl bg-card border border-border">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 leading-tight">Tem dúvidas?</h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Entre em contato conosco ou explore nossa FAQ para mais informações.
          </p>
          <Button variant="outline">Ver FAQ</Button>
        </motion.div>
      </div>
    </MainLayout>
  );
}
