import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { TrackRow } from '@/components/audio/TrackRow';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Music, Waves } from 'lucide-react';
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
    if (query) setSearchQuery(query);
  }, [searchParams]);

  const fetchContent = async () => {
    setIsLoading(true);
    const [musicResult, sfxResult] = await Promise.all([
      supabase.from('music_tracks').select('*').eq('is_active', true).order('download_count', { ascending: false }).limit(50),
      supabase.from('sound_effects').select('*').eq('is_active', true).order('download_count', { ascending: false }).limit(50),
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
      (item) => item.title.toLowerCase().includes(query) || item.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  };

  const filteredMusic = filterBySearch(musicTracks);
  const filteredSfx = filterBySearch(soundEffects);

  return (
    <MainLayout>
      {/* Search hero */}
      <section className="bg-gradient-to-b from-primary/8 to-transparent">
        <div className="container py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Explorar</h1>
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar músicas, efeitos, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 text-lg bg-card border-border rounded-xl"
              />
            </div>
          </form>
        </div>
      </section>

      <div className="container pb-12">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              Todos ({filteredMusic.length + filteredSfx.length})
            </TabsTrigger>
            <TabsTrigger value="music" className="gap-2">
              <Music className="h-4 w-4" />
              Músicas ({filteredMusic.length})
            </TabsTrigger>
            <TabsTrigger value="sfx" className="gap-2">
              <Waves className="h-4 w-4" />
              Efeitos ({filteredSfx.length})
            </TabsTrigger>
          </TabsList>

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
          ) : (
            <>
              <TabsContent value="all">
                <TrackList
                  music={filteredMusic}
                  sfx={filteredSfx}
                  query={searchQuery}
                />
              </TabsContent>
              <TabsContent value="music">
                {filteredMusic.length === 0 ? (
                  <EmptyState query={searchQuery} />
                ) : (
                  <div className="space-y-1 bg-card rounded-xl border border-border p-2">
                    {filteredMusic.map((t, i) => (
                      <TrackRow key={t.id} item={t} type="music" index={i + 1} />
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="sfx">
                {filteredSfx.length === 0 ? (
                  <EmptyState query={searchQuery} />
                ) : (
                  <div className="space-y-1 bg-card rounded-xl border border-border p-2">
                    {filteredSfx.map((s, i) => (
                      <TrackRow key={s.id} item={s} type="sfx" index={i + 1} />
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

function TrackList({ music, sfx, query }: { music: MusicTrack[]; sfx: SoundEffect[]; query: string }) {
  const all = [
    ...music.map((m) => ({ ...m, _type: 'music' as const })),
    ...sfx.map((s) => ({ ...s, _type: 'sfx' as const })),
  ];

  if (all.length === 0) return <EmptyState query={query} />;

  return (
    <div className="space-y-1 bg-card rounded-xl border border-border p-2">
      {all.map((item, i) => (
        <TrackRow key={item.id} item={item as any} type={item._type} index={i + 1} />
      ))}
    </div>
  );
}

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Search className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">
        {query ? 'Nenhum resultado encontrado' : 'Nenhum conteúdo disponível'}
      </h3>
      <p className="text-muted-foreground">
        {query
          ? `Não encontramos resultados para "${query}". Tente outro termo.`
          : 'O conteúdo será adicionado em breve.'}
      </p>
    </div>
  );
}
