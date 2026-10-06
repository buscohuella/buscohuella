begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(16);

insert into auth.users (id, email, raw_user_meta_data)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'p0-sec-001-owner@example.test',
    '{}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'p0-sec-001-other@example.test',
    '{}'::jsonb
  );

update public.profiles
set
  full_name = 'Sensitive Owner Name',
  public_alias = 'sec001owner',
  avatar_path = '11111111-1111-4111-8111-111111111111/avatar.webp',
  municipality = 'Sabadell',
  bio = 'Private bio that must never be public',
  is_public = true,
  public_show_avatar = false,
  public_show_municipality = false
where id = '11111111-1111-4111-8111-111111111111';

update public.profiles
set
  full_name = 'Private Other User',
  public_alias = 'sec001other',
  avatar_path = '22222222-2222-4222-8222-222222222222/avatar.webp',
  municipality = 'Cerdanyola',
  bio = 'Other private bio',
  is_public = false,
  public_show_avatar = true,
  public_show_municipality = true
where id = '22222222-2222-4222-8222-222222222222';

select ok(
  exists (
    select 1
    from pg_catalog.pg_class c
    join pg_catalog.pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'public_profiles'
      and c.relkind = 'r'
      and c.relrowsecurity = true
  ),
  'public_profiles is a physical RLS-protected table'
);

select ok(
  (
    select count(*) = 4
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'public_profiles'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'public_profiles'
      and column_name not in (
        'public_alias',
        'avatar_path',
        'municipality',
        'created_at'
      )
  ),
  'public projection contains only the four approved public columns'
);

select ok(
  not has_table_privilege(
    'anon',
    'public.profiles',
    'SELECT'
  ),
  'anonymous users cannot read the canonical profiles table'
);

select ok(
  has_table_privilege(
    'anon',
    'public.public_profiles',
    'SELECT'
  ),
  'anonymous users can read the explicit public projection'
);

select ok(
  not has_table_privilege('anon', 'public.public_profiles', 'INSERT')
  and not has_table_privilege('anon', 'public.public_profiles', 'UPDATE')
  and not has_table_privilege('anon', 'public.public_profiles', 'DELETE'),
  'anonymous users cannot mutate the public projection'
);

select ok(
  not has_table_privilege('authenticated', 'public.public_profiles', 'INSERT')
  and not has_table_privilege('authenticated', 'public.public_profiles', 'UPDATE')
  and not has_table_privilege('authenticated', 'public.public_profiles', 'DELETE'),
  'authenticated clients cannot mutate the public projection directly'
);

set local role anon;

select is(
  (
    select count(*)
    from public.public_profiles
    where public_alias = 'sec001owner'
  ),
  1::bigint,
  'anonymous users can read an explicitly public profile'
);

select is(
  (
    select count(*)
    from public.public_profiles
    where public_alias = 'sec001other'
  ),
  0::bigint,
  'private profiles are absent from the public projection'
);

select ok(
  (
    select avatar_path is null
    from public.public_profiles
    where public_alias = 'sec001owner'
  ),
  'hidden avatar is not exposed publicly'
);

select ok(
  (
    select municipality is null
    from public.public_profiles
    where public_alias = 'sec001owner'
  ),
  'hidden municipality is not exposed publicly'
);

reset role;

update public.profiles
set
  public_show_avatar = true,
  public_show_municipality = true
where id = '11111111-1111-4111-8111-111111111111';

set local role anon;

select is(
  (
    select avatar_path
    from public.public_profiles
    where public_alias = 'sec001owner'
  ),
  '11111111-1111-4111-8111-111111111111/avatar.webp'::text,
  'enabling avatar visibility updates the public projection'
);

select is(
  (
    select municipality
    from public.public_profiles
    where public_alias = 'sec001owner'
  ),
  'Sabadell'::text,
  'enabling municipality visibility updates the public projection'
);

reset role;

set local role authenticated;
set local "request.jwt.claims" =
  '{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}';

select is(
  (
    select count(*)
    from public.profiles
    where id = '11111111-1111-4111-8111-111111111111'
  ),
  0::bigint,
  'user B cannot read user A private canonical profile'
);

reset role;

set local role authenticated;
set local "request.jwt.claims" =
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';

select is(
  (
    select count(*)
    from public.profiles
    where id = '11111111-1111-4111-8111-111111111111'
  ),
  1::bigint,
  'user A retains legitimate access to their own profile'
);

reset role;

update public.profiles
set is_public = false
where id = '11111111-1111-4111-8111-111111111111';

set local role anon;

select is(
  (
    select count(*)
    from public.public_profiles
    where public_alias = 'sec001owner'
  ),
  0::bigint,
  'disabling public visibility removes the profile from the projection'
);

reset role;

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'profile_avatars_public_select'
      and cmd = 'SELECT'
      and roles @> array['anon', 'authenticated']::name[]
      and qual like '%public_profiles%'
  ),
  'public avatar Storage reads depend on the hardened public projection'
);

select * from finish();

rollback;
