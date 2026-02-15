import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EMOTION_LABELS, EMOTION_COLORS, type MusicEmotion } from '@/types/database';
import { Loader2, Upload, ImageIcon, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function EmotionCoversManager() {
  const [covers, setCovers] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCovers();
  }, []);

  const fetchCovers = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('music_emotion_covers').select('emotion, cover_url');
    if (data) {
      const map: Record<string, string> = {};
      data.forEach((row: any) => { map[row.emotion] = row.cover_url; });
      setCovers(map);
    }
    setIsLoading(false);
  };

  const handleUpload = async (emotion: MusicEmotion, file: File) => {
    setUploading(emotion);
    try {
      const ext = file.name.split('.').pop();
      const path = `emotion-covers/${emotion}-${Date.now()}.${ext}`;
      const { error: storageErr } = await supabase.storage
        .from('cover-images')
        .upload(path, file, { upsert: true });
      if (storageErr) throw storageErr;

      const { data: urlData } = supabase.storage.from('cover-images').getPublicUrl(path);

      const { error: dbErr } = await supabase
        .from('music_emotion_covers')
        .upsert({ emotion, cover_url: urlData.publicUrl }, { onConflict: 'emotion' });
      if (dbErr) throw dbErr;

      setCovers(prev => ({ ...prev, [emotion]: urlData.publicUrl }));
      toast.success(`Capa de "${EMOTION_LABELS[emotion]}" atualizada!`);
    } catch (err: any) {
      toast.error(`Erro: ${err.message}`);
    }
    setUploading(null);
  };

  const emotionEntries = Object.entries(EMOTION_LABELS) as [MusicEmotion, string][];

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Capas das Emoções</h3>
        <p className="text-sm text-muted-foreground">
          Faça upload de uma imagem de capa para cada emoção de música.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {emotionEntries.map(([key, label]) => {
            const hasCover = !!covers[key];
            const isCurrentlyUploading = uploading === key;

            return (
              <label
                key={key}
                className={cn(
                  'group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-3 cursor-pointer transition-colors',
                  hasCover
                    ? 'border-primary/30 hover:border-primary/50'
                    : 'border-border hover:border-muted-foreground/50'
                )}
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 relative">
                  {hasCover ? (
                    <img src={covers[key]} alt={label} className="w-full h-full object-cover" />
                  ) : (
                    <div className={cn('w-full h-full flex items-center justify-center', EMOTION_COLORS[key])}>
                      <ImageIcon className="h-8 w-8 text-white/70" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {isCurrentlyUploading ? (
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    ) : (
                      <Upload className="h-6 w-6 text-white" />
                    )}
                  </div>
                  {hasCover && (
                    <div className="absolute top-1 right-1">
                      <Check className="h-4 w-4 text-green-400 bg-black/50 rounded-full p-0.5" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-center truncate w-full">{label}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isCurrentlyUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(key, file);
                    e.target.value = '';
                  }}
                />
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
