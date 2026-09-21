-- Harden notification-preference RPC privileges.
-- Supabase hosted projects may grant EXECUTE explicitly to API roles by default,
-- so revoking only from PUBLIC is not sufficient.

-- Internal trigger function: must not be callable by client API roles.
revoke execute on function public.filter_notification_by_preferences()
from public, anon, authenticated;

-- User-facing preferences RPC: authenticated users only.
revoke execute on function public.get_my_notification_preferences()
from public, anon, authenticated;

grant execute on function public.get_my_notification_preferences()
to authenticated;

-- User-facing preferences mutation RPC: authenticated users only.
revoke execute on function public.update_my_notification_preferences(boolean, boolean)
from public, anon, authenticated;

grant execute on function public.update_my_notification_preferences(boolean, boolean)
to authenticated;
