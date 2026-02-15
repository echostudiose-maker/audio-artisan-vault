import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ListMusic, Plus, Music, MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Playlist } from '@/types/database';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export default function PlaylistsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching playlists:', error);
    } else {
      setPlaylists(data as Playlist[]);
    }
    
    setIsLoading(false);
  };

  const handleCreatePlaylist = async () => {
    if (!user || !newPlaylistName.trim()) return;
    
    setIsCreating(true);
    
    const { error } = await supabase.from('playlists').insert({
      user_id: user.id,
      name: newPlaylistName.trim(),
      description: newPlaylistDescription.trim() || null,
    });

    if (error) {
      toast.error('Erro ao criar playlist');
      console.error('Error creating playlist:', error);
    } else {
      toast.success('Playlist criada com sucesso!');
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      setIsDialogOpen(false);
      fetchPlaylists();
    }
    
    setIsCreating(false);
  };

  const handleDeletePlaylist = async (id: string) => {
    const { error } = await supabase.from('playlists').delete().eq('id', id);
    
    if (error) {
      toast.error('Erro ao excluir playlist');
    } else {
      toast.success('Playlist excluída');
      setPlaylists(playlists.filter((p) => p.id !== id));
    }
  };

  if (authLoading || !user) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <ListMusic className="h-6 w-6 text-blue-500" />
              </div>
              <h1 className="text-3xl font-bold">Minhas Playlists</h1>
            </div>
            <p className="text-muted-foreground">
              Organize seus arquivos de áudio favoritos em playlists personalizadas
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4" />
                Nova Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Playlist</DialogTitle>
                <DialogDescription>
                  Dê um nome e descrição para sua nova playlist
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    placeholder="Minha playlist incrível"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Uma coleção de sons para..."
                    value={newPlaylistDescription}
                    onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim() || isCreating}
                  className="w-full gradient-primary hover:opacity-90"
                >
                  {isCreating ? 'Criando...' : 'Criar Playlist'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <motion.div variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.15 }}>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ListMusic className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma playlist ainda</h3>
            <p className="text-muted-foreground mb-4">
              Crie sua primeira playlist para organizar seus arquivos de áudio
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Playlist
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                className="group relative rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Music className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{playlist.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {playlist.description || 'Sem descrição'}
                      </p>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeletePlaylist(playlist.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Criada em {new Date(playlist.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
