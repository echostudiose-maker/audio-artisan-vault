import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { CategoryCard } from '@/components/audio/CategoryCard';
import { TrackRow } from '@/components/audio/TrackRow';
import { HorizontalScrollSection } from '@/components/audio/HorizontalScroll';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Music,
  Waves,
  Search,
  Crown,
  Headphones,
  Shield,
  Download,
  Zap,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { MusicTrack, SoundEffect, MusicEmotion, SfxStyle } from '@/types/database';
import { EMOTION_LABELS, EMOTION_COLORS, STYLE_LABELS, STYLE_COLORS } from '@/types/database';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const benefits = [
  {
    icon: Download,
    title: 'Downloads Ilimitados',
    description: 'Baixe quantos arquivos precisar sem restrições',
  },
  {
    icon: Shield,
    title: 'Uso 100% seguro',
    description: 'Use em projetos comerciais sem preocupações',
  },
  {
    icon: Zap,
    title: 'Atualizações Constantes',
    description: 'Todo dia 7 teremos músicas novas',
  },
  {
    icon: Headphones,
    title: 'Alta Qualidade',
    description: 'Arquivos em formato profissional de alta fidelidade',
  },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentTracks, setRecentTracks] = useState<MusicTrack[]>([]);
  const [popularTracks, setPopularTracks] = useState<MusicTrack[]>([]);
  const [recentSfx, setRecentSfx] = useState<SoundEffect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    const [recentRes, popularRes, sfxRes] = await Promise.all([
      supabase.from('music_tracks').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(10),
      supabase.from('music_tracks').select('*').eq('is_active', true).order('download_count', { ascending: false }).limit(10),
      supabase.from('sound_effects').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(10),
    ]);

    if (recentRes.data) setRecentTracks(recentRes.data as MusicTrack[]);
    if (popularRes.data) setPopularTracks(popularRes.data as MusicTrack[]);
    if (sfxRes.data) setRecentSfx(sfxRes.data as SoundEffect[]);
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const emotionEntries = Object.entries(EMOTION_LABELS) as [MusicEmotion, string][];
  const styleEntries = Object.entries(STYLE_LABELS) as [SfxStyle, string][];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          src="/videos/hero-bg.mp4"
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="container relative py-12 md:py-28 text-center px-4">
          <motion.h1
            className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 tracking-wide"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            Deixe o seu vídeo livre de direitos autorais<br className="hidden sm:block" />
            <span className="text-primary"> com qualquer estilo de música.</span>
          </motion.h1>
          <motion.p
            className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 md:mb-8 px-2"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            Acesse agora a maior coleção de músicas e efeitos sonoros autênticos e emocionalmente impactantes para qualquer ocasião.
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.span variants={fadeUp} custom={2} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary">
              <Music className="h-4 w-4" /> + de 1000 músicas
            </motion.span>
            <motion.span variants={fadeUp} custom={3} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary">
              <Waves className="h-4 w-4" /> + de 5000 efeitos sonoros
            </motion.span>
            <motion.span variants={fadeUp} custom={4} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" /> Atualizações todo mês
            </motion.span>
          </motion.div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
          >
            <a href="https://pay.hotmart.com/Y105507230D" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="gradient-primary hover:opacity-90 text-base px-8">
                Acessar agora
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Search Bar */}
      <motion.section
        className="bg-card/60 border-y border-border"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        custom={0}
      >
        <div className="container py-6">
          <form onSubmit={handleSearch}>
            <div className="relative max-w-3xl mx-auto">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar músicas, emoções, efeitos sonoros ou tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 text-lg bg-background border-border rounded-xl"
              />
            </div>
          </form>
        </div>
      </motion.section>

      <div className="container py-10">
        {/* Emoções */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <HorizontalScrollSection
            title="Emoções"
            seeAllLabel="Ver todas as emoções"
            allItems={emotionEntries.map(([key, label]) => (
              <CategoryCard key={key} label={label} href={`/music?emotion=${key}`} color={EMOTION_COLORS[key]} />
            ))}
          >
            {emotionEntries.map(([key, label]) => (
              <CategoryCard key={key} label={label} href={`/music?emotion=${key}`} color={EMOTION_COLORS[key]} />
            ))}
          </HorizontalScrollSection>
        </motion.div>

        {/* Efeitos Sonoros */}
        <motion.div
          variants={slideInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <HorizontalScrollSection
            title="Efeitos Sonoros"
            seeAllLabel="Ver todos os estilos"
            allItems={styleEntries.map(([key, label]) => (
              <CategoryCard key={key} label={label} href={`/sfx?style=${key}`} color={STYLE_COLORS[key]} />
            ))}
          >
            {styleEntries.map(([key, label]) => (
              <CategoryCard key={key} label={label} href={`/sfx?style=${key}`} color={STYLE_COLORS[key]} />
            ))}
          </HorizontalScrollSection>
        </motion.div>

        {/* Recentes */}
        {recentTracks.length > 0 && (
          <motion.section
            className="mb-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Adicionados recentemente</h2>
              <Link to="/music" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Ver mais →
              </Link>
            </div>
            <div className="space-y-1 bg-card rounded-xl border border-border p-2">
              {recentTracks.slice(0, 5).map((track, i) => (
                <TrackRow key={track.id} item={track} type="music" index={i + 1} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Populares */}
        {popularTracks.length > 0 && (
          <motion.section
            className="mb-10"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={0}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Mais populares</h2>
              <Link to="/music" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Ver mais →
              </Link>
            </div>
            <div className="space-y-1 bg-card rounded-xl border border-border p-2">
              {popularTracks.slice(0, 5).map((track, i) => (
                <TrackRow key={track.id} item={track} type="music" index={i + 1} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Benefits */}
        <motion.section
          className="mb-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
        >
          <h2 className="text-xl font-bold text-center mb-8">Tudo que você precisa</h2>
          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/50"
                >
                  <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="mb-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          custom={0}
        >
          <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 md:p-12">
            <div className="relative z-10 mx-auto max-w-2xl text-center text-white">
              <Crown className="mx-auto mb-4 h-10 w-10" />
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                Comece a criar hoje mesmo
              </h2>
              <p className="mb-6 text-white/80">
                Acesse toda a biblioteca de áudio com uma única compra. Use para sempre.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link to="/auth?mode=signup">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Criar Conta Grátis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </MainLayout>
  );
}
