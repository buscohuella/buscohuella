begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(13);

-- ---------------------------------------------------------------------------
-- Trigger-only functions must not be directly executable by API roles.
-- ---------------------------------------------------------------------------

select ok(
  not exists (
    select 1
    from (
      values
        ('public.set_notification_preferences_updated_at()'),
        ('public.prepare_pet_photo_write()'),
        ('public.repair_pet_photos_after_delete()'),
        ('public.prevent_pet_owner_change()'),
        ('public.set_updated_at()'),
        ('public.mark_custom_report_title()'),
        ('public.validate_pet_breed_species()'),
        ('public.validate_report_write()'),
        ('public.validate_sighting_write()')
    ) as functions(signature)
    where has_function_privilege('anon', signature, 'EXECUTE')
  ),
  'anon cannot directly execute any trigger-only function'
);

select ok(
  not exists (
    select 1
    from (
      values
        ('public.set_notification_preferences_updated_at()'),
        ('public.prepare_pet_photo_write()'),
        ('public.repair_pet_photos_after_delete()'),
        ('public.prevent_pet_owner_change()'),
        ('public.set_updated_at()'),
        ('public.mark_custom_report_title()'),
        ('public.validate_pet_breed_species()'),
        ('public.validate_report_write()'),
        ('public.validate_sighting_write()')
    ) as functions(signature)
    where has_function_privilege('authenticated', signature, 'EXECUTE')
  ),
  'authenticated cannot directly execute any trigger-only function'
);

select ok(
  (
    select count(*) = 9
    from (
      values
        ('set_notification_preferences_updated_at'),
        ('prepare_pet_photo_write'),
        ('repair_pet_photos_after_delete'),
        ('prevent_pet_owner_change'),
        ('set_updated_at'),
        ('mark_custom_report_title'),
        ('validate_pet_breed_species'),
        ('validate_report_write'),
        ('validate_sighting_write')
    ) as expected(function_name)
    where exists (
      select 1
      from pg_trigger t
      join pg_proc p on p.oid = t.tgfoid
      join pg_namespace n on n.oid = p.pronamespace
      where not t.tgisinternal
        and n.nspname = 'public'
        and p.proname = expected.function_name
    )
  ),
  'all hardened trigger-only functions remain attached to real triggers'
);

-- ---------------------------------------------------------------------------
-- Internal helper required by SECURITY INVOKER trigger.
-- ---------------------------------------------------------------------------

select ok(
  not has_function_privilege(
    'anon',
    'public.repair_pet_photo_collection(uuid)',
    'EXECUTE'
  ),
  'anon cannot execute repair_pet_photo_collection'
);

select ok(
  has_function_privilege(
    'authenticated',
    'public.repair_pet_photo_collection(uuid)',
    'EXECUTE'
  ),
  'authenticated retains helper execution required by the pet-photo trigger'
);

-- ---------------------------------------------------------------------------
-- Legitimate authenticated pet-photo RPCs.
-- ---------------------------------------------------------------------------

select ok(
  not has_function_privilege(
    'anon',
    'public.set_pet_primary_photo(uuid)',
    'EXECUTE'
  )
  and not has_function_privilege(
    'anon',
    'public.reorder_pet_photos(uuid,uuid[])',
    'EXECUTE'
  ),
  'anon cannot execute authenticated pet-photo RPCs'
);

select ok(
  has_function_privilege(
    'authenticated',
    'public.set_pet_primary_photo(uuid)',
    'EXECUTE'
  )
  and has_function_privilege(
    'authenticated',
    'public.reorder_pet_photos(uuid,uuid[])',
    'EXECUTE'
  ),
  'authenticated retains legitimate pet-photo RPC access'
);

-- ---------------------------------------------------------------------------
-- Intentional public RPCs remain public.
-- ---------------------------------------------------------------------------

select ok(
  has_function_privilege('anon', 'public.get_public_report(uuid)', 'EXECUTE')
  and has_function_privilege(
    'anon',
    'public.get_public_reports(smallint,text,integer)',
    'EXECUTE'
  )
  and has_function_privilege(
    'anon',
    'public.is_public_active_report(uuid)',
    'EXECUTE'
  )
  and has_function_privilege(
    'anon',
    'public.report_accepts_sightings(uuid)',
    'EXECUTE'
  ),
  'intentional public RPCs remain executable by anon'
);

-- ---------------------------------------------------------------------------
-- Storage/RLS helpers retain authenticated access but not anon access.
-- ---------------------------------------------------------------------------

select ok(
  not exists (
    select 1
    from (
      values
        ('public.can_delete_report_photo_storage(uuid,text)'),
        ('public.can_delete_sighting_photo_storage(uuid,text)'),
        ('public.can_manage_sighting_photo_storage(uuid)'),
        ('public.can_read_sighting_photo_storage(uuid)'),
        ('public.user_can_delete_pet_photo_for_storage(uuid)'),
        ('public.user_owns_active_pet_for_storage(uuid)'),
        ('public.user_owns_pet_for_storage(uuid)')
    ) as functions(signature)
    where has_function_privilege('anon', signature, 'EXECUTE')
  ),
  'anon cannot execute authenticated Storage authorization helpers'
);

select ok(
  not exists (
    select 1
    from (
      values
        ('public.can_delete_report_photo_storage(uuid,text)'),
        ('public.can_delete_sighting_photo_storage(uuid,text)'),
        ('public.can_manage_sighting_photo_storage(uuid)'),
        ('public.can_read_sighting_photo_storage(uuid)'),
        ('public.user_can_delete_pet_photo_for_storage(uuid)'),
        ('public.user_owns_active_pet_for_storage(uuid)'),
        ('public.user_owns_pet_for_storage(uuid)')
    ) as functions(signature)
    where not has_function_privilege(
      'authenticated',
      signature,
      'EXECUTE'
    )
  ),
  'authenticated retains execution of Storage authorization helpers'
);

-- ---------------------------------------------------------------------------
-- Future functions must fail closed.
-- This probe is rolled back with the test transaction.
-- ---------------------------------------------------------------------------

create function public.p0_sec_002_default_privilege_probe()
returns boolean
language sql
as $$
  select true;
$$;

select ok(
  not has_function_privilege(
    'anon',
    'public.p0_sec_002_default_privilege_probe()',
    'EXECUTE'
  ),
  'new functions do not inherit EXECUTE for anon'
);

select ok(
  not has_function_privilege(
    'authenticated',
    'public.p0_sec_002_default_privilege_probe()',
    'EXECUTE'
  ),
  'new functions do not inherit EXECUTE for authenticated'
);

select ok(
  has_function_privilege(
    'service_role',
    'public.p0_sec_002_default_privilege_probe()',
    'EXECUTE'
  ),
  'existing service_role default function access remains unchanged'
);

select * from finish();

rollback;
