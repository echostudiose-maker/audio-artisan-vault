-- Table to store Hotmart purchases when user hasn't registered yet
-- When user registers with the same email, their subscription will be activated
create table if not exists public.pending_hotmart_purchases (
  id uuid default gen_random_uuid() primary key,
  buyer_email text not null unique,
  event text not null,
  transaction_code text,
  payload jsonb,
  processed boolean default false,
  created_at timestamp with time zone default now(),
  processed_at timestamp with time zone
);

-- RLS: only service role can access this table
alter table public.pending_hotmart_purchases enable row level security;

-- Function to check and activate subscription for new users
-- This runs after a new profile is created
create or replace function public.check_pending_purchase()
returns trigger as $$
declare
  pending record;
  one_year_later timestamp with time zone;
begin
  -- Look for pending purchase with matching email
  select * into pending
  from public.pending_hotmart_purchases
  where buyer_email = (select email from auth.users where id = new.user_id)
    and processed = false
  limit 1;

  if found then
    one_year_later := now() + interval '1 year';

    -- Create subscription
    insert into public.subscriptions (user_id, status, plan_type, current_period_start, current_period_end, stripe_customer_id, stripe_subscription_id)
    values (new.user_id, 'active', 'lifetime', now(), one_year_later, pending.buyer_email, pending.transaction_code)
    on conflict (user_id) do update set
      status = 'active',
      plan_type = 'lifetime',
      current_period_start = now(),
      current_period_end = one_year_later,
      stripe_customer_id = pending.buyer_email,
      stripe_subscription_id = pending.transaction_code,
      updated_at = now();

    -- Mark as processed
    update public.pending_hotmart_purchases
    set processed = true, processed_at = now()
    where id = pending.id;
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger: when a new profile is created, check for pending purchases
drop trigger if exists on_profile_created_check_purchase on public.profiles;
create trigger on_profile_created_check_purchase
  after insert on public.profiles
  for each row
  execute function public.check_pending_purchase();
