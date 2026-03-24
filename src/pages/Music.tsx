import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { TrackRow } from '@/components/audio/TrackRow';
import { CategoryCard } from '@/components/audio/CategoryCard';
import { HorizontalScrollSection } from '@/components/audio/HorizontalScroll';
import { EmotionFilter } from '@/components/audio/CategoryFilter';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Music } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { MusicTrack, MusicEmotion } from '@/types/database';
import { EMOTION_LABELS, EMOTION_COLORS } from '@/types/database';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};
const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function MusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [emotionCovers, setEmotionCovers] = useState<Record<string, string>>({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedEmotion = (searchParams.get('emotion') as MusicEmotion) || null;

  const setSelectedEmotion = (emotion: MusicEmotion | null) => {
    if (emotion) {
      navigate(`/music?emotion=${emotion}`);
    } else {
      navigate('/music');
    }
  };

  useEffect(() => {
    fetchTracks();
    fetchEmotionCovers();
  }, []);

  const fetchTracks = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('music_tracks')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tracks:', error);
    } else {
      setTracks(data as MusicTrack[]);
    }
    setIsLoading(false);
  };

  const fetchEmotionCovers = async () => {
    const { data } = await supabase.from('music_emotion_covers').select('emotion, cover_url');
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((row: any) => { map[row.emotion] = row.cover_url; });
      setEmotionCovers(map);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const filteredTracks = tracks.filter((track) => {
    if (selectedEmotion && track.emotion !== selectedEmotion) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return track.title.toLowerCase().includes(q) || track.tags.some((t) => t.toLowerCase().includes(q));
    }
    return true;
  });

  // Group by emotion for category cards
  const emotionEntries = Object.entries(EMOTION_LABELS) as [MusicEmotion, string][];

  return (
    <MainLayout>
      <section className="relative bg-gradient-to-b from-primary/8 to-transparent">
        <div className="container py-16 text-center">
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" className="text-4xl md:text-5xl font-bold mb-4">
            O Poder das <span className="text-primary">Músicas</span>
          </motion.h1>
          <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore nossa biblioteca de músicas organizadas por emoção. Áudio profissional para seus vídeos, podcasts e projetos criativos.
          </motion.p>
          <motion.form variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }} onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar músicas, emoções, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 text-lg bg-card border-border rounded-xl"
              />
            </div>
          </motion.form>
        </div>
      </section>

      <div className="container pb-12">
        <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <HorizontalScrollSection title="Emoções" seeAllHref="/music" seeAllLabel="Ver todas as emoções">
            {emotionEntries.map(([key, label]) => (
              <CategoryCard
                key={key}
                label={label}
                href={`/music?emotion=${key}`}
                color={EMOTION_COLORS[key]}
                coverUrl={emotionCovers[key]}
              />
            ))}
          </HorizontalScrollSection>
        </motion.div>

        {/* Filters */}
        <div className="mb-6">
          <EmotionFilter selected={selectedEmotion} onSelect={setSelectedEmotion} />
        </div>

        {/* Track count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredTracks.length} música{filteredTracks.length !== 1 ? 's' : ''} encontrada{filteredTracks.length !== 1 ? 's' : ''}
        </p>

        <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true }}>
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
                  <Skeleton className="h-4 w-10" />
                </div>
              ))}
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Music className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma música encontrada</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTracks.map((track, i) => (
                <TrackRow key={track.id} item={track} type="music" index={i + 1} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
