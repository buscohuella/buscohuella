create table if not exists public.notification_preferences (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  in_app_sightings boolean not null default true,
  in_app_report_updates boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_notification_preferences_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists notification_preferences_updated_at on public.notification_preferences;
create trigger notification_preferences_updated_at
before update on public.notification_preferences
for each row execute function public.set_notification_preferences_updated_at();

alter table public.notification_preferences enable row level security;
revoke all on table public.notification_preferences from anon, authenticated;

create or replace function public.get_my_notification_preferences()
returns table (
  in_app_sightings boolean,
  in_app_report_updates boolean
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    coalesce(p.in_app_sightings, true),
    coalesce(p.in_app_report_updates, true)
  from (select auth.uid() as user_id) current_user_id
  left join public.notification_preferences p
    on p.user_id = current_user_id.user_id;
$$;

revoke all on function public.get_my_notification_preferences() from public;
grant execute on function public.get_my_notification_preferences() to authenticated;

create or replace function public.update_my_notification_preferences(
  target_in_app_sightings boolean,
  target_in_app_report_updates boolean
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    return false;
  end if;

  insert into public.notification_preferences (
    user_id, in_app_sightings, in_app_report_updates
  ) values (
    auth.uid(), target_in_app_sightings, target_in_app_report_updates
  )
  on conflict (user_id) do update set
    in_app_sightings = excluded.in_app_sightings,
    in_app_report_updates = excluded.in_app_report_updates;

  return true;
end;
$$;

revoke all on function public.update_my_notification_preferences(boolean, boolean) from public;
grant execute on function public.update_my_notification_preferences(boolean, boolean) to authenticated;

create or replace function public.filter_notification_by_preferences()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  enabled boolean;
begin
  if new.kind in ('NEW_SIGHTING', 'SIGHTING_REVIEWED') then
    select coalesce(in_app_sightings, true)
    into enabled
    from public.notification_preferences
    where user_id = new.recipient_id;
  elsif new.kind in (
    'REPORT_PAUSED', 'REPORT_REACTIVATED', 'REPORT_RESOLVED',
    'REPORT_CLOSED', 'REPORT_ARCHIVED'
  ) then
    select coalesce(in_app_report_updates, true)
    into enabled
    from public.notification_preferences
    where user_id = new.recipient_id;
  else
    enabled := true;
  end if;

  if coalesce(enabled, true) then
    return new;
  end if;

  return null;
end;
$$;

revoke all on function public.filter_notification_by_preferences() from public;

drop trigger if exists notifications_apply_preferences on public.notifications;
create trigger notifications_apply_preferences
before insert on public.notifications
for each row execute function public.filter_notification_by_preferences();
