import type {
  CloseReportData,
  CreateReportData,
  PublishReportData,
  PublicReport,
  Report,
  ReportEvent,
  ReportPhoto,
  ReportPhotoInput,
  ReportStatus,
  ResolveReportData,
  Sighting,
  UpdateReportData,
} from '@buscohuella/report-domain';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from './database.types.js';
import { normalizeReportDataError } from './errors.js';
import {
  mapCreateReportToInsert,
  mapCreateSightingToInsert,
  mapPublicReportRow,
  mapReportEventRow,
  mapReportPhotoRow,
  mapReportPhotoToInsert,
  mapReportRow,
  mapSightingRow,
  mapUpdateReportToUpdate,
} from './mappers.js';

export class ReportRepository {
  constructor(
    private readonly client: SupabaseClient<Database>,
  ) {}

  async listOwnReports(): Promise<Report[]> {
    const { data, error } = await this.client
      .from('reports')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw normalizeReportDataError(error);

    return (data ?? []).map(mapReportRow);
  }

  async getOwnReportById(id: string): Promise<Report> {
    const { data, error } = await this.client
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw normalizeReportDataError(error, 'REPORT_NOT_FOUND');
    }

    return mapReportRow(data);
  }

  async createReport(
    createdBy: string,
    input: CreateReportData,
  ): Promise<Report> {
    const { data, error } = await this.client
      .from('reports')
      .insert(mapCreateReportToInsert(createdBy, input))
      .select('*')
      .single();

    if (error) throw normalizeReportDataError(error);

    return mapReportRow(data);
  }

  async updateReport(
    id: string,
    input: UpdateReportData,
  ): Promise<Report> {
    const { data, error } = await this.client
      .from('reports')
      .update(mapUpdateReportToUpdate(input))
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw normalizeReportDataError(error, 'REPORT_NOT_FOUND');
    }

    return mapReportRow(data);
  }

  async publishReport(
    id: string,
    input: PublishReportData,
  ): Promise<Report> {
    return this.updateReport(id, {
      ...input,
      status: 'ACTIVE',
    });
  }

  async pauseReport(id: string): Promise<Report> {
    return this.updateReport(id, { status: 'PAUSED' });
  }

  async reactivateReport(id: string): Promise<Report> {
    return this.updateReport(id, { status: 'ACTIVE' });
  }

  async resolveReport(
    id: string,
    input: ResolveReportData,
  ): Promise<Report> {
    return this.updateReport(id, {
      status: 'RESOLVED',
      ...input,
    });
  }

  async closeReport(
    id: string,
    input: CloseReportData,
  ): Promise<Report> {
    return this.updateReport(id, {
      status: 'CLOSED',
      ...input,
    });
  }

  async archiveReport(id: string): Promise<Report> {
    return this.updateReport(id, { status: 'ARCHIVED' });
  }

  async listPublicReports(options?: {
    speciesId?: number;
    reportType?: 'LOST_PET' | 'FOUND_ANIMAL';
    limit?: number;
  }): Promise<PublicReport[]> {
    const { data, error } = await this.client.rpc(
      'get_public_reports',
      {
        filter_species_id: options?.speciesId ?? null,
        filter_report_type: options?.reportType ?? null,
        result_limit: options?.limit ?? 100,
      },
    );

    if (error) throw normalizeReportDataError(error);

    return (data ?? []).map(mapPublicReportRow);
  }

  async listEvents(reportId: string): Promise<ReportEvent[]> {
    const { data, error } = await this.client
      .from('report_events')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false });

    if (error) throw normalizeReportDataError(error);

    return (data ?? []).map(mapReportEventRow);
  }
}

export class SightingRepository {
  constructor(
    private readonly client: SupabaseClient<Database>,
  ) {}

  async listForReport(reportId: string): Promise<Sighting[]> {
    const { data, error } = await this.client
      .from('sightings')
      .select('*')
      .eq('report_id', reportId)
      .order('observed_at', { ascending: false });

    if (error) throw normalizeReportDataError(error);

    return (data ?? []).map(mapSightingRow);
  }

  async createSighting(
    createdBy: string,
    input: import('@buscohuella/report-domain').CreateSightingData,
  ): Promise<Sighting> {
    const { data, error } = await this.client
      .from('sightings')
      .insert(mapCreateSightingToInsert(createdBy, input))
      .select('*')
      .single();

    if (error) {
      throw normalizeReportDataError(error);
    }

    return mapSightingRow(data);
  }
}

export class ReportPhotoRepository {
  constructor(
    private readonly client: SupabaseClient<Database>,
  ) {}

  async listForReport(reportId: string): Promise<ReportPhoto[]> {
    const { data, error } = await this.client
      .from('report_photos')
      .select('*')
      .eq('report_id', reportId)
      .order('position', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) throw normalizeReportDataError(error);

    return (data ?? []).map(mapReportPhotoRow);
  }

  async createMetadata(
    storagePath: string,
    input: ReportPhotoInput,
  ): Promise<ReportPhoto> {
    const { data, error } = await this.client
      .from('report_photos')
      .insert(mapReportPhotoToInsert(storagePath, input))
      .select('*')
      .single();

    if (error) throw normalizeReportDataError(error);

    return mapReportPhotoRow(data);
  }

  async updateAltText(
    id: string,
    altText: string | null,
  ): Promise<ReportPhoto> {
    const { data, error } = await this.client
      .from('report_photos')
      .update({ alt_text: altText })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw normalizeReportDataError(error, 'REPORT_NOT_FOUND');
    }

    return mapReportPhotoRow(data);
  }

  async deleteMetadata(id: string): Promise<void> {
    const { error } = await this.client
      .from('report_photos')
      .delete()
      .eq('id', id);

    if (error) {
      throw normalizeReportDataError(error, 'REPORT_NOT_FOUND');
    }
  }
}
