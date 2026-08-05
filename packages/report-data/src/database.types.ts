export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Relation = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type GeographyValue =
  | string
  | {
      type?: string;
      coordinates?: number[];
    }
  | null;

type ReportRow = {
  archived_at: string | null;
  closed_at: string | null;
  closure_reason: string | null;
  contact_mode: string;
  created_at: string;
  created_by: string;
  description: string | null;
  exact_location: GeographyValue;
  id: string;
  incident_at: string | null;
  location_is_sensitive: boolean;
  municipality_name: string | null;
  pet_id: string | null;
  public_email: string | null;
  public_location: GeographyValue;
  public_location_precision: string;
  public_phone: string | null;
  published_at: string | null;
  report_type: string;
  resolution_notes: string | null;
  resolution_type: string | null;
  resolved_at: string | null;
  species_id: number;
  status: string;
  title: string | null;
  updated_at: string;
};

type ReportInsert = {
  archived_at?: string | null;
  closed_at?: string | null;
  closure_reason?: string | null;
  contact_mode?: string;
  created_at?: string;
  created_by: string;
  description?: string | null;
  exact_location?: GeographyValue;
  id?: string;
  incident_at?: string | null;
  location_is_sensitive?: boolean;
  municipality_name?: string | null;
  pet_id?: string | null;
  public_email?: string | null;
  public_location?: GeographyValue;
  public_location_precision?: string;
  public_phone?: string | null;
  published_at?: string | null;
  report_type: string;
  resolution_notes?: string | null;
  resolution_type?: string | null;
  resolved_at?: string | null;
  species_id: number;
  status?: string;
  title?: string | null;
  updated_at?: string;
};

type ReportPhotoRow = {
  alt_text: string | null;
  created_at: string;
  file_size_bytes: number | null;
  height: number | null;
  id: string;
  is_primary: boolean;
  mime_type: string | null;
  position: number;
  report_id: string;
  storage_path: string;
  updated_at: string;
  width: number | null;
};

type SightingRow = {
  confidence: string;
  created_at: string;
  created_by: string;
  exact_location: GeographyValue;
  id: string;
  notes: string | null;
  observed_at: string;
  public_location: GeographyValue;
  public_location_precision: string;
  report_id: string;
  review_status: string;
  updated_at: string;
};

type ReportEventRow = {
  actor_id: string | null;
  created_at: string;
  event_type: string;
  from_status: string | null;
  id: number;
  metadata: Json;
  report_id: string;
  to_status: string | null;
};

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.15';
  };
  public: {
    Tables: {
      reports: {
        Row: ReportRow;
        Insert: ReportInsert;
        Update: Partial<ReportInsert>;
        Relationships: Relation[];
      };
      report_photos: {
        Row: ReportPhotoRow;
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          file_size_bytes?: number | null;
          height?: number | null;
          id?: string;
          is_primary?: boolean;
          mime_type?: string | null;
          position?: number;
          report_id: string;
          storage_path: string;
          updated_at?: string;
          width?: number | null;
        };
        Update: Partial<
          Database['public']['Tables']['report_photos']['Insert']
        >;
        Relationships: Relation[];
      };
      sightings: {
        Row: SightingRow;
        Insert: {
          confidence?: string;
          created_at?: string;
          created_by: string;
          exact_location: GeographyValue;
          id?: string;
          notes?: string | null;
          observed_at: string;
          public_location?: GeographyValue;
          public_location_precision?: string;
          report_id: string;
          review_status?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database['public']['Tables']['sightings']['Insert']
        >;
        Relationships: Relation[];
      };
      report_events: {
        Row: ReportEventRow;
        Insert: never;
        Update: never;
        Relationships: Relation[];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_public_reports: {
        Args: {
          filter_report_type?: string | null;
          filter_species_id?: number | null;
          result_limit?: number;
        };
        Returns: {
          contact_mode: string;
          description: string;
          id: string;
          incident_at: string;
          latitude: number | null;
          longitude: number | null;
          municipality_name: string | null;
          primary_photo_id: string | null;
          public_email: string | null;
          public_location_precision: string;
          public_phone: string | null;
          published_at: string;
          report_type: string;
          species_id: number;
          title: string;
          updated_at: string;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
