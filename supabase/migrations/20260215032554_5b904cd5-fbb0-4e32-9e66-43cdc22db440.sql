
CREATE TABLE public.music_emotion_covers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  emotion music_emotion NOT NULL UNIQUE,
  cover_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.music_emotion_covers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view emotion covers"
  ON public.music_emotion_covers FOR SELECT USING (true);

CREATE POLICY "Admins can manage emotion covers"
  ON public.music_emotion_covers FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_music_emotion_covers_updated_at
  BEFORE UPDATE ON public.music_emotion_covers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
