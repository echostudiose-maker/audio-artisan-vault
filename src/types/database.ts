// Custom types for the audio hub application

export type MusicEmotion = 
  | 'alegre' 
  | 'triste' 
  | 'motivacional' 
  | 'suspense' 
  | 'curiosidade'
  | 'tensao' 
  | 'epico' 
  | 'cinematografico' 
  | 'energetico' 
  | 'calmo'
  | 'reflexivo' 
  | 'dramatico' 
  | 'moderno' 
  | 'minimalista' 
  | 'corporativo';

export type SfxStyle = 
  | 'whooshes' 
  | 'transicoes' 
  | 'impacts' 
  | 'clicks' 
  | 'glitches'
  | 'interface' 
  | 'natureza' 
  | 'ambiente' 
  | 'explosoes'
  | 'cinematograficos' 
  | 'tecnologicos';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';

export type AppRole = 'admin' | 'moderator' | 'user';

export interface MusicTrack {
  id: string;
  title: string;
  emotion: MusicEmotion;
  duration_seconds: number;
  file_url: string;
  cover_image_url: string | null;
  tags: string[];
  download_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SoundEffect {
  id: string;
  title: string;
  style: SfxStyle;
  duration_seconds: number;
  file_url: string;
  icon_url: string | null;
  tags: string[];
  download_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  plan_type: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  track_id: string | null;
  sfx_id: string | null;
  created_at: string;
}

export interface Playlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaylistItem {
  id: string;
  playlist_id: string;
  track_id: string | null;
  sfx_id: string | null;
  position: number;
  created_at: string;
}

export interface Download {
  id: string;
  user_id: string;
  track_id: string | null;
  sfx_id: string | null;
  downloaded_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

// Emotion labels for display
export const EMOTION_LABELS: Record<MusicEmotion, string> = {
  alegre: 'Alegre',
  triste: 'Triste',
  motivacional: 'Motivacional',
  suspense: 'Suspense',
  curiosidade: 'Curiosidade',
  tensao: 'Tensão',
  epico: 'Épico',
  cinematografico: 'Cinematográfico',
  energetico: 'Energético',
  calmo: 'Calmo',
  reflexivo: 'Reflexivo',
  dramatico: 'Dramático',
  moderno: 'Moderno',
  minimalista: 'Minimalista',
  corporativo: 'Corporativo',
};

// Style labels for display
export const STYLE_LABELS: Record<SfxStyle, string> = {
  whooshes: 'Whooshes',
  transicoes: 'Transições',
  impacts: 'Impacts',
  clicks: 'Clicks',
  glitches: 'Glitches',
  interface: 'Interface',
  natureza: 'Natureza',
  ambiente: 'Ambiente',
  explosoes: 'Explosões',
  cinematograficos: 'Cinematográficos',
  tecnologicos: 'Tecnológicos',
};

// Emotion icons/colors
export const EMOTION_COLORS: Record<MusicEmotion, string> = {
  alegre: 'bg-yellow-500',
  triste: 'bg-blue-500',
  motivacional: 'bg-orange-500',
  suspense: 'bg-purple-500',
  curiosidade: 'bg-cyan-500',
  tensao: 'bg-red-500',
  epico: 'bg-amber-500',
  cinematografico: 'bg-indigo-500',
  energetico: 'bg-pink-500',
  calmo: 'bg-green-500',
  reflexivo: 'bg-teal-500',
  dramatico: 'bg-rose-500',
  moderno: 'bg-violet-500',
  minimalista: 'bg-slate-500',
  corporativo: 'bg-sky-500',
};

export const STYLE_COLORS: Record<SfxStyle, string> = {
  whooshes: 'bg-cyan-500',
  transicoes: 'bg-purple-500',
  impacts: 'bg-red-500',
  clicks: 'bg-green-500',
  glitches: 'bg-pink-500',
  interface: 'bg-blue-500',
  natureza: 'bg-emerald-500',
  ambiente: 'bg-teal-500',
  explosoes: 'bg-orange-500',
  cinematograficos: 'bg-indigo-500',
  tecnologicos: 'bg-violet-500',
};
