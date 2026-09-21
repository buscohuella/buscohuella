-- P0-SEC-001  Replace the security-definer public_profiles view with a
-- physical, minimal public projection synchronized internally from profiles.
--
-- Security goals:
-- - public.profiles remains private and protected by ownership RLS.
-- - public readers never receive the auth user UUID as a dedicated column.
-- - bio is not part of the public projection.
-- - avatar/municipality privacy flags are materialized into the projection.
-- - clients cannot INSERT/UPDATE/DELETE projection rows.
-- - public avatar reads depend on the public projection, not on profiles.

begin;

-- The previous migration intentionally recreated this object as a view.
-- Replace it atomically with a physical projection.
drop view if exists public.public_profiles;

create table public.public_profiles (
  public_alias text primary key,
  avatar_path text,
  municipality text,
  created_at timestamptz not null,

  constraint public_profiles_alias_format
    check (
      public_alias ~ '^[a-z0-9][a-z0-9_-]{2,29}$'
    ),

  constraint public_profiles_avatar_path_length
    check (
      avatar_path is null
      or char_length(avatar_path) <= 500
    ),

  constraint public_profiles_municipality_length
    check (
      municipality is null
      or char_length(municipality) <= 120
    )
);

-- Preserve the case-insensitive alias invariant explicitly.
create unique index public_profiles_public_alias_unique_idx
  on public.public_profiles (lower(public_alias));

alter table public.public_profiles enable row level security;

revoke all on table public.public_profiles
  from public, anon, authenticated;

grant select on table public.public_profiles
  to anon, authenticated;

create policy public_profiles_select_public
on public.public_profiles
for select
to anon, authenticated
using (true);

-- Internal-only synchronization primitive.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.sync_public_profile_projection()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog
as $function$
begin
  if tg_op = 'DELETE' then
    if old.public_alias is not null then
      delete from public.public_profiles
      where public_alias = old.public_alias;
    end if;

    return old;
  end if;

  if tg_op = 'UPDATE' then
    if old.public_alias is not null then
      delete from public.public_profiles
      where public_alias = old.public_alias;
    end if;
  end if;

  if new.is_public = true
     and new.public_alias is not null then
    insert into public.public_profiles (
      public_alias,
      avatar_path,
      municipality,
      created_at
    )
    values (
      new.public_alias,
      case
        when new.public_show_avatar
          and new.avatar_path is not null
          and array_length(storage.foldername(new.avatar_path), 1) = 1
          and (storage.foldername(new.avatar_path))[1] = new.id::text
        then new.avatar_path
        else null
      end,
      case
        when new.public_show_municipality then new.municipality
        else null
      end,
      new.created_at
    )
    on conflict (public_alias) do update
    set
      avatar_path = excluded.avatar_path,
      municipality = excluded.municipality,
      created_at = excluded.created_at;
  end if;

  return new;
end;
$function$;

revoke all on function private.sync_public_profile_projection()
  from public, anon, authenticated;

drop trigger if exists profiles_sync_public_projection
  on public.profiles;

create trigger profiles_sync_public_projection
after insert
or update of
  public_alias,
  avatar_path,
  municipality,
  created_at,
  is_public,
  public_show_avatar,
  public_show_municipality
or delete
on public.profiles
for each row
execute function private.sync_public_profile_projection();

-- Initial projection from the current canonical profiles table.
insert into public.public_profiles (
  public_alias,
  avatar_path,
  municipality,
  created_at
)
select
  p.public_alias,
  case
    when p.public_show_avatar
      and p.avatar_path is not null
      and array_length(storage.foldername(p.avatar_path), 1) = 1
      and (storage.foldername(p.avatar_path))[1] = p.id::text
    then p.avatar_path
    else null
  end,
  case
    when p.public_show_municipality then p.municipality
    else null
  end,
  p.created_at
from public.profiles as p
where p.is_public = true
  and p.public_alias is not null
on conflict (public_alias) do update
set
  avatar_path = excluded.avatar_path,
  municipality = excluded.municipality,
  created_at = excluded.created_at;

-- Public Storage access must now depend only on the public projection.
drop policy if exists profile_avatars_public_select
  on storage.objects;

create policy profile_avatars_public_select
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'profile-avatars'
  and array_length(storage.foldername(name), 1) = 1
  and exists (
    select 1
    from public.public_profiles as pp
    where pp.avatar_path = objects.name
  )
);

commit;
