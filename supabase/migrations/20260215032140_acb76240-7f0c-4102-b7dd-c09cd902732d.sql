
-- Table to store cover images for SFX styles
CREATE TABLE public.sfx_style_covers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  style sfx_style NOT NULL UNIQUE,
  cover_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sfx_style_covers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view style covers"
  ON public.sfx_style_covers FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage style covers"
  ON public.sfx_style_covers FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_sfx_style_covers_updated_at
  BEFORE UPDATE ON public.sfx_style_covers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
