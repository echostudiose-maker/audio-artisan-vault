import { useMemo } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWaveform } from '@/hooks/useWaveform';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Heart, Download, Plus, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MusicTrack, SoundEffect } from '@/types/database';
import { EMOTION_LABELS, STYLE_LABELS } from '@/types/database';
import { toast } from 'sonner';

interface TrackRowProps {
  item: MusicTrack | SoundEffect;
  type: 'music' | 'sfx';
  index?: number;
  coverOverride?: string;
}

export function TrackRow({ item, type, index, coverOverride }: TrackRowProps) {
  const { play, pause, isPlaying, isCurrentTrack, currentTime, duration } = usePlayer();
  const { user, isSubscribed } = useAuth();

  const isActive = isCurrentTrack(item.id);
  const progress = isActive && duration > 0 ? currentTime / duration : 0;
  const isMusic = type === 'music';
  const track = item as MusicTrack;
  const sfx = item as SoundEffect;
  const waveform = useWaveform(item.file_url, 40);

  const categoryLabel = isMusic
    ? EMOTION_LABELS[track.emotion]
    : STYLE_LABELS[sfx.style];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isActive && isPlaying) {
      pause();
    } else {
      play(item);
    }
  };

  const handleDownload = () => {
    if (!isSubscribed) {
      toast.error('Adquira o Premium para baixar');
      return;
    }
    const link = document.createElement('a');
    link.href = item.file_url;
    link.download = item.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download iniciado!');
  };

  const coverImage = coverOverride || (isMusic ? track.cover_image_url : sfx.icon_url);

  return (
    <div
      className={cn(
        'group flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors hover:bg-secondary/50 cursor-pointer',
        isActive && 'bg-primary/10 hover:bg-primary/15'
      )}
      onClick={handlePlayPause}
    >
      {/* Play button / Index */}
      <div className="w-8 md:w-10 flex items-center justify-center shrink-0">
        <button
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-all',
            isActive && isPlaying
              ? 'bg-primary text-primary-foreground'
              : 'group-hover:bg-primary group-hover:text-primary-foreground bg-secondary text-secondary-foreground'
          )}
          onClick={(e) => {
            e.stopPropagation();
            handlePlayPause();
          }}
        >
          {isActive && isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </button>
      </div>

      {/* Cover */}
      <div className="h-9 w-9 md:h-10 md:w-10 rounded-md overflow-hidden bg-secondary shrink-0">
        {coverImage ? (
          <img src={coverImage} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
      </div>

      {/* Title & Tags */}
      <div className="flex-1 min-w-0">
        <p className={cn('font-medium text-sm truncate', isActive && 'text-primary')}>
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{categoryLabel}</span>
          {item.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground">
              · {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Waveform */}
      <div className="hidden sm:flex items-end gap-px h-8 w-32 shrink-0">
        {waveform ? waveform.map((v, i) => {
          const barProgress = i / waveform.length;
          const isPlayed = isActive && barProgress < progress;
          return (
            <div
              key={i}
              className={cn(
                'flex-1 rounded-sm min-w-[2px] transition-colors',
                isPlayed ? 'bg-primary' : isActive ? 'bg-primary/25' : 'bg-muted-foreground/30'
              )}
              style={{ height: `${v * 100}%` }}
            />
          );
        }) : Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm min-w-[2px] bg-muted-foreground/15"
            style={{ height: '20%' }}
          />
        ))}
      </div>

      {/* Duration */}
      <span className="text-xs md:text-sm text-muted-foreground shrink-0 w-10 md:w-12 text-right">
        {formatDuration(item.duration_seconds)}
      </span>

      {/* Actions - hidden on mobile to save space */}
      <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={(e) => e.stopPropagation()}>
        {user && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Heart className="h-4 w-4" />
          </Button>
        )}
        {user && (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Plus className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-primary"
          onClick={handleDownload}
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
