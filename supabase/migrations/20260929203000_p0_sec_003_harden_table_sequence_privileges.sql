-- P0-SEC-003
-- Harden table and sequence privileges exposed to client roles.
--
-- RLS remains responsible for row-level authorization.
-- This migration reduces the outer SQL privilege boundary to the operations
-- actually required by the application.
--
-- service_role privileges are intentionally left unchanged.

-- ============================================================================
-- FUTURE OBJECTS
-- ============================================================================

alter default privileges for role postgres in schema public
  revoke all on tables from public, anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all on sequences from public, anon, authenticated;

-- ============================================================================
-- ANON
-- ============================================================================

-- Remove inherited/broad historical grants first.
revoke all on table public.pet_species from public, anon;
revoke all on table public.pet_breeds from public, anon;
revoke all on table public.pets from public, anon;
revoke all on table public.pet_photos from public, anon;
revoke all on table public.profiles from public, anon;
revoke all on table public.public_profiles from public, anon;
revoke all on table public.reports from public, anon;
revoke all on table public.report_events from public, anon;
revoke all on table public.report_photos from public, anon;
revoke all on table public.sightings from public, anon;
revoke all on table public.sighting_photos from public, anon;
revoke all on table public.notifications from public, anon;
revoke all on table public.notification_preferences from public, anon;
revoke all on table public.sighting_owner_states from public, anon;

-- Minimal public read surfaces used directly by anonymous application routes.
grant select on table public.pet_species to anon;
grant select on table public.public_profiles to anon;
grant select on table public.report_photos to anon;

-- ============================================================================
-- AUTHENTICATED
-- ============================================================================

-- Catalogs.
revoke all on table public.pet_species from authenticated;
grant select on table public.pet_species to authenticated;

revoke all on table public.pet_breeds from authenticated;
grant select on table public.pet_breeds to authenticated;

-- Pets.
revoke all on table public.pets from authenticated;
grant select, insert, update, delete
  on table public.pets to authenticated;

revoke all on table public.pet_photos from authenticated;
grant select, insert, update, delete
  on table public.pet_photos to authenticated;

-- Profiles.
revoke all on table public.profiles from authenticated;
grant select, update
  on table public.profiles to authenticated;

revoke all on table public.public_profiles from authenticated;
grant select
  on table public.public_profiles to authenticated;

-- Reports.
revoke all on table public.reports from authenticated;
grant select, insert, update
  on table public.reports to authenticated;

revoke all on table public.report_events from authenticated;
grant select
  on table public.report_events to authenticated;

revoke all on table public.report_photos from authenticated;
grant select, insert, update, delete
  on table public.report_photos to authenticated;

-- Sightings.
revoke all on table public.sightings from authenticated;
grant select, insert
  on table public.sightings to authenticated;

revoke all on table public.sighting_photos from authenticated;
grant select, insert, update, delete
  on table public.sighting_photos to authenticated;

-- RPC-only/internal tables must not be directly accessible by client roles.
revoke all on table public.notifications
  from public, anon, authenticated;

revoke all on table public.notification_preferences
  from public, anon, authenticated;

revoke all on table public.sighting_owner_states
  from public, anon, authenticated;

-- ============================================================================
-- SEQUENCES
-- ============================================================================

-- Client roles do not insert directly into catalog identities or report_events.
-- report_events writes execute through SECURITY DEFINER functions/triggers.
revoke all on sequence public.pet_species_id_seq
  from public, anon, authenticated;

revoke all on sequence public.pet_breeds_id_seq
  from public, anon, authenticated;

revoke all on sequence public.report_events_id_seq
  from public, anon, authenticated;
