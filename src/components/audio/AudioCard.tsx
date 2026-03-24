import { useState } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  Heart,
  Download,
  Plus,
  Copy,
  Music,
  Waves,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MusicTrack, SoundEffect } from '@/types/database';
import { EMOTION_LABELS, STYLE_LABELS, EMOTION_COLORS, STYLE_COLORS } from '@/types/database';
import { toast } from 'sonner';

interface AudioCardProps {
  item: MusicTrack | SoundEffect;
  type: 'music' | 'sfx';
}

export function AudioCard({ item, type }: AudioCardProps) {
  const { play, pause, isPlaying, isCurrentTrack } = usePlayer();
  const { user, isSubscribed } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const isMusic = type === 'music';
  const track = item as MusicTrack;
  const sfx = item as SoundEffect;

  const categoryLabel = isMusic 
    ? EMOTION_LABELS[track.emotion] 
    : STYLE_LABELS[sfx.style];
  
  const categoryColor = isMusic 
    ? EMOTION_COLORS[track.emotion] 
    : STYLE_COLORS[sfx.style];

  const coverImage = isMusic ? track.cover_image_url : sfx.icon_url;
  const isActive = isCurrentTrack(item.id);

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

  const handleCopyName = () => {
    navigator.clipboard.writeText(item.title);
    toast.success('Nome copiado!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(item.file_url);
    toast.success('Link copiado!');
  };

  const handleDownload = () => {
    if (!isSubscribed) {
      toast.error('Adquira o Premium para baixar');
      return;
    }
    // Trigger download
    const link = document.createElement('a');
    link.href = item.file_url;
    link.download = item.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download iniciado!');
  };

  return (
    <div
      className={cn(
        "audio-card group",
        isActive && "border-primary glow"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image */}
      <div className="relative aspect-square overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-secondary to-muted">
            {isMusic ? (
              <Music className="h-12 w-12 text-muted-foreground" />
            ) : (
              <Waves className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
        )}

        {/* Play Button - Always Visible */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={handlePlayPause}
            size="icon"
            className={cn(
              "h-14 w-14 rounded-full shadow-lg transition-all duration-200",
              isActive && isPlaying 
                ? "gradient-primary animate-pulse-glow scale-100" 
                : "bg-white/90 hover:bg-white text-foreground hover:scale-110",
              isHovered && !isActive && "scale-105"
            )}
          >
            {isActive && isPlaying ? (
              <Pause className="h-6 w-6 text-white" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge className={cn("text-white border-0", categoryColor)}>
            {categoryLabel}
          </Badge>
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-black/60 text-white border-0">
            {formatDuration(item.duration_seconds)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold truncate mb-2">{item.title}</h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              +{item.tags.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {user && (
              <>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleCopyName}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <Button
            onClick={handleDownload}
            size="sm"
            variant={isSubscribed ? "default" : "secondary"}
            className={cn(
              "gap-1.5",
              isSubscribed && "gradient-primary hover:opacity-90"
            )}
          >
            <Download className="h-4 w-4" />
            {isSubscribed ? 'Baixar' : 'Premium'}
          </Button>
        </div>
      </div>
    </div>
  );
}
