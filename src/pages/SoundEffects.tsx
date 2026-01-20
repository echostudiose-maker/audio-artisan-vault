import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AudioCard } from '@/components/audio/AudioCard';
import { StyleFilter } from '@/components/audio/CategoryFilter';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Waves, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { SoundEffect, SfxStyle } from '@/types/database';

type SortOption = 'recent' | 'popular' | 'duration-asc' | 'duration-desc';

export default function SoundEffectsPage() {
  const [effects, setEffects] = useState<SoundEffect[]>([]);
  const [filteredEffects, setFilteredEffects] = useState<SoundEffect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStyle, setSelectedStyle] = useState<SfxStyle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  useEffect(() => {
    fetchEffects();
  }, []);

  useEffect(() => {
    filterAndSortEffects();
  }, [effects, selectedStyle, searchQuery, sortBy]);

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

  const filterAndSortEffects = () => {
    let result = [...effects];

    // Filter by style
    if (selectedStyle) {
      result = result.filter((effect) => effect.style === selectedStyle);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (effect) =>
          effect.title.toLowerCase().includes(query) ||
          effect.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'popular':
        result.sort((a, b) => b.download_count - a.download_count);
        break;
      case 'duration-asc':
        result.sort((a, b) => a.duration_seconds - b.duration_seconds);
        break;
      case 'duration-desc':
        result.sort((a, b) => b.duration_seconds - a.duration_seconds);
        break;
    }

    setFilteredEffects(result);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Waves className="h-6 w-6 text-accent-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Efeitos Sonoros</h1>
          </div>
          <p className="text-muted-foreground">
            Explore nossa coleção de efeitos sonoros organizados por estilo
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <StyleFilter selected={selectedStyle} onSelect={setSelectedStyle} />
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="popular">Mais populares</SelectItem>
                <SelectItem value="duration-asc">Duração (menor)</SelectItem>
                <SelectItem value="duration-desc">Duração (maior)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-muted-foreground">
          {filteredEffects.length} efeito{filteredEffects.length !== 1 ? 's' : ''} encontrado{filteredEffects.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredEffects.map((effect) => (
              <AudioCard key={effect.id} item={effect} type="sfx" />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
