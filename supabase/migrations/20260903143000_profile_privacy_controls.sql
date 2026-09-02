alter table public.profiles
  add column if not exists public_show_avatar boolean not null default true,
  add column if not exists public_show_municipality boolean not null default true;

create or replace view public.public_profiles as
select
  public_alias,
  case when public_show_avatar then avatar_path else null end as avatar_path,
  case when public_show_municipality then municipality else null end as municipality,
  null::text as bio,
  created_at
from public.profiles
where is_public = true
  and public_alias is not null;

grant select on public.public_profiles to anon, authenticated;
