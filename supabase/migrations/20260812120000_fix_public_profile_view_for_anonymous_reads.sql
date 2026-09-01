-- Public profiles must be readable anonymously without exposing profiles directly.
-- The view only contains fields intentionally selected for public presentation.
alter view public.public_profiles set (security_invoker = false);

grant select on table public.public_profiles to anon, authenticated;
revoke all on table public.profiles from anon;
