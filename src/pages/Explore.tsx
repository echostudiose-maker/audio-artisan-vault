import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AudioCard } from '@/components/audio/AudioCard';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Music, Waves, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { MusicTrack, SoundEffect } from '@/types/database';

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<'all' | 'music' | 'sfx'>('all');
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [soundEffects, setSoundEffects] = useState<SoundEffect[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const fetchContent = async () => {
    setIsLoading(true);
    
    const [musicResult, sfxResult] = await Promise.all([
      supabase
        .from('music_tracks')
        .select('*')
        .eq('is_active', true)
        .order('download_count', { ascending: false })
        .limit(20),
      supabase
        .from('sound_effects')
        .select('*')
        .eq('is_active', true)
        .order('download_count', { ascending: false })
        .limit(20),
    ]);

    if (musicResult.data) setMusicTracks(musicResult.data as MusicTrack[]);
    if (sfxResult.data) setSoundEffects(sfxResult.data as SoundEffect[]);
    
    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const filterBySearch = <T extends { title: string; tags: string[] }>(items: T[]) => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  };

  const filteredMusic = filterBySearch(musicTracks);
  const filteredSfx = filterBySearch(soundEffects);
  const allItems = [...filteredMusic.map((m) => ({ ...m, type: 'music' as const })), ...filteredSfx.map((s) => ({ ...s, type: 'sfx' as const }))];

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explorar</h1>
          <p className="text-muted-foreground">
            Descubra músicas e efeitos sonoros para seus projetos
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar músicas, efeitos, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 pl-12 text-lg"
            />
          </div>
        </form>

        {/* Quick Links */}
        {!searchQuery && (
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/music"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <Music className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">Músicas</p>
                <p className="text-sm text-muted-foreground">Por emoção</p>
              </div>
            </Link>

            <Link
              to="/sfx"
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent/50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Waves className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-semibold">Efeitos Sonoros</p>
                <p className="text-sm text-muted-foreground">Por estilo</p>
              </div>
            </Link>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-semibold">Populares</p>
                <p className="text-sm text-muted-foreground">Mais baixados</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Sparkles className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-semibold">Novidades</p>
                <p className="text-sm text-muted-foreground">Recém adicionados</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" className="gap-2">
              Todos
              <span className="text-xs text-muted-foreground">({allItems.length})</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="gap-2">
              <Music className="h-4 w-4" />
              Músicas
              <span className="text-xs text-muted-foreground">({filteredMusic.length})</span>
            </TabsTrigger>
            <TabsTrigger value="sfx" className="gap-2">
              <Waves className="h-4 w-4" />
              Efeitos
              <span className="text-xs text-muted-foreground">({filteredSfx.length})</span>
            </TabsTrigger>
          </TabsList>

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
          ) : (
            <>
              <TabsContent value="all">
                {allItems.length === 0 ? (
                  <EmptyState query={searchQuery} />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {allItems.map((item) => (
                      <AudioCard key={item.id} item={item as any} type={item.type} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="music">
                {filteredMusic.length === 0 ? (
                  <EmptyState query={searchQuery} type="music" />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredMusic.map((track) => (
                      <AudioCard key={track.id} item={track} type="music" />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sfx">
                {filteredSfx.length === 0 ? (
                  <EmptyState query={searchQuery} type="sfx" />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredSfx.map((effect) => (
                      <AudioCard key={effect.id} item={effect} type="sfx" />
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
}

function EmptyState({ query, type }: { query?: string; type?: 'music' | 'sfx' }) {
  const Icon = type === 'music' ? Music : type === 'sfx' ? Waves : Search;
  
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {query ? 'Nenhum resultado encontrado' : 'Nenhum conteúdo disponível'}
      </h3>
      <p className="text-muted-foreground">
        {query 
          ? `Não encontramos resultados para "${query}". Tente buscar por outro termo.`
          : 'O conteúdo será adicionado em breve.'}
      </p>
    </div>
  );
}
