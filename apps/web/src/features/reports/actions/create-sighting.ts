'use server';

import type { Database as ReportDatabase } from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getServerTranslator } from '@/features/i18n/server';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';
import type { CreateSightingState } from '../types/create-sighting-state';

type Row = ReportDatabase['public']['Tables']['sightings']['Row'];
type RpcResult = { data: Row | null; error: { code?: string; message?: string } | null };
const text = (fd: FormData, name: string) => {
  const value = fd.get(name);
  return typeof value === 'string' ? value.trim() : '';
};
const numberOrNull = (fd: FormData, name: string) => {
  const raw = text(fd, name);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
};

export async function createSightingAction(
  _previous: CreateSightingState,
  formData: FormData,
): Promise<CreateSightingState> {
  const { translate } = await getServerTranslator();
  const reportId = text(formData, 'reportId');
  const observedAt = text(formData, 'observedAt');
  const confidence = text(formData, 'confidence');
  const locationSource = text(formData, 'locationSource');
  const notes = text(formData, 'notes') || null;
  const locationLabel = text(formData, 'locationLabel') || null;
  const latitude = numberOrNull(formData, 'latitude');
  const longitude = numberOrNull(formData, 'longitude');

  if (!reportId || !observedAt || !confidence || !locationSource) {
    return { status: 'error', message: translate('sightingCreate.errors.required') };
  }
  const date = new Date(observedAt);
  if (Number.isNaN(date.getTime()) || date.getTime() > Date.now()) {
    return { status: 'error', message: translate('sightingCreate.errors.time') };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: 'error', message: translate('sightingCreate.errors.session') };

  const client = supabase as unknown as SupabaseClient<ReportDatabase>;
  const rpc = client.rpc.bind(client) as unknown as (
    name: 'create_report_sighting',
    args: {
      target_report_id: string;
      target_observed_at: string;
      target_confidence: string;
      target_notes: string | null;
      target_location_source: string;
      target_latitude: number | null;
      target_longitude: number | null;
      target_location_label: string | null;
    },
  ) => Promise<RpcResult>;

  const { data, error } = await rpc('create_report_sighting', {
    target_report_id: reportId,
    target_observed_at: date.toISOString(),
    target_confidence: confidence,
    target_notes: notes,
    target_location_source: locationSource,
    target_latitude: latitude,
    target_longitude: longitude,
    target_location_label: locationLabel,
  });

  if (error || !data) {
    logServerError('sighting.create.failed', error ?? new Error('No sighting row'), {
      userId: user.id,
      reportId,
      errorCode: error?.code,
      errorMessage: error?.message,
    });
    const mappings: Array<[string, string]> = [
      ['SIGHTING_REPORT_NOT_AVAILABLE', 'sightingCreate.errors.report'],
      ['SIGHTING_TIME_INVALID', 'sightingCreate.errors.time'],
      ['SIGHTING_CONFIDENCE_INVALID', 'sightingCreate.errors.confidence'],
      ['SIGHTING_NOTES_TOO_LONG', 'sightingCreate.errors.notes'],
      ['SIGHTING_COORDINATES_INVALID', 'sightingCreate.errors.coordinates'],
      ['SIGHTING_LOCATION_LABEL_REQUIRED', 'sightingCreate.errors.location'],
    ];
    const match = mappings.find(([code]) => error?.message?.includes(code));
    return { status: 'error', message: translate(match?.[1] ?? 'sightingCreate.errors.generic') };
  }

  revalidatePath(`/reportes/${reportId}`);
  revalidatePath(`/mis-reportes/${reportId}`);
  redirect(`/reportes/${reportId}?avistamiento=creado`);
}
