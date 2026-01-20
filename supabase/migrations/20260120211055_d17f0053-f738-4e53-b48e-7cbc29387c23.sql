-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for music emotions
CREATE TYPE public.music_emotion AS ENUM (
  'alegre', 'triste', 'motivacional', 'suspense', 'curiosidade', 
  'tensao', 'epico', 'cinematografico', 'energetico', 'calmo', 
  'reflexivo', 'dramatico', 'moderno', 'minimalista', 'corporativo'
);

-- Create enum for sound effect styles
CREATE TYPE public.sfx_style AS ENUM (
  'whooshes', 'transicoes', 'impacts', 'clicks', 'glitches', 
  'interface', 'natureza', 'ambiente', 'explosoes', 
  'cinematograficos', 'tecnologicos'
);

-- Create enum for subscription status
CREATE TYPE public.subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending');

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- User roles table (security best practice)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Music tracks table
CREATE TABLE public.music_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  emotion public.music_emotion NOT NULL,
  duration_seconds INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Sound effects table
CREATE TABLE public.sound_effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  style public.sfx_style NOT NULL,
  duration_seconds INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  icon_url TEXT,
  tags TEXT[] DEFAULT '{}',
  download_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- User subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status public.subscription_status NOT NULL DEFAULT 'pending',
  plan_type TEXT NOT NULL DEFAULT 'monthly',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- User favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES public.music_tracks(id) ON DELETE CASCADE,
  sfx_id UUID REFERENCES public.sound_effects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT check_favorite_type CHECK (
    (track_id IS NOT NULL AND sfx_id IS NULL) OR 
    (track_id IS NULL AND sfx_id IS NOT NULL)
  )
);

-- User playlists table
CREATE TABLE public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Playlist items table
CREATE TABLE public.playlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES public.music_tracks(id) ON DELETE CASCADE,
  sfx_id UUID REFERENCES public.sound_effects(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT check_playlist_item_type CHECK (
    (track_id IS NOT NULL AND sfx_id IS NULL) OR 
    (track_id IS NULL AND sfx_id IS NOT NULL)
  )
);

-- User downloads history table
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES public.music_tracks(id) ON DELETE CASCADE,
  sfx_id UUID REFERENCES public.sound_effects(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT check_download_type CHECK (
    (track_id IS NOT NULL AND sfx_id IS NULL) OR 
    (track_id IS NULL AND sfx_id IS NOT NULL)
  )
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sound_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.has_active_subscription(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.subscriptions
    WHERE user_id = _user_id
      AND status = 'active'
      AND (current_period_end IS NULL OR current_period_end > now())
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles (only admins can manage roles)
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for music_tracks (public read, admin write)
CREATE POLICY "Anyone can view active music tracks" ON public.music_tracks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage music tracks" ON public.music_tracks
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for sound_effects (public read, admin write)
CREATE POLICY "Anyone can view active sound effects" ON public.sound_effects
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage sound effects" ON public.sound_effects
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for favorites
CREATE POLICY "Users can manage their own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for playlists
CREATE POLICY "Users can view their own playlists" ON public.playlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public playlists" ON public.playlists
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can manage their own playlists" ON public.playlists
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for playlist_items
CREATE POLICY "Users can view items from their playlists" ON public.playlist_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.playlists 
      WHERE id = playlist_id AND (user_id = auth.uid() OR is_public = true)
    )
  );

CREATE POLICY "Users can manage items in their playlists" ON public.playlist_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.playlists 
      WHERE id = playlist_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for downloads
CREATE POLICY "Users can view their own downloads" ON public.downloads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Subscribers can create downloads" ON public.downloads
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    (public.has_active_subscription(auth.uid()) OR public.has_role(auth.uid(), 'admin'))
  );

CREATE POLICY "Admins can view all downloads" ON public.downloads
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_music_tracks_updated_at
  BEFORE UPDATE ON public.music_tracks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sound_effects_updated_at
  BEFORE UPDATE ON public.sound_effects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
  BEFORE UPDATE ON public.playlists
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets for audio files and images
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-files', 'audio-files', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('cover-images', 'cover-images', true);

-- Storage policies for audio-files bucket (public read, admin write)
CREATE POLICY "Anyone can view audio files" ON storage.objects
  FOR SELECT USING (bucket_id = 'audio-files');

CREATE POLICY "Admins can upload audio files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'audio-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update audio files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'audio-files' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete audio files" ON storage.objects
  FOR DELETE USING (bucket_id = 'audio-files' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for cover-images bucket (public read, admin write)
CREATE POLICY "Anyone can view cover images" ON storage.objects
  FOR SELECT USING (bucket_id = 'cover-images');

CREATE POLICY "Admins can upload cover images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cover-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update cover images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cover-images' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete cover images" ON storage.objects
  FOR DELETE USING (bucket_id = 'cover-images' AND public.has_role(auth.uid(), 'admin'));