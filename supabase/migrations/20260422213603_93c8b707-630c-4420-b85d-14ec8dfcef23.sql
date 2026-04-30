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

alter table public.pending_hotmart_purchases enable row level security;