import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { TrackRow } from '@/components/audio/TrackRow';
import { CategoryCard } from '@/components/audio/CategoryCard';
import { HorizontalScrollSection } from '@/components/audio/HorizontalScroll';
import { StyleFilter } from '@/components/audio/CategoryFilter';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Waves, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { SoundEffect, SfxStyle } from '@/types/database';
import { STYLE_LABELS, STYLE_COLORS } from '@/types/database';

export default function SoundEffectsPage() {
  const [effects, setEffects] = useState<SoundEffect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [styleCovers, setStyleCovers] = useState<Record<string, string>>({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedStyle = (searchParams.get('style') as SfxStyle) || null;

  const setSelectedStyle = (style: SfxStyle | null) => {
    if (style) {
      navigate(`/sfx?style=${style}`);
    } else {
      navigate('/sfx');
    }
  };

  useEffect(() => {
    fetchEffects();
    fetchStyleCovers();
  }, []);

  const fetchEffects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('sound_effects')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching effects:', error);
    } else {
      setEffects(data as SoundEffect[]);
    }
    setIsLoading(false);
  };

  const fetchStyleCovers = async () => {
    const { data } = await supabase.from('sfx_style_covers').select('style, cover_url');
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((row: any) => { map[row.style] = row.cover_url; });
      setStyleCovers(map);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredEffects = effects.filter((effect) => {
    if (selectedStyle && effect.style !== selectedStyle) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return effect.title.toLowerCase().includes(q) || effect.tags.some((t) => t.toLowerCase().includes(q));
    }
    return true;
  });

  const styleEntries = Object.entries(STYLE_LABELS) as [SfxStyle, string][];

  return (
    <MainLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-primary/8 to-transparent">
        <div className="container py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Efeitos Sonoros</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore nossa coleção de efeitos sonoros organizados por estilo para dar vida aos seus projetos.
          </p>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar efeitos sonoros, estilos, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 text-lg bg-card border-border rounded-xl"
              />
            </div>
          </form>
        </div>
      </section>

      <div className="container pb-12">
        {/* Styles - horizontal cards */}
        <HorizontalScrollSection title="Estilos" seeAllHref="/sfx" seeAllLabel="Ver todos os estilos">
          {styleEntries.map(([key, label]) => (
            <CategoryCard
              key={key}
              label={label}
              href={`/sfx?style=${key}`}
              color={STYLE_COLORS[key]}
              coverUrl={styleCovers[key]}
            />
          ))}
        </HorizontalScrollSection>

        {/* Filters */}
        <div className="mb-6">
          <StyleFilter selected={selectedStyle} onSelect={setSelectedStyle} />
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {filteredEffects.length} efeito{filteredEffects.length !== 1 ? 's' : ''} encontrado{filteredEffects.length !== 1 ? 's' : ''}
        </p>

        {/* Track List */}
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEffects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Waves className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum efeito encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou buscar por outro termo
            </p>
          </div>
        ) : (
          <div className="space-y-1 bg-card rounded-xl border border-border p-2">
            {filteredEffects.map((effect, i) => (
              <TrackRow key={effect.id} item={effect} type="sfx" index={i + 1} coverOverride={styleCovers[effect.style]} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
