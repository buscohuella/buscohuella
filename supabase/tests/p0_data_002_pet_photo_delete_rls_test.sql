begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(7);

insert into auth.users (id, email, raw_user_meta_data)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'p0-data-002-owner@example.test',
    '{}'::jsonb
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'p0-data-002-other@example.test',
    '{}'::jsonb
  );

insert into public.pets (
  id,
  owner_id,
  species_id,
  name,
  status,
  archived_at,
  deceased_at
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    (select id from public.pet_species where code = 'DOG'),
    'Active test pet',
    'ACTIVE',
    null,
    null
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '11111111-1111-4111-8111-111111111111',
    (select id from public.pet_species where code = 'DOG'),
    'Archived test pet',
    'ARCHIVED',
    timezone('utc', now()),
    null
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    '11111111-1111-4111-8111-111111111111',
    (select id from public.pet_species where code = 'DOG'),
    'Deceased test pet',
    'DECEASED',
    null,
    timezone('utc', now())
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
    '22222222-2222-4222-8222-222222222222',
    (select id from public.pet_species where code = 'DOG'),
    'Other owner archived pet',
    'ARCHIVED',
    timezone('utc', now()),
    null
  );

set local role authenticated;
set local "request.jwt.claims" =
  '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}';

select is(
  public.user_can_delete_pet_photo_for_storage(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'
  ),
  true,
  'owner can delete Storage objects for an active pet'
);

select is(
  public.user_can_delete_pet_photo_for_storage(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2'
  ),
  true,
  'owner can clean Storage before deleting an archived pet'
);

select is(
  public.user_can_delete_pet_photo_for_storage(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3'
  ),
  false,
  'deceased pet photos remain protected'
);

select is(
  public.user_can_delete_pet_photo_for_storage(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4'
  ),
  false,
  'a different owner cannot delete pet photos'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.user_can_delete_pet_photo_for_storage(uuid)',
    'EXECUTE'
  ),
  'anonymous role cannot execute the Storage authorization helper'
);

select ok(
  has_function_privilege(
    'authenticated',
    'public.user_can_delete_pet_photo_for_storage(uuid)',
    'EXECUTE'
  ),
  'authenticated role can execute the Storage authorization helper'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'pet_photos_storage_delete_own'
      and cmd = 'DELETE'
      and roles @> array['authenticated']::name[]
      and qual like '%user_can_delete_pet_photo_for_storage%'
  ),
  'pet-photos DELETE remains protected by the authenticated RLS helper'
);

select * from finish();

rollback;
