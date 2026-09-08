-- R1.1 rollback compensatorio (preparado; no aplicar automáticamente).
-- Restaura la proyección versionada anterior conocida y sus grants mínimos.

begin;

create or replace view public.public_profiles
with (security_invoker = false)
as
select
  public_alias,
  case when public_show_avatar then avatar_path else null::text end as avatar_path,
  case when public_show_municipality then municipality else null::text end as municipality,
  null::text as bio,
  created_at
from public.profiles
where is_public = true
  and public_alias is not null;

alter view public.public_profiles reset (security_barrier);
alter view public.public_profiles set (security_invoker = false);

revoke all on table public.public_profiles from public, anon, authenticated;
grant select on table public.public_profiles to anon, authenticated;
revoke all on table public.profiles from public, anon;

commit;
