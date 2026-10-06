-- P0-SEC-002
-- Harden effective EXECUTE privileges for public-schema functions.
--
-- Goals:
-- 1. New functions created by postgres must not automatically become
--    executable by PUBLIC, anon or authenticated.
-- 2. Trigger-only functions must not be directly callable by API roles.
-- 3. Legitimate authenticated RPCs/helpers retain only the access they need.
--
-- Table/sequence privileges are intentionally out of scope here and belong
-- to P0-SEC-003.

-- ---------------------------------------------------------------------------
-- Future functions: fail closed by default.
-- ---------------------------------------------------------------------------

-- PostgreSQL grants EXECUTE on newly-created functions to PUBLIC globally by
-- default. Schema-scoped default ACLs are additive and cannot cancel that
-- global grant, so harden both levels.

alter default privileges for role postgres
  revoke execute on functions from public, anon, authenticated;

alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;

-- service_role remains unchanged intentionally. Server-side functions can
-- still be granted/revoked explicitly by individual migrations.

-- ---------------------------------------------------------------------------
-- Trigger-only functions.
--
-- These functions are attached to database triggers and are not called
-- directly from apps/ or packages/. Trigger execution does not require
-- browser/API roles to retain direct EXECUTE access to the trigger function.
-- ---------------------------------------------------------------------------

revoke execute on function public.set_notification_preferences_updated_at()
  from public, anon, authenticated;

revoke execute on function public.prepare_pet_photo_write()
  from public, anon, authenticated;

revoke execute on function public.repair_pet_photos_after_delete()
  from public, anon, authenticated;

revoke execute on function public.prevent_pet_owner_change()
  from public, anon, authenticated;

revoke execute on function public.set_updated_at()
  from public, anon, authenticated;

revoke execute on function public.mark_custom_report_title()
  from public, anon, authenticated;

revoke execute on function public.validate_pet_breed_species()
  from public, anon, authenticated;

revoke execute on function public.validate_report_write()
  from public, anon, authenticated;

revoke execute on function public.validate_sighting_write()
  from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Internal helper used by repair_pet_photos_after_delete().
--
-- The trigger function is SECURITY INVOKER, so authenticated must retain
-- EXECUTE on this helper for legitimate pet-photo DELETE operations.
-- It must not be callable by anon or inherited through PUBLIC.
-- ---------------------------------------------------------------------------

revoke execute on function public.repair_pet_photo_collection(uuid)
  from public, anon, authenticated;

grant execute on function public.repair_pet_photo_collection(uuid)
  to authenticated;

-- ---------------------------------------------------------------------------
-- Legitimate authenticated pet-photo RPCs.
-- ---------------------------------------------------------------------------

revoke execute on function public.set_pet_primary_photo(uuid)
  from public, anon, authenticated;

grant execute on function public.set_pet_primary_photo(uuid)
  to authenticated;

revoke execute on function public.reorder_pet_photos(uuid, uuid[])
  from public, anon, authenticated;

grant execute on function public.reorder_pet_photos(uuid, uuid[])
  to authenticated;

