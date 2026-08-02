-- Seguridad — endurecimiento de perfiles públicos
-- Corrige avisos detectados por Supabase Advisors.

-- La vista pública debe respetar los permisos del usuario que consulta.
create or replace view public.public_profiles
with (security_invoker = true)
as
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

-- La función se utiliza únicamente como trigger interno.
-- Se revoca su ejecución directa por API/RPC.
revoke execute on function public.handle_new_user_profile() from public;
revoke execute on function public.handle_new_user_profile() from anon;
revoke execute on function public.handle_new_user_profile() from authenticated;
