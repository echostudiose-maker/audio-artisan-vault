-- Update handle_new_user to also activate pending Hotmart purchases
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_pending RECORD;
BEGIN
  -- Always create the profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  -- Check for a pending Hotmart purchase for this email
  SELECT * INTO v_pending
  FROM public.pending_hotmart_purchases
  WHERE lower(buyer_email) = lower(NEW.email)
    AND processed = false
  ORDER BY created_at DESC
  LIMIT 1;

  IF FOUND THEN
    -- Create active subscription valid for 1 year
    INSERT INTO public.subscriptions (
      user_id,
      status,
      plan_type,
      current_period_start,
      current_period_end,
      stripe_subscription_id
    ) VALUES (
      NEW.id,
      'active',
      'annual',
      now(),
      now() + interval '1 year',
      v_pending.transaction_code
    );

    -- Mark the pending purchase as processed
    UPDATE public.pending_hotmart_purchases
    SET processed = true,
        processed_at = now()
    WHERE id = v_pending.id;
  END IF;

  RETURN NEW;
END;
$function$;

-- Ensure the trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();