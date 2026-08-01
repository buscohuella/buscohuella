-- FP-003 — Perfiles y modelo base de usuario
-- Aplicada en Supabase como migration version 20260801105227.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Usuario',
  public_alias text,
  avatar_path text,
  municipality text,
  bio text,
  is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint profiles_full_name_length
    check (char_length(full_name) between 1 and 120),

  constraint profiles_public_alias_format
    check (
      public_alias is null
      or public_alias ~ '^[a-z0-9][a-z0-9_-]{2,29}$'
    ),

  constraint profiles_avatar_path_length
    check (
      avatar_path is null
      or char_length(avatar_path) <= 500
    ),

  constraint profiles_municipality_length
    check (
      municipality is null
      or char_length(municipality) <= 120
    ),

  constraint profiles_bio_length
    check (
      bio is null
      or char_length(bio) <= 500
    )
);

create unique index profiles_public_alias_unique_idx
  on public.profiles (lower(public_alias))
  where public_alias is not null;

alter table public.profiles enable row level security;

create policy profiles_select_own
  on public.profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

create policy profiles_insert_own
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (
    id,
    full_name
  )
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'Usuario'
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created_create_profile
after insert on auth.users
for each row
execute function public.handle_new_user_profile();

insert into public.profiles (
  id,
  full_name
)
select
  users.id,
  coalesce(
    nullif(trim(users.raw_user_meta_data ->> 'full_name'), ''),
    nullif(split_part(coalesce(users.email, ''), '@', 1), ''),
    'Usuario'
  )
from auth.users as users
on conflict (id) do nothing;

create view public.public_profiles as
select
  public_alias,
  avatar_path,
  municipality,
  bio,
  created_at
from public.profiles
where is_public = true
  and public_alias is not null;

grant select on public.public_profiles to anon, authenticated;
