
-- Add new sfx_style enum values
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'agua';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'ambience';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'ambient_sounds';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'animais';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'atmosfera';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'birds';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'camera';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'carros';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'city_sounds';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'comicos';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'dinheiro';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'earth_destruction';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'fastcuts';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'fogo';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'foleys';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'gear';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'guns';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'hits';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'human';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'intuicao';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'metro';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'moments';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'movimento';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'objects_of_desire';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'organico';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'radio_voice';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'riser';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'scratch';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'slow_motion';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'special';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'speedramping';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'swoosh';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'torque';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'transition_sounds';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'trem';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'whizz';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'wind_lightning';
ALTER TYPE sfx_style ADD VALUE IF NOT EXISTS 'writing';

-- Remove 'transicoes' by recreating the enum (no rows use it)
-- Step 1: Create new enum without transicoes
CREATE TYPE sfx_style_new AS ENUM (
  'whooshes', 'impacts', 'clicks', 'glitches', 'interface', 'natureza', 'ambiente', 'explosoes', 'cinematograficos', 'tecnologicos',
  'agua', 'ambience', 'ambient_sounds', 'animais', 'atmosfera', 'birds', 'camera', 'carros', 'city_sounds', 'comicos',
  'dinheiro', 'earth_destruction', 'fastcuts', 'fogo', 'foleys', 'gear', 'guns', 'hits', 'human', 'intuicao',
  'metro', 'moments', 'movimento', 'objects_of_desire', 'organico', 'radio_voice', 'riser', 'scratch', 'slow_motion',
  'special', 'speedramping', 'swoosh', 'torque', 'transition_sounds', 'trem', 'whizz', 'wind_lightning', 'writing'
);

-- Step 2: Alter column to use new type
ALTER TABLE public.sound_effects ALTER COLUMN style TYPE sfx_style_new USING style::text::sfx_style_new;

-- Step 3: Drop old type and rename
DROP TYPE sfx_style;
ALTER TYPE sfx_style_new RENAME TO sfx_style;
