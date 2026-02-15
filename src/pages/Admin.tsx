import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EMOTION_LABELS, STYLE_LABELS, type MusicEmotion, type SfxStyle } from '@/types/database';
import { Upload, Music, Waves, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
}

export default function Admin() {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Painel Admin</h1>
        <p className="text-muted-foreground mb-8">Faça upload de músicas e efeitos sonoros.</p>

        <Tabs defaultValue="music" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="music" className="gap-2">
              <Music className="h-4 w-4" /> Músicas
            </TabsTrigger>
            <TabsTrigger value="sfx" className="gap-2">
              <Waves className="h-4 w-4" /> Efeitos Sonoros
            </TabsTrigger>
          </TabsList>

          <TabsContent value="music">
            <MusicUploadForm />
          </TabsContent>
          <TabsContent value="sfx">
            <SfxUploadForm />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function MusicUploadForm() {
  const [title, setTitle] = useState('');
  const [emotion, setEmotion] = useState<MusicEmotion | ''>('');
  const [tags, setTags] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>({ status: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !emotion || !title.trim()) {
      toast.error('Preencha título, emoção e arquivo de áudio.');
      return;
    }

    setStatus({ status: 'uploading', message: 'Enviando arquivo de áudio...' });

    try {
      // Upload audio
      const audioExt = audioFile.name.split('.').pop();
      const audioPath = `music/${Date.now()}-${crypto.randomUUID()}.${audioExt}`;
      const { error: audioError } = await supabase.storage
        .from('audio-files')
        .upload(audioPath, audioFile);
      if (audioError) throw audioError;

      const { data: audioUrl } = supabase.storage.from('audio-files').getPublicUrl(audioPath);

      // Upload cover if provided
      let coverUrl: string | null = null;
      if (coverFile) {
        setStatus({ status: 'uploading', message: 'Enviando capa...' });
        const coverExt = coverFile.name.split('.').pop();
        const coverPath = `covers/${Date.now()}-${crypto.randomUUID()}.${coverExt}`;
        const { error: coverError } = await supabase.storage
          .from('cover-images')
          .upload(coverPath, coverFile);
        if (coverError) throw coverError;
        const { data: coverData } = supabase.storage.from('cover-images').getPublicUrl(coverPath);
        coverUrl = coverData.publicUrl;
      }

      // Get audio duration
      const duration = await getAudioDuration(audioFile);

      // Insert into DB
      setStatus({ status: 'uploading', message: 'Salvando no banco de dados...' });
      const { error: dbError } = await supabase.from('music_tracks').insert({
        title: title.trim(),
        emotion: emotion as MusicEmotion,
        duration_seconds: Math.round(duration),
        file_url: audioUrl.publicUrl,
        cover_image_url: coverUrl,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      if (dbError) throw dbError;

      setStatus({ status: 'success', message: 'Música enviada com sucesso!' });
      toast.success('Música enviada com sucesso!');
      
      // Reset form
      setTitle('');
      setEmotion('');
      setTags('');
      setAudioFile(null);
      setCoverFile(null);
      setTimeout(() => setStatus({ status: 'idle' }), 3000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatus({ status: 'error', message: err.message || 'Erro ao enviar.' });
      toast.error('Erro ao enviar música.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="music-title">Título *</Label>
          <Input id="music-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nome da música" required />
        </div>
        <div className="space-y-2">
          <Label>Emoção *</Label>
          <Select value={emotion} onValueChange={v => setEmotion(v as MusicEmotion)}>
            <SelectTrigger><SelectValue placeholder="Selecione a emoção" /></SelectTrigger>
            <SelectContent>
              {Object.entries(EMOTION_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="music-tags">Tags (separadas por vírgula)</Label>
        <Input id="music-tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="ex: pop, energético, vlog" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Arquivo de Áudio * (MP3, WAV)</Label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="audio/*"
              onChange={e => setAudioFile(e.target.files?.[0] || null)}
              className="file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:text-primary-foreground"
            />
          </div>
          {audioFile && <p className="text-xs text-muted-foreground">{audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(1)} MB)</p>}
        </div>
        <div className="space-y-2">
          <Label>Capa (opcional)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={e => setCoverFile(e.target.files?.[0] || null)}
            className="file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:text-primary-foreground"
          />
          {coverFile && <p className="text-xs text-muted-foreground">{coverFile.name}</p>}
        </div>
      </div>

      <SubmitButton status={status} label="Enviar Música" />
    </form>
  );
}

function SfxUploadForm() {
  const [title, setTitle] = useState('');
  const [style, setStyle] = useState<SfxStyle | ''>('');
  const [tags, setTags] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>({ status: 'idle' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile || !style || !title.trim()) {
      toast.error('Preencha título, estilo e arquivo de áudio.');
      return;
    }

    setStatus({ status: 'uploading', message: 'Enviando arquivo...' });

    try {
      const audioExt = audioFile.name.split('.').pop();
      const audioPath = `sfx/${Date.now()}-${crypto.randomUUID()}.${audioExt}`;
      const { error: audioError } = await supabase.storage
        .from('audio-files')
        .upload(audioPath, audioFile);
      if (audioError) throw audioError;

      const { data: audioUrl } = supabase.storage.from('audio-files').getPublicUrl(audioPath);
      const duration = await getAudioDuration(audioFile);

      setStatus({ status: 'uploading', message: 'Salvando no banco de dados...' });
      const { error: dbError } = await supabase.from('sound_effects').insert({
        title: title.trim(),
        style: style as SfxStyle,
        duration_seconds: Math.round(duration),
        file_url: audioUrl.publicUrl,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      if (dbError) throw dbError;

      setStatus({ status: 'success', message: 'Efeito sonoro enviado!' });
      toast.success('Efeito sonoro enviado com sucesso!');
      setTitle('');
      setStyle('');
      setTags('');
      setAudioFile(null);
      setTimeout(() => setStatus({ status: 'idle' }), 3000);
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatus({ status: 'error', message: err.message || 'Erro ao enviar.' });
      toast.error('Erro ao enviar efeito sonoro.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sfx-title">Título *</Label>
          <Input id="sfx-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Nome do efeito" required />
        </div>
        <div className="space-y-2">
          <Label>Estilo *</Label>
          <Select value={style} onValueChange={v => setStyle(v as SfxStyle)}>
            <SelectTrigger><SelectValue placeholder="Selecione o estilo" /></SelectTrigger>
            <SelectContent>
              {Object.entries(STYLE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sfx-tags">Tags (separadas por vírgula)</Label>
        <Input id="sfx-tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="ex: transição, whoosh, curto" />
      </div>

      <div className="space-y-2">
        <Label>Arquivo de Áudio * (MP3, WAV)</Label>
        <Input
          type="file"
          accept="audio/*"
          onChange={e => setAudioFile(e.target.files?.[0] || null)}
          className="file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:text-primary-foreground"
        />
        {audioFile && <p className="text-xs text-muted-foreground">{audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(1)} MB)</p>}
      </div>

      <SubmitButton status={status} label="Enviar Efeito Sonoro" />
    </form>
  );
}

function SubmitButton({ status, label }: { status: UploadStatus; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" disabled={status.status === 'uploading'} className="gap-2">
        {status.status === 'uploading' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {status.status === 'uploading' ? 'Enviando...' : label}
      </Button>
      {status.message && status.status !== 'idle' && (
        <span className={`flex items-center gap-1 text-sm ${status.status === 'success' ? 'text-green-500' : status.status === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}>
          {status.status === 'success' && <CheckCircle className="h-4 w-4" />}
          {status.status === 'error' && <AlertCircle className="h-4 w-4" />}
          {status.message}
        </span>
      )}
    </div>
  );
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.addEventListener('loadedmetadata', () => resolve(audio.duration));
    audio.addEventListener('error', () => resolve(0));
    audio.src = URL.createObjectURL(file);
  });
}
