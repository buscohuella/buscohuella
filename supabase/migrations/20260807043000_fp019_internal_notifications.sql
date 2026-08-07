create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in (
    'NEW_SIGHTING',
    'SIGHTING_REVIEWED',
    'REPORT_PAUSED',
    'REPORT_REACTIVATED',
    'REPORT_RESOLVED',
    'REPORT_CLOSED',
    'REPORT_ARCHIVED'
  )),
  report_id uuid references public.reports(id) on delete cascade,
  sighting_id uuid references public.sightings(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  source_event_id bigint references public.report_events(id) on delete cascade,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  constraint notifications_source_unique unique (recipient_id, kind, source_event_id)
);

create index if not exists notifications_recipient_created_idx
on public.notifications(recipient_id, created_at desc);

create index if not exists notifications_recipient_unread_idx
on public.notifications(recipient_id, created_at desc)
where read_at is null;

alter table public.notifications enable row level security;
revoke all on table public.notifications from anon, authenticated;

create or replace function public.create_notifications_from_report_event()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_owner uuid;
  target_sighting uuid;
  target_contributor uuid;
  target_review text;
  contributor record;
begin
  select created_by
  into target_owner
  from public.reports
  where id = new.report_id;

  if new.event_type = 'SIGHTING_CREATED' then
    target_sighting := nullif(new.metadata ->> 'sighting_id', '')::uuid;

    if target_sighting is not null then
      select created_by
      into target_contributor
      from public.sightings
      where id = target_sighting
        and report_id = new.report_id;

      if target_owner is not null
         and target_contributor is not null
         and target_owner <> target_contributor then
        insert into public.notifications (
          recipient_id, kind, report_id, sighting_id, actor_id,
          source_event_id, metadata, created_at
        ) values (
          target_owner, 'NEW_SIGHTING', new.report_id, target_sighting,
          coalesce(new.actor_id, target_contributor), new.id,
          jsonb_build_object('confidence', new.metadata ->> 'confidence'),
          new.created_at
        ) on conflict do nothing;
      end if;
    end if;

  elsif new.event_type = 'SIGHTING_REVIEWED' then
    target_sighting := nullif(new.metadata ->> 'sighting_id', '')::uuid;
    target_review := nullif(new.metadata ->> 'review_status', '');

    if target_sighting is not null then
      select created_by
      into target_contributor
      from public.sightings
      where id = target_sighting
        and report_id = new.report_id;

      if target_contributor is not null
         and target_contributor <> coalesce(new.actor_id, target_owner) then
        insert into public.notifications (
          recipient_id, kind, report_id, sighting_id, actor_id,
          source_event_id, metadata, created_at
        ) values (
          target_contributor, 'SIGHTING_REVIEWED', new.report_id,
          target_sighting, coalesce(new.actor_id, target_owner), new.id,
          jsonb_build_object('review_status', target_review),
          new.created_at
        ) on conflict do nothing;
      end if;
    end if;

  elsif new.event_type in ('PAUSED','REACTIVATED','RESOLVED','CLOSED','ARCHIVED') then
    for contributor in
      select distinct on (s.created_by)
        s.created_by,
        s.id as sighting_id
      from public.sightings s
      where s.report_id = new.report_id
        and s.created_by <> target_owner
      order by s.created_by, s.created_at desc
    loop
      insert into public.notifications (
        recipient_id, kind, report_id, sighting_id, actor_id,
        source_event_id, metadata, created_at
      ) values (
        contributor.created_by,
        case new.event_type
          when 'PAUSED' then 'REPORT_PAUSED'
          when 'REACTIVATED' then 'REPORT_REACTIVATED'
          when 'RESOLVED' then 'REPORT_RESOLVED'
          when 'CLOSED' then 'REPORT_CLOSED'
          when 'ARCHIVED' then 'REPORT_ARCHIVED'
        end,
        new.report_id, contributor.sighting_id, new.actor_id, new.id,
        '{}'::jsonb, new.created_at
      ) on conflict do nothing;
    end loop;
  end if;

  return new;
end;
$$;

drop trigger if exists report_events_create_notifications on public.report_events;
create trigger report_events_create_notifications
after insert on public.report_events
for each row
execute function public.create_notifications_from_report_event();

create or replace function public.get_unread_notification_count()
returns bigint
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select count(*)
  from public.notifications n
  where n.recipient_id = auth.uid()
    and n.read_at is null;
$$;

revoke all on function public.get_unread_notification_count() from public;
grant execute on function public.get_unread_notification_count() to authenticated;

create or replace function public.get_my_notifications_page(
  target_filter text default 'ALL',
  target_page integer default 1,
  target_page_size integer default 20
)
returns table (
  id uuid,
  kind text,
  report_id uuid,
  sighting_id uuid,
  metadata jsonb,
  read_at timestamptz,
  created_at timestamptz,
  report_title text,
  pet_name text,
  actor_alias text,
  total_count bigint
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  normalized_filter text := upper(coalesce(target_filter, 'ALL'));
  normalized_page integer := greatest(coalesce(target_page, 1), 1);
  normalized_page_size integer := least(greatest(coalesce(target_page_size, 20), 1), 50);
begin
  if normalized_filter not in ('ALL','UNREAD','READ') then
    raise exception 'NOTIFICATION_FILTER_INVALID' using errcode = '22023';
  end if;

  return query
  with base as (
    select
      n.id, n.kind, n.report_id, n.sighting_id, n.metadata,
      n.read_at, n.created_at, r.title as report_title,
      p.name as pet_name, pr.public_alias as actor_alias
    from public.notifications n
    left join public.reports r on r.id = n.report_id
    left join public.pets p on p.id = r.pet_id
    left join public.profiles pr on pr.id = n.actor_id and pr.is_public = true
    where n.recipient_id = auth.uid()
      and (
        normalized_filter = 'ALL'
        or (normalized_filter = 'UNREAD' and n.read_at is null)
        or (normalized_filter = 'READ' and n.read_at is not null)
      )
  ), counted as (
    select base.*, count(*) over() as total_count
    from base
  )
  select
    counted.id, counted.kind, counted.report_id, counted.sighting_id,
    counted.metadata, counted.read_at, counted.created_at,
    counted.report_title, counted.pet_name, counted.actor_alias,
    counted.total_count
  from counted
  order by counted.created_at desc
  limit normalized_page_size
  offset (normalized_page - 1) * normalized_page_size;
end;
$$;

revoke all on function public.get_my_notifications_page(text, integer, integer) from public;
grant execute on function public.get_my_notifications_page(text, integer, integer) to authenticated;

create or replace function public.mark_notification_read(target_notification_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  update public.notifications
  set read_at = coalesce(read_at, timezone('utc', now()))
  where id = target_notification_id
    and recipient_id = auth.uid();

  return found;
end;
$$;

revoke all on function public.mark_notification_read(uuid) from public;
grant execute on function public.mark_notification_read(uuid) to authenticated;

create or replace function public.mark_all_notifications_read()
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  affected integer;
begin
  update public.notifications
  set read_at = timezone('utc', now())
  where recipient_id = auth.uid()
    and read_at is null;

  get diagnostics affected = row_count;
  return affected;
end;
$$;

revoke all on function public.mark_all_notifications_read() from public;
grant execute on function public.mark_all_notifications_read() to authenticated;
