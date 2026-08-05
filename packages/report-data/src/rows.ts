import type { Database } from './database.types.js';

export type ReportRow =
  Database['public']['Tables']['reports']['Row'];
export type ReportInsert =
  Database['public']['Tables']['reports']['Insert'];
export type ReportUpdate =
  Database['public']['Tables']['reports']['Update'];

export type ReportPhotoRow =
  Database['public']['Tables']['report_photos']['Row'];
export type ReportPhotoInsert =
  Database['public']['Tables']['report_photos']['Insert'];
export type ReportPhotoUpdate =
  Database['public']['Tables']['report_photos']['Update'];

export type SightingRow =
  Database['public']['Tables']['sightings']['Row'];
export type SightingInsert =
  Database['public']['Tables']['sightings']['Insert'];
export type SightingUpdate =
  Database['public']['Tables']['sightings']['Update'];

export type ReportEventRow =
  Database['public']['Tables']['report_events']['Row'];

export type PublicReportRow =
  Database['public']['Functions']['get_public_reports']['Returns'][number];
