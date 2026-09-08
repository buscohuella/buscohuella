-- R1.1-A — public_profiles: proyección mínima y grants mínimos.
-- Variante A: security definer controlado. No modifica migraciones históricas.

begin;

create or replace view public.public_profiles
with (security_barrier = true, security_invoker = false)
as
select
  p.public_alias,
  case when p.public_show_avatar then p.avatar_path else null::text end as avatar_path,
  case when p.public_show_municipality then p.municipality else null::text end as municipality,
  null::text as bio,
  p.created_at
from public.profiles as p
where p.is_public = true
  and p.public_alias is not null;

revoke all on table public.public_profiles from public, anon, authenticated;
grant select on table public.public_profiles to anon, authenticated;

revoke all on table public.profiles from public, anon;

commit;
