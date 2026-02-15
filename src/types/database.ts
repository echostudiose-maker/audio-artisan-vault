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
  | 'corporativo'
  
  | 'confianca'
  | 'esperanca'
  
  | 'inveja'
  | 'mix'
  | 'superacao'
  | 'vibes'
  | 'bonus'
  | 'cortes';

export type SfxStyle = 
  | 'whooshes' 
  | 'impacts' 
  | 'clicks' 
  | 'glitches'
   
  | 'natureza' 
   
  | 'explosoes'
  | 'cinematograficos' 
  | 'tecnologicos'
  | 'agua'
  | 'ambience'
  | 'ambient_sounds'
  | 'animais'
  | 'atmosfera'
  | 'birds'
  | 'camera'
  | 'carros'
  | 'city_sounds'
  | 'comicos'
  | 'dinheiro'
  | 'earth_destruction'
  | 'fastcuts'
  | 'fogo'
  | 'foleys'
  | 'gear'
  | 'guns'
  | 'hits'
  | 'human'
  | 'intuicao'
  | 'metro'
  | 'moments'
  | 'movimento'
  | 'objects_of_desire'
  | 'organico'
  | 'radio_voice'
  | 'riser'
  | 'scratch'
  | 'slow_motion'
  | 'special'
  | 'speedramping'
  | 'swoosh'
  | 'torque'
  | 'transition_sounds'
  | 'trem'
  
  | 'wind_lightning'
  | 'writing';

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
  
  confianca: 'Confiança',
  esperanca: 'Esperança',
  
  inveja: 'Inveja',
  mix: 'Mix',
  superacao: 'Superação',
  vibes: 'Vibes',
  bonus: 'Bônus',
  cortes: 'Cortes',
};

// Style labels for display
export const STYLE_LABELS: Record<SfxStyle, string> = {
  whooshes: 'Whooshes',
  impacts: 'Impacts',
  clicks: 'Click',
  glitches: 'Glitch',
  
  natureza: 'Natureza',
  
  explosoes: 'Explosões',
  cinematograficos: 'Cinematográficos',
  tecnologicos: 'Tecnológicos',
  agua: 'Água',
  ambience: 'Ambience',
  ambient_sounds: 'Ambient Sounds',
  animais: 'Animais',
  atmosfera: 'Atmosfera',
  birds: 'Birds',
  camera: 'Camera',
  carros: 'Carros',
  city_sounds: 'City Sounds',
  comicos: 'Cômicos',
  dinheiro: 'Dinheiro',
  earth_destruction: 'Earth & Destruction',
  fastcuts: 'FastCuts',
  fogo: 'Fogo',
  foleys: "Foley's",
  gear: 'Gear',
  guns: 'Guns',
  hits: 'Hits',
  human: 'Human',
  intuicao: 'Intuição',
  metro: 'Metrô',
  moments: 'Moments',
  movimento: 'Movimento',
  objects_of_desire: 'Objetcs of Desire',
  organico: 'Orgânico',
  radio_voice: 'Radio Voice',
  riser: 'Riser',
  scratch: 'Scratch',
  slow_motion: 'Slow Motion',
  special: 'Special',
  speedramping: 'Speedramping',
  swoosh: 'Swoosh',
  torque: 'Torque',
  transition_sounds: 'Transition Sounds',
  trem: 'Trem',
  
  wind_lightning: 'Wind & Lightninig',
  writing: 'Writing',
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
  
  confianca: 'bg-emerald-500',
  esperanca: 'bg-sky-400',
  
  inveja: 'bg-green-600',
  mix: 'bg-fuchsia-500',
  superacao: 'bg-orange-600',
  vibes: 'bg-violet-400',
  bonus: 'bg-amber-400',
  cortes: 'bg-red-600',
};

export const STYLE_COLORS: Record<SfxStyle, string> = {
  whooshes: 'bg-cyan-500',
  impacts: 'bg-red-500',
  clicks: 'bg-green-500',
  glitches: 'bg-pink-500',
  
  natureza: 'bg-emerald-500',
  
  explosoes: 'bg-orange-500',
  cinematograficos: 'bg-indigo-500',
  tecnologicos: 'bg-violet-500',
  agua: 'bg-sky-400',
  ambience: 'bg-slate-500',
  ambient_sounds: 'bg-slate-400',
  animais: 'bg-amber-600',
  atmosfera: 'bg-purple-400',
  birds: 'bg-lime-500',
  camera: 'bg-gray-500',
  carros: 'bg-red-600',
  city_sounds: 'bg-zinc-500',
  comicos: 'bg-yellow-500',
  dinheiro: 'bg-emerald-600',
  earth_destruction: 'bg-stone-600',
  fastcuts: 'bg-rose-500',
  fogo: 'bg-orange-600',
  foleys: 'bg-amber-500',
  gear: 'bg-neutral-500',
  guns: 'bg-red-700',
  hits: 'bg-rose-600',
  human: 'bg-pink-400',
  intuicao: 'bg-violet-400',
  metro: 'bg-blue-600',
  moments: 'bg-fuchsia-400',
  movimento: 'bg-cyan-600',
  objects_of_desire: 'bg-fuchsia-500',
  organico: 'bg-green-600',
  radio_voice: 'bg-amber-400',
  riser: 'bg-indigo-400',
  scratch: 'bg-yellow-600',
  slow_motion: 'bg-sky-600',
  special: 'bg-purple-600',
  speedramping: 'bg-rose-400',
  swoosh: 'bg-teal-400',
  torque: 'bg-zinc-600',
  transition_sounds: 'bg-purple-500',
  trem: 'bg-stone-500',
  
  wind_lightning: 'bg-sky-500',
  writing: 'bg-neutral-400',
};
