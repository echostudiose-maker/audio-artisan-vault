import { useState, useCallback } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { EMOTION_LABELS, STYLE_LABELS, type MusicEmotion, type SfxStyle } from '@/types/database';
import { Upload, Music, Waves, Loader2, CheckCircle, AlertCircle, X, FileAudio, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { StyleCoversManager } from '@/components/admin/StyleCoversManager';
import { EmotionCoversManager } from '@/components/admin/EmotionCoversManager';

interface FileUploadItem {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  message?: string;
  customTitle?: string;
}

export default function Admin() {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Painel Admin</h1>
        <p className="text-muted-foreground mb-8">Faça upload de músicas e efeitos sonoros em lote.</p>

        <Tabs defaultValue="music" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="music" className="gap-2">
              <Music className="h-4 w-4" /> Músicas
            </TabsTrigger>
            <TabsTrigger value="sfx" className="gap-2">
              <Waves className="h-4 w-4" /> Efeitos Sonoros
            </TabsTrigger>
            <TabsTrigger value="covers" className="gap-2">
              <ImageIcon className="h-4 w-4" /> Capas SFX
            </TabsTrigger>
            <TabsTrigger value="emotion-covers" className="gap-2">
              <ImageIcon className="h-4 w-4" /> Capas Músicas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="music">
            <BatchMusicUpload />
          </TabsContent>
          <TabsContent value="sfx">
            <BatchSfxUpload />
          </TabsContent>
          <TabsContent value="covers">
            <StyleCoversManager />
          </TabsContent>
          <TabsContent value="emotion-covers">
            <EmotionCoversManager />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function BatchMusicUpload() {
  const [emotion, setEmotion] = useState<MusicEmotion | ''>('');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const items: FileUploadItem[] = Array.from(newFiles).map(f => ({
      file: f,
      id: crypto.randomUUID(),
      status: 'pending',
      customTitle: f.name.replace(/\.[^/.]+$/, ''),
    }));
    setFiles(prev => [...prev, ...items]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateTitle = (id: string, title: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, customTitle: title } : f));
  };

  const handleUploadAll = async () => {
    if (!emotion) {
      toast.error('Selecione a emoção antes de enviar.');
      return;
    }
    const pending = files.filter(f => f.status === 'pending' || f.status === 'error');
    if (pending.length === 0) {
      toast.error('Nenhum arquivo para enviar.');
      return;
    }

    setIsUploading(true);

    // Upload shared cover once
    let coverUrl: string | null = null;
    if (coverFile) {
      const coverExt = coverFile.name.split('.').pop();
      const coverPath = `covers/${Date.now()}-${crypto.randomUUID()}.${coverExt}`;
      const { error } = await supabase.storage.from('cover-images').upload(coverPath, coverFile);
      if (!error) {
        const { data } = supabase.storage.from('cover-images').getPublicUrl(coverPath);
        coverUrl = data.publicUrl;
      }
    }

    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

    for (const item of pending) {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'uploading' } : f));

      try {
        const ext = item.file.name.split('.').pop();
        const path = `music/${Date.now()}-${item.id}.${ext}`;
        const { error: storageErr } = await supabase.storage.from('audio-files').upload(path, item.file);
        if (storageErr) throw storageErr;

        const { data: urlData } = supabase.storage.from('audio-files').getPublicUrl(path);
        const duration = await getAudioDuration(item.file);

        const { error: dbErr } = await supabase.from('music_tracks').insert({
          title: item.customTitle?.trim() || item.file.name.replace(/\.[^/.]+$/, ''),
          emotion: emotion as MusicEmotion,
          duration_seconds: Math.round(duration),
          file_url: urlData.publicUrl,
          cover_image_url: coverUrl,
          tags: parsedTags,
        });
        if (dbErr) throw dbErr;

        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'success', message: 'Enviado!' } : f));
      } catch (err: any) {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error', message: err.message } : f));
      }
    }

    setIsUploading(false);
    const successCount = files.filter(f => f.status === 'success').length + pending.filter(f => true).length;
    toast.success(`Upload concluído!`);
  };

  const completedCount = files.filter(f => f.status === 'success').length;
  const progress = files.length > 0 ? (completedCount / files.length) * 100 : 0;

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Emoção (aplicada a todos) *</Label>
          <Select value={emotion} onValueChange={v => setEmotion(v as MusicEmotion)}>
            <SelectTrigger><SelectValue placeholder="Selecione a emoção" /></SelectTrigger>
            <SelectContent>
              {Object.entries(EMOTION_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tags (aplicadas a todos, separadas por vírgula)</Label>
          <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="ex: pop, energético, vlog" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Capa compartilhada (opcional)</Label>
        <Input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)}
          className="file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:text-primary-foreground" />
      </div>

      {/* Drop zone / file picker */}
      <div className="space-y-2">
        <Label>Arquivos de Áudio * (MP3, WAV — múltiplos)</Label>
        <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 cursor-pointer hover:bg-muted/50 transition-colors">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Clique ou arraste arquivos aqui</span>
          <input type="file" accept="audio/*" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
        </label>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{files.length} arquivo(s) selecionado(s)</Label>
            {!isUploading && (
              <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-xs text-muted-foreground">
                Limpar tudo
              </Button>
            )}
          </div>

          {isUploading && <Progress value={progress} className="h-2" />}

          <div className="max-h-80 overflow-y-auto space-y-2 rounded-lg border border-border p-2">
            {files.map(item => (
              <div key={item.id} className="flex items-center gap-3 rounded-md bg-muted/40 px-3 py-2">
                <FileAudio className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  value={item.customTitle || ''}
                  onChange={e => updateTitle(item.id, e.target.value)}
                  disabled={item.status === 'uploading' || item.status === 'success'}
                  className="h-8 text-sm flex-1"
                  placeholder="Título"
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {(item.file.size / 1024 / 1024).toFixed(1)} MB
                </span>
                {item.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                {item.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive shrink-0" />}
                {item.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />}
                {(item.status === 'pending' || item.status === 'error') && !isUploading && (
                  <button onClick={() => removeFile(item.id)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleUploadAll} disabled={isUploading || files.length === 0} className="gap-2">
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {isUploading ? 'Enviando...' : `Enviar ${files.filter(f => f.status === 'pending' || f.status === 'error').length} arquivo(s)`}
      </Button>
    </div>
  );
}

function BatchSfxUpload() {
  const [style, setStyle] = useState<SfxStyle | ''>('');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const addFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const items: FileUploadItem[] = Array.from(newFiles).map(f => ({
      file: f,
      id: crypto.randomUUID(),
      status: 'pending',
      customTitle: f.name.replace(/\.[^/.]+$/, ''),
    }));
    setFiles(prev => [...prev, ...items]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateTitle = (id: string, title: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, customTitle: title } : f));
  };

  const handleUploadAll = async () => {
    if (!style) {
      toast.error('Selecione o estilo antes de enviar.');
      return;
    }
    const pending = files.filter(f => f.status === 'pending' || f.status === 'error');
    if (pending.length === 0) {
      toast.error('Nenhum arquivo para enviar.');
      return;
    }

    setIsUploading(true);
    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

    for (const item of pending) {
      setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'uploading' } : f));

      try {
        const ext = item.file.name.split('.').pop();
        const path = `sfx/${Date.now()}-${item.id}.${ext}`;
        const { error: storageErr } = await supabase.storage.from('audio-files').upload(path, item.file);
        if (storageErr) throw storageErr;

        const { data: urlData } = supabase.storage.from('audio-files').getPublicUrl(path);
        const duration = await getAudioDuration(item.file);

        const { error: dbErr } = await supabase.from('sound_effects').insert({
          title: item.customTitle?.trim() || item.file.name.replace(/\.[^/.]+$/, ''),
          style: style as SfxStyle,
          duration_seconds: Math.round(duration),
          file_url: urlData.publicUrl,
          tags: parsedTags,
        });
        if (dbErr) throw dbErr;

        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'success', message: 'Enviado!' } : f));
      } catch (err: any) {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error', message: err.message } : f));
      }
    }

    setIsUploading(false);
    toast.success('Upload concluído!');
  };

  const completedCount = files.filter(f => f.status === 'success').length;
  const progress = files.length > 0 ? (completedCount / files.length) * 100 : 0;

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Estilo (aplicado a todos) *</Label>
          <Select value={style} onValueChange={v => setStyle(v as SfxStyle)}>
            <SelectTrigger><SelectValue placeholder="Selecione o estilo" /></SelectTrigger>
            <SelectContent>
              {Object.entries(STYLE_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Tags (aplicadas a todos, separadas por vírgula)</Label>
          <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="ex: transição, whoosh, curto" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Arquivos de Áudio * (MP3, WAV — múltiplos)</Label>
        <label className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 p-8 cursor-pointer hover:bg-muted/50 transition-colors">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Clique ou arraste arquivos aqui</span>
          <input type="file" accept="audio/*" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{files.length} arquivo(s) selecionado(s)</Label>
            {!isUploading && (
              <Button variant="ghost" size="sm" onClick={() => setFiles([])} className="text-xs text-muted-foreground">
                Limpar tudo
              </Button>
            )}
          </div>

          {isUploading && <Progress value={progress} className="h-2" />}

          <div className="max-h-80 overflow-y-auto space-y-2 rounded-lg border border-border p-2">
            {files.map(item => (
              <div key={item.id} className="flex items-center gap-3 rounded-md bg-muted/40 px-3 py-2">
                <FileAudio className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  value={item.customTitle || ''}
                  onChange={e => updateTitle(item.id, e.target.value)}
                  disabled={item.status === 'uploading' || item.status === 'success'}
                  className="h-8 text-sm flex-1"
                  placeholder="Título"
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {(item.file.size / 1024 / 1024).toFixed(1)} MB
                </span>
                {item.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />}
                {item.status === 'error' && <AlertCircle className="h-4 w-4 text-destructive shrink-0" />}
                {item.status === 'uploading' && <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />}
                {(item.status === 'pending' || item.status === 'error') && !isUploading && (
                  <button onClick={() => removeFile(item.id)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Button onClick={handleUploadAll} disabled={isUploading || files.length === 0} className="gap-2">
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {isUploading ? 'Enviando...' : `Enviar ${files.filter(f => f.status === 'pending' || f.status === 'error').length} arquivo(s)`}
      </Button>
    </div>
  );
}

function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(audio.src);
      resolve(audio.duration);
    });
    audio.addEventListener('error', () => resolve(0));
    audio.src = URL.createObjectURL(file);
  });
}
