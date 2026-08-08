drop policy if exists profile_avatars_public_select on storage.objects;

create policy profile_avatars_public_select
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'profile-avatars'
  and array_length(storage.foldername(name), 1) = 2
  and exists (
    select 1
    from public.profiles
    where profiles.id = ((storage.foldername(objects.name))[1])::uuid
      and profiles.is_public = true
      and profiles.avatar_path = objects.name
  )
);
