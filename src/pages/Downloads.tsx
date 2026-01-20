import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AudioCard } from '@/components/audio/AudioCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Music, Waves, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { MusicTrack, SoundEffect, Download as DownloadType } from '@/types/database';

export default function DownloadsPage() {
  const { user, isLoading: authLoading, isSubscribed } = useAuth();
  const navigate = useNavigate();
  const [downloads, setDownloads] = useState<DownloadType[]>([]);
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [soundEffects, setSoundEffects] = useState<SoundEffect[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'music' | 'sfx'>('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDownloads();
    }
  }, [user]);

  const fetchDownloads = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Fetch downloads
    const { data: dlData, error: dlError } = await supabase
      .from('downloads')
      .select('*')
      .eq('user_id', user.id)
      .order('downloaded_at', { ascending: false });

    if (dlError) {
      console.error('Error fetching downloads:', dlError);
      setIsLoading(false);
      return;
    }

    setDownloads(dlData as DownloadType[]);

    // Get unique track IDs and SFX IDs
    const trackIds = [...new Set(dlData.filter((d) => d.track_id).map((d) => d.track_id!))];
    const sfxIds = [...new Set(dlData.filter((d) => d.sfx_id).map((d) => d.sfx_id!))];

    // Fetch tracks
    if (trackIds.length > 0) {
      const { data: trackData } = await supabase
        .from('music_tracks')
        .select('*')
        .in('id', trackIds);
      
      if (trackData) setMusicTracks(trackData as MusicTrack[]);
    }

    // Fetch effects
    if (sfxIds.length > 0) {
      const { data: sfxData } = await supabase
        .from('sound_effects')
        .select('*')
        .in('id', sfxIds);
      
      if (sfxData) setSoundEffects(sfxData as SoundEffect[]);
    }

    setIsLoading(false);
  };

  if (authLoading || !user) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isSubscribed) {
    return (
      <MainLayout>
        <div className="container py-20">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Acesso Premium Necessário</h1>
            <p className="text-muted-foreground mb-6">
              Assine o plano Premium para baixar arquivos e ter acesso ao histórico de downloads.
            </p>
            <Link to="/pricing">
              <Button className="gap-2 gradient-primary hover:opacity-90">
                <Crown className="h-4 w-4" />
                Ver Planos
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const allItems = [
    ...musicTracks.map((t) => ({ ...t, type: 'music' as const })),
    ...soundEffects.map((s) => ({ ...s, type: 'sfx' as const })),
  ];

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Download className="h-6 w-6 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold">Meus Downloads</h1>
          </div>
          <p className="text-muted-foreground">
            Histórico de todos os arquivos que você baixou
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total de Downloads</p>
            <p className="text-2xl font-bold">{downloads.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Músicas</p>
            <p className="text-2xl font-bold">{musicTracks.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Efeitos</p>
            <p className="text-2xl font-bold">{soundEffects.length}</p>
          </div>
        </div>

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
              <span className="text-xs text-muted-foreground">({musicTracks.length})</span>
            </TabsTrigger>
            <TabsTrigger value="sfx" className="gap-2">
              <Waves className="h-4 w-4" />
              Efeitos
              <span className="text-xs text-muted-foreground">({soundEffects.length})</span>
            </TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
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
                  <EmptyState />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {allItems.map((item) => (
                      <AudioCard key={item.id} item={item as any} type={item.type} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="music">
                {musicTracks.length === 0 ? (
                  <EmptyState type="music" />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {musicTracks.map((track) => (
                      <AudioCard key={track.id} item={track} type="music" />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sfx">
                {soundEffects.length === 0 ? (
                  <EmptyState type="sfx" />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {soundEffects.map((effect) => (
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

function EmptyState({ type }: { type?: 'music' | 'sfx' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Download className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Nenhum download ainda</h3>
      <p className="text-muted-foreground mb-4">
        {type === 'music' 
          ? 'Explore nossa biblioteca de músicas e comece a baixar.'
          : type === 'sfx'
          ? 'Explore nossa coleção de efeitos sonoros e comece a baixar.'
          : 'Explore a biblioteca e comece a baixar seus arquivos favoritos.'}
      </p>
      <Link to="/explore">
        <Button>Explorar Biblioteca</Button>
      </Link>
    </div>
  );
}
