import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { AudioCard } from '@/components/audio/AudioCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Music, Waves } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { MusicTrack, SoundEffect, Favorite } from '@/types/database';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export default function FavoritesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
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
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Fetch favorites
    const { data: favData, error: favError } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (favError) {
      console.error('Error fetching favorites:', favError);
      setIsLoading(false);
      return;
    }

    setFavorites(favData as Favorite[]);

    // Get track IDs and SFX IDs
    const trackIds = favData.filter((f) => f.track_id).map((f) => f.track_id!);
    const sfxIds = favData.filter((f) => f.sfx_id).map((f) => f.sfx_id!);

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

  const allItems = [
    ...musicTracks.map((t) => ({ ...t, type: 'music' as const })),
    ...soundEffects.map((s) => ({ ...s, type: 'sfx' as const })),
  ];

  return (
    <MainLayout>
      <div className="container py-8">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
              <Heart className="h-6 w-6 text-pink-500" />
            </div>
            <h1 className="text-3xl font-bold">Favoritos</h1>
          </div>
          <p className="text-muted-foreground">
            Seus arquivos de áudio favoritos em um só lugar
          </p>
        </motion.div>

        <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
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
        </motion.div>
      </div>
    </MainLayout>
  );
}

function EmptyState({ type }: { type?: 'music' | 'sfx' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Heart className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Nenhum favorito ainda</h3>
      <p className="text-muted-foreground">
        {type === 'music' 
          ? 'Adicione músicas aos favoritos clicando no ícone de coração.'
          : type === 'sfx'
          ? 'Adicione efeitos sonoros aos favoritos clicando no ícone de coração.'
          : 'Explore a biblioteca e adicione seus arquivos favoritos.'}
      </p>
    </div>
  );
}
