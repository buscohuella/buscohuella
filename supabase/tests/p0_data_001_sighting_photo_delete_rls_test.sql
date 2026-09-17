begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(47);

insert into auth.users (id, email, raw_user_meta_data)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'p0-data-001-report-owner@example.test',
    '{}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'p0-data-001-sighting-author@example.test',
    '{}'::jsonb
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'p0-data-001-other@example.test',
    '{}'::jsonb
  );

set local role authenticated;
set local "request.jwt.claims" =
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';

insert into public.reports (
  id,
  created_by,
  report_type,
  species_id,
  status,
  title,
  description,
  incident_at,
  exact_location,
  public_location,
  public_location_precision
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    'FOUND_ANIMAL',
    (select id from public.pet_species where code = 'DOG'),
    'ACTIVE',
    'Archived report fixture',
    'Fixture for archived report Storage cleanup',
    timezone('utc', now()) - interval '1 hour',
    extensions.st_geogfromtext('SRID=4326;POINT(2.1094 41.5433)'),
    extensions.st_geogfromtext('SRID=4326;POINT(2.1100 41.5440)'),
    'APPROXIMATE_500M'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '11111111-1111-4111-8111-111111111111',
    'FOUND_ANIMAL',
    (select id from public.pet_species where code = 'DOG'),
    'ACTIVE',
    'Active report fixture',
    'Fixture that continues accepting sighting photos',
    timezone('utc', now()) - interval '1 hour',
    extensions.st_geogfromtext('SRID=4326;POINT(2.1094 41.5433)'),
    extensions.st_geogfromtext('SRID=4326;POINT(2.1100 41.5440)'),
    'APPROXIMATE_500M'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    '11111111-1111-4111-8111-111111111111',
    'FOUND_ANIMAL',
    (select id from public.pet_species where code = 'DOG'),
    'ACTIVE',
    'Closed report fixture',
    'Fixture that must not gain photo cleanup permission',
    timezone('utc', now()) - interval '1 hour',
    extensions.st_geogfromtext('SRID=4326;POINT(2.1094 41.5433)'),
    extensions.st_geogfromtext('SRID=4326;POINT(2.1100 41.5440)'),
    'APPROXIMATE_500M'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
    '11111111-1111-4111-8111-111111111111',
    'FOUND_ANIMAL',
    (select id from public.pet_species where code = 'DOG'),
    'ACTIVE',
    'Isolation report fixture',
    'Second archived report owned by the same user',
    timezone('utc', now()) - interval '1 hour',
    extensions.st_geogfromtext('SRID=4326;POINT(2.1094 41.5433)'),
    extensions.st_geogfromtext('SRID=4326;POINT(2.1100 41.5440)'),
    'APPROXIMATE_500M'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5',
    '11111111-1111-4111-8111-111111111111',
    'FOUND_ANIMAL',
    (select id from public.pet_species where code = 'DOG'),
    'ACTIVE',
    'Rollback report fixture',
    'Archived report used to force a finalizer failure',
    timezone('utc', now()) - interval '1 hour',
    extensions.st_geogfromtext('SRID=4326;POINT(2.1094 41.5433)'),
    extensions.st_geogfromtext('SRID=4326;POINT(2.1100 41.5440)'),
    'APPROXIMATE_500M'
  );

insert into public.report_photos (
  id, report_id, storage_path, position
) values
  (
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1/eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1.webp',
    0
  ),
  (
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '11111111-1111-4111-8111-111111111111/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2/eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2.webp',
    0
  );

set local "request.jwt.claims" =
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}';

insert into public.sightings (
  id,
  report_id,
  created_by,
  observed_at,
  exact_location,
  public_location,
  public_location_precision
)
values
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '22222222-2222-4222-8222-222222222222',
    timezone('utc', now()) - interval '30 minutes',
    extensions.st_geogfromtext('SRID=4326;POINT(2.1094 41.5433)'),
    extensions.st_geogfromtext('SRID=4326;POINT(2.1100 41.5440)'),
    'APPROXIMATE_500M'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '22222222-2222-4222-8222-222222222222',
    timezone('utc', now()) - interval '30 minutes',
    extensions.st_geogfromtext('SRID=4326;POINT(2.1094 41.5433)'),
    extensions.st_geogfromtext('SRID=4326;POINT(2.1100 41.5440)'),
    'APPROXIMATE_500M'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
    '22222222-2222-4222-8222-222222222222',
    timezone('utc', now()) - interval '30 minutes',
    extensions.st_geogfromtext('SRID=4326;POINT(2.1094 41.5433)'),
    extensions.st_geogfromtext('SRID=4326;POINT(2.1100 41.5440)'),
    'APPROXIMATE_500M'
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb5',
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5',
    '22222222-2222-4222-8222-222222222222',
    timezone('utc', now()) - interval '30 minutes',
    extensions.st_geogfromtext('SRID=4326;POINT(2.1094 41.5433)'),
    extensions.st_geogfromtext('SRID=4326;POINT(2.1100 41.5440)'),
    'APPROXIMATE_500M'
  );

insert into public.sighting_photos (
  id, sighting_id, storage_path
) values
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd1',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '22222222-2222-4222-8222-222222222222/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1/dddddddd-dddd-4ddd-8ddd-ddddddddddd1.webp'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd4',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4',
    '22222222-2222-4222-8222-222222222222/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4/dddddddd-dddd-4ddd-8ddd-ddddddddddd4.webp'
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-ddddddddddd5',
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb5',
    '22222222-2222-4222-8222-222222222222/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb5/dddddddd-dddd-4ddd-8ddd-ddddddddddd5.webp'
  );

set local "request.jwt.claims" =
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';

update public.reports
set status = 'CLOSED', closure_reason = 'Test fixture closure'
where id in (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5'
);

update public.reports
set status = 'ARCHIVED', closure_reason = null, closed_at = null
where id in (
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5'
);

select is(
  public.can_delete_sighting_photo_storage(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '22222222-2222-4222-8222-222222222222'
  ),
  true,
  'archived report owner can delete a contributor sighting object'
);

select is(
  public.can_delete_sighting_photo_storage(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '22222222-2222-4222-8222-222222222222'
  ),
  false,
  'report owner cannot delete contributor objects while report is active'
);

select is(
  public.can_delete_sighting_photo_storage(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '33333333-3333-4333-8333-333333333333'
  ),
  false,
  'sighting delete path owner must match the actual sighting author'
);

set local "request.jwt.claims" =
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}';

select is(
  public.can_delete_sighting_photo_storage(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '22222222-2222-4222-8222-222222222222'
  ),
  false,
  'sighting author cannot delete Storage after report archival'
);

select is(
  public.can_delete_sighting_photo_storage(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    '22222222-2222-4222-8222-222222222222'
  ),
  true,
  'sighting author can delete Storage before report archival'
);

select is(
  public.can_manage_sighting_photo_storage(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2'
  ),
  true,
  'sighting author can upload while the report is active and published'
);

select is(
  public.can_manage_sighting_photo_storage(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1'
  ),
  false,
  'Storage upload is denied after report archival'
);

select lives_ok(
  $$
    insert into public.sighting_photos (
      id, sighting_id, storage_path
    ) values (
      'cccccccc-cccc-4ccc-8ccc-ccccccccccc2',
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
      '22222222-2222-4222-8222-222222222222/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2/cccccccc-cccc-4ccc-8ccc-ccccccccccc2.webp'
    )
  $$,
  'metadata INSERT remains allowed for an active published report'
);

select throws_ok(
  $$
    insert into public.sighting_photos (
      id, sighting_id, storage_path
    ) values (
      'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
      '22222222-2222-4222-8222-222222222222/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1/cccccccc-cccc-4ccc-8ccc-ccccccccccc1.webp'
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "sighting_photos"',
  'metadata INSERT is denied after report archival'
);

select lives_ok(
  $$
    update public.sighting_photos
    set alt_text = 'Active report update'
    where id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2'
  $$,
  'metadata UPDATE remains allowed for an active published report'
);

select results_eq(
  $$
    with updated as (
      update public.sighting_photos
      set alt_text = 'Archived report update'
      where id = 'dddddddd-dddd-4ddd-8ddd-ddddddddddd1'
      returning 1
    )
    select count(*)::bigint from updated
  $$,
  $$ values (0::bigint) $$,
  'metadata UPDATE cannot mutate the archived-report deletion snapshot'
);

set local "request.jwt.claims" =
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';

select is(
  public.can_delete_report_photo_storage(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111'
  ),
  true,
  'owner can delete report photos during archived cleanup'
);

select is(
  public.can_delete_report_photo_storage(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '11111111-1111-4111-8111-111111111111'
  ),
  true,
  'existing active report-photo delete permission is preserved'
);

select is(
  public.can_delete_report_photo_storage(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    '11111111-1111-4111-8111-111111111111'
  ),
  false,
  'closed report does not gain archived cleanup permission'
);

select is(
  public.can_delete_report_photo_storage(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '33333333-3333-4333-8333-333333333333'
  ),
  false,
  'report-photo path owner must match the actual report owner'
);

set local "request.jwt.claims" =
  '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}';

select is(
  public.can_delete_sighting_photo_storage(
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    '22222222-2222-4222-8222-222222222222'
  ),
  false,
  'unrelated user cannot delete sighting objects'
);

select is(
  public.can_delete_report_photo_storage(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111'
  ),
  false,
  'unrelated user cannot delete archived report objects'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.can_delete_sighting_photo_storage(uuid, text)',
    'EXECUTE'
  ),
  'anonymous role cannot execute the sighting delete helper'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.can_delete_report_photo_storage(uuid, text)',
    'EXECUTE'
  ),
  'anonymous role cannot execute the report delete helper'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.can_manage_sighting_photo_storage(uuid)',
    'EXECUTE'
  ),
  'anonymous role cannot execute the sighting upload helper'
);

select ok(
  has_function_privilege(
    'authenticated',
    'public.can_delete_sighting_photo_storage(uuid, text)',
    'EXECUTE'
  ) and has_function_privilege(
    'authenticated',
    'public.can_delete_report_photo_storage(uuid, text)',
    'EXECUTE'
  ) and has_function_privilege(
    'authenticated',
    'public.can_manage_sighting_photo_storage(uuid)',
    'EXECUTE'
  ),
  'only authenticated receives the required helper execution grants'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'sighting photos authorized delete'
      and cmd = 'DELETE'
      and roles @> array['authenticated']::name[]
      and qual like '%can_delete_sighting_photo_storage%'
  ),
  'sighting-photos DELETE uses the scoped authorization helper'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'report photos owner delete'
      and cmd = 'DELETE'
      and roles @> array['authenticated']::name[]
      and qual like '%can_delete_report_photo_storage%'
  ),
  'report-photos DELETE uses the scoped authorization helper'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'sighting photos author insert'
      and cmd = 'INSERT'
      and roles @> array['authenticated']::name[]
      and with_check like '%can_manage_sighting_photo_storage%'
  ),
  'sighting-photos Storage INSERT uses the active-report helper'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'sighting_photos'
      and policyname = 'sighting_photos_insert_author'
      and cmd = 'INSERT'
      and roles @> array['authenticated']::name[]
      and with_check like '%report_accepts_sightings%'
  ),
  'sighting_photos metadata INSERT requires a report accepting sightings'
);

select ok(
  not exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'sighting photos author delete'
  ),
  'superseded author-only delete policy is removed'
);

reset role;

select ok(
  not has_function_privilege(
    'public',
    'private.finalize_archived_report_deletion(uuid, uuid)',
    'EXECUTE'
  ),
  'PUBLIC cannot execute the private report finalizer'
);

select ok(
  not has_function_privilege(
    'anon',
    'private.finalize_archived_report_deletion(uuid, uuid)',
    'EXECUTE'
  ),
  'anon cannot execute the private report finalizer'
);

select ok(
  not has_function_privilege(
    'authenticated',
    'private.finalize_archived_report_deletion(uuid, uuid)',
    'EXECUTE'
  ),
  'authenticated cannot execute the private report finalizer'
);

select ok(
  has_function_privilege(
    'buscohuella_report_cleanup_backend',
    'private.finalize_archived_report_deletion(uuid, uuid)',
    'EXECUTE'
  ) and not (
    select rolcanlogin
    from pg_catalog.pg_roles
    where rolname = 'buscohuella_report_cleanup_executor'
  ),
  'only the backend login can call the non-login executor finalizer'
);

select ok(
  not has_table_privilege(
    'buscohuella_report_cleanup_backend',
    'public.reports',
    'DELETE'
  ) and not has_table_privilege(
    'buscohuella_report_cleanup_backend',
    'public.sightings',
    'DELETE'
  ) and not has_table_privilege(
    'buscohuella_report_cleanup_backend',
    'public.report_events',
    'DELETE'
  ),
  'backend login has no generic table DELETE privilege'
);

set local role authenticated;
set local "request.jwt.claims" =
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';

select throws_ok(
  $$
    delete from public.reports
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'
  $$,
  '42501',
  'permission denied for table reports',
  'authenticated cannot directly delete an archived report'
);

select throws_ok(
  $$
    delete from public.sightings
    where report_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'
  $$,
  '42501',
  'permission denied for table sightings',
  'authenticated cannot directly delete archived report sightings'
);

select throws_ok(
  $$
    delete from public.report_events
    where report_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'
  $$,
  '42501',
  'permission denied for table report_events',
  'authenticated cannot directly delete archived report events'
);

select throws_ok(
  $$
    insert into public.report_photos (
      id, report_id, storage_path, position
    ) values (
      'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee3',
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1/eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee3.webp',
      1
    )
  $$,
  '42501',
  'new row violates row-level security policy for table "report_photos"',
  'report_photos metadata INSERT is denied after archival'
);

select results_eq(
  $$
    with updated as (
      update public.report_photos
      set alt_text = 'Archived report update'
      where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1'
      returning 1
    )
    select count(*)::bigint from updated
  $$,
  $$ values (0::bigint) $$,
  'report_photos metadata UPDATE is denied after archival'
);

select results_eq(
  $$
    with deleted as (
      delete from public.report_photos
      where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee1'
      returning 1
    )
    select count(*)::bigint from deleted
  $$,
  $$ values (0::bigint) $$,
  'report_photos metadata DELETE is denied after archival'
);

set local "request.jwt.claims" =
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}';

select results_eq(
  $$
    with deleted as (
      delete from public.sighting_photos
      where id = 'dddddddd-dddd-4ddd-8ddd-ddddddddddd1'
      returning 1
    )
    select count(*)::bigint from deleted
  $$,
  $$ values (0::bigint) $$,
  'sighting_photos metadata DELETE is denied after archival'
);

set local "request.jwt.claims" =
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';

select lives_ok(
  $$
    update public.report_photos
    set alt_text = 'Active report update'
    where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2'
  $$,
  'report photo metadata UPDATE remains allowed in an editable state'
);

select results_eq(
  $$
    with deleted as (
      delete from public.report_photos
      where id = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee2'
      returning 1
    )
    select count(*)::bigint from deleted
  $$,
  $$ values (1::bigint) $$,
  'report photo metadata DELETE remains allowed in an editable state'
);

set local "request.jwt.claims" =
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}';

select results_eq(
  $$
    with deleted as (
      delete from public.sighting_photos
      where id = 'cccccccc-cccc-4ccc-8ccc-ccccccccccc2'
      returning 1
    )
    select count(*)::bigint from deleted
  $$,
  $$ values (1::bigint) $$,
  'sighting photo metadata DELETE remains allowed before archival'
);

reset role;
grant usage on schema extensions
  to buscohuella_report_cleanup_backend;
grant buscohuella_report_cleanup_backend
  to session_user
  with set true;
set local role buscohuella_report_cleanup_backend;

select extensions.throws_ok(
  $$
    select private.finalize_archived_report_deletion(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '33333333-3333-4333-8333-333333333333'
    )
  $$,
  '42501',
  'ARCHIVED_REPORT_OWNER_MISMATCH',
  'private finalizer rejects an actor who is not the report owner'
);

select extensions.throws_ok(
  $$
    select private.finalize_archived_report_deletion(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
      '11111111-1111-4111-8111-111111111111'
    )
  $$,
  '23514',
  'REPORT_NOT_ARCHIVED',
  'private finalizer rejects a report that is not archived'
);

select extensions.is(
  private.finalize_archived_report_deletion(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111'
  ),
  true,
  'private finalizer deletes an owned archived report'
);

reset role;

select ok(
  not exists (
    select 1 from public.reports
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'
  ) and exists (
    select 1 from public.reports
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4'
  ) and exists (
    select 1 from public.sightings
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4'
  ),
  'finalizer removes only the target graph and preserves another archived report of the same owner'
);

create function public.p0_data_001_force_event_delete_failure()
returns trigger
language plpgsql
set search_path = pg_catalog
as $failure$
begin
  raise exception 'FORCED_REPORT_EVENT_DELETE_FAILURE'
    using errcode = 'P0001';
end;
$failure$;

create trigger p0_data_001_force_event_delete_failure
before delete on public.report_events
for each row
when (
  old.report_id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5'::uuid
)
execute function public.p0_data_001_force_event_delete_failure();

set local role buscohuella_report_cleanup_backend;

select extensions.throws_ok(
  $$
    select private.finalize_archived_report_deletion(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5',
      '11111111-1111-4111-8111-111111111111'
    )
  $$,
  'P0001',
  'FORCED_REPORT_EVENT_DELETE_FAILURE',
  'a database failure aborts the private finalizer'
);

reset role;

revoke usage on schema extensions
  from buscohuella_report_cleanup_backend;
revoke buscohuella_report_cleanup_backend
  from session_user
  granted by session_user;

select ok(
  exists (
    select 1 from public.reports
    where id = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5'
  ) and exists (
    select 1 from public.sightings
    where id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb5'
  ) and exists (
    select 1 from public.sighting_photos
    where id = 'dddddddd-dddd-4ddd-8ddd-ddddddddddd5'
  ),
  'a finalizer failure rolls back the entire PostgreSQL phase'
);

select * from finish();

rollback;
