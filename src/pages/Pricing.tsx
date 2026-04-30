import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useAuth } from '@/contexts/AuthContext';
import {
  Check,
  Crown,
  Download,
  Calendar,
  Video,
  Sparkles,
  Headphones,
  ExternalLink,
  Shield,
  Star,
  UserCheck,
  CreditCard,
  Unlock,
} from 'lucide-react';

// ⚠️  Configure a URL real do seu produto Hotmart na variável de ambiente:
//     VITE_HOTMART_CHECKOUT_URL=https://pay.hotmart.com/SEU_PRODUTO
const HOTMART_CHECKOUT_URL =
  import.meta.env.VITE_HOTMART_CHECKOUT_URL || 'https://pay.hotmart.com/SEU_PRODUTO';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const features = [
  'Todas as músicas e efeitos sonoros',
  'Downloads ilimitados',
  'Atualização de músicas todo dia 7',
  'Live Edit a cada 15 dias',
  'Garantia de 7 dias',
  '1 ano de acesso completo',
  'Histórico de downloads',
  'Suporte prioritário',
  'Licença royalty-free vitalícia',
];

const steps = [
  {
    icon: UserCheck,
    step: '01',
    title: 'Crie sua conta',
    description: 'Cadastro gratuito com e-mail ou Google. Leva menos de 1 minuto.',
  },
  {
    icon: CreditCard,
    step: '02',
    title: 'Faça o pagamento',
    description: 'Pagamento único seguro via Hotmart. Cartão, boleto ou Pix.',
  },
  {
    icon: Unlock,
    step: '03',
    title: 'Acesso imediato',
    description: 'Seu acesso é liberado automaticamente. Comece a baixar na hora.',
  },
];

const testimonials = [
  {
    name: 'Lucas Ferreira',
    role: 'Criador de conteúdo · 280k seguidores',
    text: 'Finalmente uma biblioteca de música que realmente funciona para o YouTube. Zero strikes, qualidade incrível e sempre tem algo novo.',
    stars: 5,
  },
  {
    name: 'Camila Rocha',
    role: 'Videomaker freelancer',
    text: 'Uso o EchoMusic em todos os meus projetos para clientes. A variedade de emoções facilita demais encontrar a trilha certa pra cada vídeo.',
    stars: 5,
  },
  {
    name: 'Rafael Mendes',
    role: 'Editor de vídeo · Agência digital',
    text: 'Melhor investimento que fiz para meu fluxo de trabalho. Em 6 meses baixei mais de 200 músicas e nunca tive problema com direitos autorais.',
    stars: 5,
  },
];

const faqs = [
  {
    q: 'Posso usar no YouTube sem tomar strike ou claim?',
    a: 'Sim. Todos os nossos áudios são royalty-free e não estão registrados em sistemas de Content ID. Você pode monetizar seus vídeos normalmente. Caso receba alguma notificação indevida, é só entrar em contato que resolvemos.',
  },
  {
    q: 'Preciso dar crédito ao EchoMusic nos meus vídeos?',
    a: 'Não é obrigatório. Nossos áudios podem ser usados sem necessidade de crédito na descrição ou no vídeo.',
  },
  {
    q: 'Posso usar em projetos comerciais (publicidade, clientes)?',
    a: 'Sim, totalmente. A licença cobre uso pessoal e comercial — YouTube, TikTok, Instagram, podcasts, anúncios, apresentações corporativas, jogos e muito mais.',
  },
  {
    q: 'O que acontece se eu comprar antes de criar uma conta?',
    a: 'Sem problema. Basta criar sua conta com o mesmo e-mail usado na compra. O acesso é liberado automaticamente.',
  },
  {
    q: 'Tenho garantia? E se eu não gostar?',
    a: 'Sim, 7 dias de garantia incondicional via Hotmart. Se por qualquer motivo você não ficar satisfeito, é só pedir o reembolso dentro do prazo e o dinheiro volta integralmente.',
  },
  {
    q: 'Quantos projetos posso usar ao mesmo tempo?',
    a: 'Ilimitados. Baixe uma vez e use em quantos projetos quiser, sem restrições.',
  },
  {
    q: 'O acesso é compartilhável?',
    a: 'Não. O acesso é individual e intransferível. Compartilhar sua conta viola os Termos de Uso e pode resultar no cancelamento do acesso.',
  },
];

export default function PricingPage() {
  const { user, isSubscribed } = useAuth();

  return (
    <MainLayout>
      <div className="container py-12 md:py-20">

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center mb-14"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
            <Crown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pague uma vez,<br />acesse por 1 ano completo
          </h1>
          <p className="text-lg text-muted-foreground">
            Biblioteca completa de músicas e efeitos sonoros royalty-free. Sem mensalidade, sem surpresa.
          </p>
        </motion.div>

        {/* Plan Card */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mx-auto max-w-lg mb-16">
          <div className="relative rounded-2xl border border-primary/40 p-1 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.15)]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20 px-4 py-1 text-xs flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Melhor custo-benefício
              </Badge>
            </div>

            <div className="rounded-xl bg-secondary/50 p-8 pt-10">
              <h3 className="text-2xl font-bold mb-6">Premium</h3>

              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-bold tracking-tight">R$ 197</span>
                <span className="text-base text-muted-foreground">pagamento único</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">1 ano de acesso completo · sem mensalidade</p>

              {isSubscribed ? (
                <Button className="w-full h-14 text-base rounded-xl" size="lg" disabled>
                  Acesso Ativo ✓
                </Button>
              ) : user ? (
                <a
                  href={`${HOTMART_CHECKOUT_URL}?checkoutEmail=${encodeURIComponent(user.email || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full h-14 text-base rounded-xl gradient-primary hover:opacity-90 gap-2" size="lg">
                    Acessar agora <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <Link to="/auth?mode=signup&redirect=pricing" className="block">
                  <Button className="w-full h-14 text-base rounded-xl gradient-primary hover:opacity-90" size="lg">
                    Criar conta e acessar
                  </Button>
                </Link>
              )}

              {/* Guarantee inline */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Garantia de 7 dias · reembolso sem burocracia</span>
              </div>
            </div>

            <div className="p-8">
              <ul className="space-y-4">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Como funciona */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto max-w-3xl mb-20"
        >
          <h2 className="text-2xl font-bold text-center mb-10">Como funciona</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  variants={fadeUp}
                  className="relative text-center rounded-xl border border-border bg-card p-6"
                >
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-primary bg-primary/10 rounded-full px-3 py-1">
                    {s.step}
                  </span>
                  <div className="mx-auto mb-4 mt-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto max-w-4xl mb-20"
        >
          <h2 className="text-2xl font-bold text-center mb-10">
            Quem usa, aprova
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{t.text}"</p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Guarantee Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl mb-20"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-green-500/30 bg-green-500/5 p-8">
            <div className="shrink-0 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <Shield className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Garantia de 7 dias</h3>
              <p className="text-sm text-muted-foreground">
                Se você não ficar 100% satisfeito com o EchoMusic, basta solicitar o reembolso em até 7 dias
                após a compra. Sem burocracia, sem perguntas. O dinheiro volta integralmente.
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl mb-20"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas frequentes</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-border bg-card px-6"
              >
                <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-5">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-lg text-center"
        >
          {!isSubscribed && (
            <>
              <p className="text-muted-foreground mb-4 text-sm">
                Ainda com dúvidas? Fale com a gente no WhatsApp.
              </p>
              {user ? (
                <a
                  href={`${HOTMART_CHECKOUT_URL}?checkoutEmail=${encodeURIComponent(user.email || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="gradient-primary hover:opacity-90 gap-2 px-10">
                    Garantir meu acesso <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              ) : (
                <Link to="/auth?mode=signup&redirect=pricing">
                  <Button size="lg" className="gradient-primary hover:opacity-90 px-10">
                    Criar conta grátis e acessar
                  </Button>
                </Link>
              )}
            </>
          )}
        </motion.div>

      </div>
    </MainLayout>
  );
}
