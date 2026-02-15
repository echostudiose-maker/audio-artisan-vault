import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    icon: Zap,
    title: 'Atualizações Constantes',
    description: 'Novos arquivos adicionados regularmente',
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
      {/* Hero Section - Epidemic Sound style */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent" />
        <div className="container relative py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
            Músicas e efeitos sonoros{' '}
            <span className="text-primary">sem royalties</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            No nosso catálogo exclusivo, você encontra músicas e efeitos sonoros de alta qualidade para qualquer ocasião.
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="gradient-primary hover:opacity-90 text-base px-8">
              Criar conta grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Search Bar - full width like Epidemic Sound */}
      <section className="bg-card/60 border-y border-border">
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
      </section>

      <div className="container py-10">
        {/* Emoções (Moods) - horizontal cards */}
        <HorizontalScrollSection title="Emoções" seeAllHref="/music" seeAllLabel="Ver todas as emoções">
          {emotionEntries.map(([key, label]) => (
            <CategoryCard
              key={key}
              label={label}
              href={`/music?emotion=${key}`}
              color={EMOTION_COLORS[key]}
            />
          ))}
        </HorizontalScrollSection>

        {/* Efeitos Sonoros (Styles) - horizontal cards */}
        <HorizontalScrollSection title="Efeitos Sonoros" seeAllHref="/sfx" seeAllLabel="Ver todos os estilos">
          {styleEntries.map(([key, label]) => (
            <CategoryCard
              key={key}
              label={label}
              href={`/sfx?style=${key}`}
              color={STYLE_COLORS[key]}
            />
          ))}
        </HorizontalScrollSection>

        {/* Recentes - track list */}
        {recentTracks.length > 0 && (
          <section className="mb-10">
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
          </section>
        )}

        {/* Populares - track list */}
        {popularTracks.length > 0 && (
          <section className="mb-10">
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
          </section>
        )}

        {/* Benefits Section */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-center mb-8">Tudo que você precisa</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-xl border border-border bg-card p-6 text-center transition-colors hover:border-primary/50"
                >
                  <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-10">
          <div className="relative overflow-hidden rounded-2xl gradient-primary p-8 md:p-12">
            <div className="relative z-10 mx-auto max-w-2xl text-center text-white">
              <Crown className="mx-auto mb-4 h-10 w-10" />
              <h2 className="mb-4 text-2xl font-bold md:text-3xl">
                Comece a criar hoje mesmo
              </h2>
              <p className="mb-6 text-white/80">
                Acesse toda a biblioteca de áudio com uma assinatura simples. Cancele quando quiser.
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link to="/auth?mode=signup">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Criar Conta Grátis
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="ghost" className="text-white hover:bg-white/20">
                    Ver Planos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
