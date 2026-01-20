import { usePlayer } from '@/contexts/PlayerContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  Heart,
  Music,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function PlayerBar() {
  const { currentTrack, isPlaying, currentTime, duration, volume, isMuted, toggle, seek, setVolume, toggleMute } = usePlayer();
  const { isSubscribed } = useAuth();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Check if track is a music track (has emotion) or SFX (has style)
  const isMusic = currentTrack && 'emotion' in currentTrack;
  const coverImage = currentTrack && isMusic 
    ? (currentTrack as any).cover_image_url 
    : (currentTrack as any)?.icon_url;

  return (
    <div className={cn(
      "fixed bottom-0 left-64 right-0 z-50 h-20 border-t border-border bg-card/95 backdrop-blur-xl transition-transform duration-300",
      !currentTrack && "translate-y-full"
    )}>
      <div className="flex h-full items-center gap-4 px-4">
        {/* Track Info */}
        <div className="flex w-64 items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
            {coverImage ? (
              <img src={coverImage} alt={currentTrack?.title} className="h-full w-full object-cover" />
            ) : (
              <Music className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{currentTrack?.title || 'Nenhuma faixa'}</p>
            <p className="text-sm text-muted-foreground truncate">
              {isMusic ? 'Música' : 'Efeito Sonoro'}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Heart className="h-5 w-5" />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-1 flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              onClick={toggle}
              size="icon"
              className="h-10 w-10 rounded-full gradient-primary hover:opacity-90"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="flex w-full max-w-xl items-center gap-2">
            <span className="w-10 text-xs text-muted-foreground text-right">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={([val]) => seek((val / 100) * duration)}
              className="flex-1"
            />
            <span className="w-10 text-xs text-muted-foreground">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume & Actions */}
        <div className="flex w-48 items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-muted-foreground hover:text-foreground"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            step={1}
            onValueChange={([val]) => setVolume(val / 100)}
            className="w-24"
          />
          {isSubscribed && currentTrack && (
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent">
              <Download className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
