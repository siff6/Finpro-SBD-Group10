create extension if not exists "pgcrypto";

create table if not exists public.users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  email text not null unique,
  password text,
  created_at timestamptz not null default now()
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(user_id) on delete cascade,
  company_name text not null,
  position text not null,
  status text not null default 'Applied'
    check (status in ('Applied', 'Rejected', 'Interviewed', 'Accepted', 'Offer')),
  application_date date not null default current_date,
  salary integer not null default 0,
  next_action text[] not null default '{}',
  website text not null default '',
  contact text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.job_applications enable row level security;

create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own job applications"
  on public.job_applications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists job_applications_user_id_idx
  on public.job_applications(user_id);

create index if not exists job_applications_status_idx
  on public.job_applications(status);

create index if not exists job_applications_application_date_idx
  on public.job_applications(application_date);
