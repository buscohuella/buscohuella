begin;

select plan(23);

-- ============================================================================
-- P0-SEC-003  Minimal table / sequence privileges
-- Baseline should fail before the hardening migration.
-- RLS remains the row-level authorization layer; these assertions verify the
-- outer SQL privilege boundary exposed to anon/authenticated.
-- ============================================================================

-- --------------------------------------------------------------------------
-- anon: intentionally public read surfaces only
-- --------------------------------------------------------------------------

select ok(
  not exists (
    select 1
    from unnest(array[
      'public.pet_species',
      'public.report_photos',
      'public.public_profiles'
    ]) as t(name)
    where not has_table_privilege('anon', t.name, 'SELECT')
  ),
  'anon retains SELECT on intended public read surfaces'
);

select ok(
  not exists (
    select 1
    from unnest(array[
      'public.pet_species',
      'public.report_photos',
      'public.public_profiles'
    ]) as t(name)
    cross join unnest(array[
      'INSERT',
      'UPDATE',
      'DELETE',
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege('anon', t.name, p.privilege)
  ),
  'anon cannot write or administer intended public read surfaces'
);

select ok(
  not exists (
    select 1
    from unnest(array[
      'public.pet_breeds',
      'public.pets',
      'public.pet_photos',
      'public.profiles',
      'public.reports',
      'public.report_events',
      'public.sightings',
      'public.sighting_photos',
      'public.notifications',
      'public.notification_preferences',
      'public.sighting_owner_states'
    ]) as t(name)
    cross join unnest(array[
      'SELECT',
      'INSERT',
      'UPDATE',
      'DELETE',
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege('anon', t.name, p.privilege)
  ),
  'anon has no direct privileges on private tables'
);

-- --------------------------------------------------------------------------
-- authenticated: catalogs
-- --------------------------------------------------------------------------

select ok(
  has_table_privilege('authenticated', 'public.pet_species', 'SELECT')
  and has_table_privilege('authenticated', 'public.pet_breeds', 'SELECT'),
  'authenticated retains catalog SELECT'
);

select ok(
  not exists (
    select 1
    from unnest(array[
      'public.pet_species',
      'public.pet_breeds'
    ]) as t(name)
    cross join unnest(array[
      'INSERT',
      'UPDATE',
      'DELETE',
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege('authenticated', t.name, p.privilege)
  ),
  'authenticated cannot write or administer catalogs'
);

-- --------------------------------------------------------------------------
-- authenticated: pets
-- --------------------------------------------------------------------------

select ok(
  not exists (
    select 1
    from unnest(array['SELECT','INSERT','UPDATE','DELETE']) as p(privilege)
    where not has_table_privilege(
      'authenticated',
      'public.pets',
      p.privilege
    )
  ),
  'authenticated retains required pets DML'
);

select ok(
  not exists (
    select 1
    from unnest(array[
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege(
      'authenticated',
      'public.pets',
      p.privilege
    )
  ),
  'authenticated has no structural privileges on pets'
);

select ok(
  not exists (
    select 1
    from unnest(array['SELECT','INSERT','UPDATE','DELETE']) as p(privilege)
    where not has_table_privilege(
      'authenticated',
      'public.pet_photos',
      p.privilege
    )
  ),
  'authenticated retains required pet_photos DML'
);

select ok(
  not exists (
    select 1
    from unnest(array[
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege(
      'authenticated',
      'public.pet_photos',
      p.privilege
    )
  ),
  'authenticated has no structural privileges on pet_photos'
);

-- --------------------------------------------------------------------------
-- authenticated: profiles
-- --------------------------------------------------------------------------

select ok(
  has_table_privilege('authenticated', 'public.profiles', 'SELECT')
  and has_table_privilege('authenticated', 'public.profiles', 'UPDATE'),
  'authenticated retains required profiles SELECT/UPDATE'
);

select ok(
  not exists (
    select 1
    from unnest(array[
      'INSERT',
      'DELETE',
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege(
      'authenticated',
      'public.profiles',
      p.privilege
    )
  ),
  'authenticated has no unnecessary profiles privileges'
);

select ok(
  has_table_privilege(
    'authenticated',
    'public.public_profiles',
    'SELECT'
  )
  and not exists (
    select 1
    from unnest(array[
      'INSERT',
      'UPDATE',
      'DELETE',
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege(
      'authenticated',
      'public.public_profiles',
      p.privilege
    )
  ),
  'authenticated has SELECT-only access to public_profiles'
);

-- --------------------------------------------------------------------------
-- authenticated: reports / sightings
-- --------------------------------------------------------------------------

select ok(
  not exists (
    select 1
    from unnest(array['SELECT','INSERT','UPDATE']) as p(privilege)
    where not has_table_privilege(
      'authenticated',
      'public.reports',
      p.privilege
    )
  )
  and not exists (
    select 1
    from unnest(array[
      'DELETE',
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege(
      'authenticated',
      'public.reports',
      p.privilege
    )
  ),
  'authenticated has minimal reports privileges'
);

select ok(
  has_table_privilege(
    'authenticated',
    'public.report_events',
    'SELECT'
  )
  and not exists (
    select 1
    from unnest(array[
      'INSERT',
      'UPDATE',
      'DELETE',
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege(
      'authenticated',
      'public.report_events',
      p.privilege
    )
  ),
  'authenticated has SELECT-only access to report_events'
);

select ok(
  not exists (
    select 1
    from unnest(array['SELECT','INSERT','UPDATE','DELETE']) as p(privilege)
    where not has_table_privilege(
      'authenticated',
      'public.report_photos',
      p.privilege
    )
  )
  and not exists (
    select 1
    from unnest(array[
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege(
      'authenticated',
      'public.report_photos',
      p.privilege
    )
  ),
  'authenticated has minimal report_photos privileges'
);

select ok(
  has_table_privilege('authenticated', 'public.sightings', 'SELECT')
  and has_table_privilege('authenticated', 'public.sightings', 'INSERT')
  and not exists (
    select 1
    from unnest(array[
      'UPDATE',
      'DELETE',
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege(
      'authenticated',
      'public.sightings',
      p.privilege
    )
  ),
  'authenticated has minimal sightings privileges'
);

select ok(
  has_table_privilege(
    'authenticated',
    'public.sighting_photos',
    'SELECT'
  )
  and has_table_privilege(
    'authenticated',
    'public.sighting_photos',
    'INSERT'
  )
  and has_table_privilege(
    'authenticated',
    'public.sighting_photos',
    'DELETE'
  )
  and has_table_privilege(
    'authenticated',
    'public.sighting_photos',
    'UPDATE'
  )
  and not exists (
    select 1
    from unnest(array[
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege(
      'authenticated',
      'public.sighting_photos',
      p.privilege
    )
  ),
  'authenticated has minimal sighting_photos privileges'
);

select ok(
  not exists (
    select 1
    from unnest(array[
      'public.notifications',
      'public.notification_preferences',
      'public.sighting_owner_states'
    ]) as t(name)
    cross join unnest(array[
      'SELECT',
      'INSERT',
      'UPDATE',
      'DELETE',
      'TRUNCATE',
      'REFERENCES',
      'TRIGGER',
      'MAINTAIN'
    ]) as p(privilege)
    where has_table_privilege(
      'authenticated',
      t.name,
      p.privilege
    )
  ),
  'authenticated has no direct access to RPC-only internal tables'
);

-- --------------------------------------------------------------------------
-- sequences: client roles do not need direct access
-- --------------------------------------------------------------------------

select ok(
  not exists (
    select 1
    from unnest(array['anon','authenticated']) as r(role_name)
    cross join unnest(array[
      'public.pet_species_id_seq',
      'public.pet_breeds_id_seq',
      'public.report_events_id_seq'
    ]) as s(sequence_name)
    cross join unnest(array['USAGE','SELECT','UPDATE']) as p(privilege)
    where has_sequence_privilege(
      r.role_name,
      s.sequence_name,
      p.privilege
    )
  ),
  'anon/authenticated have no direct sequence privileges'
);

-- --------------------------------------------------------------------------
-- future objects: no automatic client grants
-- --------------------------------------------------------------------------

select ok(
  not exists (
    select 1
    from pg_default_acl d
    cross join lateral aclexplode(d.defaclacl) a
    join pg_roles grantee
      on grantee.oid = a.grantee
    left join pg_namespace n
      on n.oid = d.defaclnamespace
    where d.defaclrole = (
      select oid from pg_roles where rolname = 'postgres'
    )
      and d.defaclobjtype = 'r'
      and (
        d.defaclnamespace = 0
        or n.nspname = 'public'
      )
      and grantee.rolname in ('anon','authenticated')
  ),
  'future public tables are not automatically granted to client roles'
);

select ok(
  not exists (
    select 1
    from pg_default_acl d
    cross join lateral aclexplode(d.defaclacl) a
    join pg_roles grantee
      on grantee.oid = a.grantee
    left join pg_namespace n
      on n.oid = d.defaclnamespace
    where d.defaclrole = (
      select oid from pg_roles where rolname = 'postgres'
    )
      and d.defaclobjtype = 'S'
      and (
        d.defaclnamespace = 0
        or n.nspname = 'public'
      )
      and grantee.rolname in ('anon','authenticated')
  ),
  'future public sequences are not automatically granted to client roles'
);

-- --------------------------------------------------------------------------
-- service_role remains operational
-- --------------------------------------------------------------------------

select ok(
  not exists (
    select 1
    from unnest(array[
      'public.pet_species',
      'public.pet_breeds',
      'public.pets',
      'public.pet_photos',
      'public.profiles',
      'public.public_profiles',
      'public.reports',
      'public.report_events',
      'public.report_photos',
      'public.sightings',
      'public.sighting_photos',
      'public.notifications',
      'public.notification_preferences',
      'public.sighting_owner_states'
    ]) as t(name)
    where not has_table_privilege(
      'service_role',
      t.name,
      'SELECT'
    )
  ),
  'service_role retains table access'
);

select ok(
  not exists (
    select 1
    from unnest(array[
      'public.pet_species_id_seq',
      'public.pet_breeds_id_seq',
      'public.report_events_id_seq'
    ]) as s(sequence_name)
    where not has_sequence_privilege(
      'service_role',
      s.sequence_name,
      'USAGE'
    )
  ),
  'service_role retains sequence access'
);

select * from finish();

rollback;
