
-- 1. Fix favorites: drop ALL policy and recreate with WITH CHECK
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;

CREATE POLICY "Users can view their own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);

-- 2. Fix playlists: drop ALL policy and recreate with WITH CHECK
DROP POLICY IF EXISTS "Users can manage their own playlists" ON public.playlists;

CREATE POLICY "Users can insert their own playlists"
ON public.playlists FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own playlists"
ON public.playlists FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own playlists"
ON public.playlists FOR DELETE
USING (auth.uid() = user_id);

-- 3. Fix playlist_items: drop ALL policy and recreate with WITH CHECK
DROP POLICY IF EXISTS "Users can manage items in their playlists" ON public.playlist_items;

CREATE POLICY "Users can insert items in their playlists"
ON public.playlist_items FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM playlists
  WHERE playlists.id = playlist_items.playlist_id
    AND playlists.user_id = auth.uid()
));

CREATE POLICY "Users can update items in their playlists"
ON public.playlist_items FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM playlists
  WHERE playlists.id = playlist_items.playlist_id
    AND playlists.user_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM playlists
  WHERE playlists.id = playlist_items.playlist_id
    AND playlists.user_id = auth.uid()
));

CREATE POLICY "Users can delete items in their playlists"
ON public.playlist_items FOR DELETE
USING (EXISTS (
  SELECT 1 FROM playlists
  WHERE playlists.id = playlist_items.playlist_id
    AND playlists.user_id = auth.uid()
));

-- 4. Fix user_roles: restrict INSERT to admins only
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- 5. Add profiles DELETE policy
CREATE POLICY "Users can delete their own profile"
ON public.profiles FOR DELETE
USING (auth.uid() = user_id);

-- 6. Add admin DELETE policy for downloads
CREATE POLICY "Admins can delete downloads"
ON public.downloads FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- 7. Add admin UPDATE policy for downloads
CREATE POLICY "Admins can update downloads"
ON public.downloads FOR UPDATE
USING (has_role(auth.uid(), 'admin'));
