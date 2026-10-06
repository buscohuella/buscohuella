export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

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
  title_source: 'SYSTEM' | 'CUSTOM';
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
  title_source?: 'SYSTEM' | 'CUSTOM';
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
  location_label: string | null;
  location_source: string;
  notes: string | null;
  observed_at: string;
  public_location: GeographyValue;
  public_location_precision: string;
  report_id: string;
  review_status: string;
  updated_at: string;
};

type SightingPhotoRow = {
  alt_text: string | null;
  created_at: string;
  file_size_bytes: number | null;
  height: number | null;
  id: string;
  mime_type: string | null;
  position: number;
  sighting_id: string;
  storage_path: string;
  updated_at: string;
  width: number | null;
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
        Update: Partial<Database['public']['Tables']['report_photos']['Insert']>;
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
          location_label?: string | null;
          location_source?: string;
          notes?: string | null;
          observed_at: string;
          public_location?: GeographyValue;
          public_location_precision?: string;
          report_id: string;
          review_status?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['sightings']['Insert']>;
        Relationships: Relation[];
      };
      sighting_photos: {
        Row: SightingPhotoRow;
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          file_size_bytes?: number | null;
          height?: number | null;
          id?: string;
          mime_type?: string | null;
          position?: number;
          sighting_id: string;
          storage_path: string;
          updated_at?: string;
          width?: number | null;
        };
        Update: Partial<Database['public']['Tables']['sighting_photos']['Insert']>;
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
      can_manage_sighting_photo_storage: {
        Args: { target_sighting_id: string };
        Returns: boolean;
      };
      create_report_sighting: {
        Args: {
          target_confidence: string;
          target_latitude?: number;
          target_location_label?: string;
          target_location_source?: string;
          target_longitude?: number;
          target_notes?: string;
          target_observed_at: string;
          target_report_id: string;
        };
        Returns: {
          confidence: string;
          created_at: string;
          created_by: string;
          exact_location: unknown;
          id: string;
          location_label: string | null;
          location_source: string;
          notes: string | null;
          observed_at: string;
          public_location: unknown;
          public_location_precision: string;
          report_id: string;
          review_status: string;
          updated_at: string;
        };
        SetofOptions: {
          from: '*';
          to: 'sightings';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      get_my_notification_preferences: {
        Args: never;
        Returns: {
          in_app_report_updates: boolean;
          in_app_sightings: boolean;
        }[];
      };
      get_my_notifications_page: {
        Args: {
          target_filter?: string;
          target_page?: number;
          target_page_size?: number;
        };
        Returns: {
          actor_alias: string;
          created_at: string;
          id: string;
          kind: string;
          metadata: Json;
          pet_name: string;
          read_at: string;
          report_id: string;
          report_title: string;
          sighting_id: string;
          total_count: number;
        }[];
      };
      get_my_sighting: {
        Args: { target_sighting_id: string };
        Returns: {
          confidence: string;
          created_at: string;
          exact_latitude: number;
          exact_longitude: number;
          id: string;
          last_reviewed_at: string;
          location_label: string;
          location_source: string;
          notes: string;
          observed_at: string;
          pet_name: string;
          photo_count: number;
          report_closed_at: string;
          report_id: string;
          report_resolved_at: string;
          report_status: string;
          report_title: string;
          review_status: string;
          updated_at: string;
        }[];
      };
      get_my_sighting_timeline: {
        Args: { target_sighting_id: string };
        Returns: {
          created_at: string;
          event_key: string;
          event_type: string;
          review_status: string;
        }[];
      };
      get_my_sightings: {
        Args: never;
        Returns: {
          confidence: string;
          created_at: string;
          id: string;
          location_label: string;
          location_source: string;
          notes: string;
          observed_at: string;
          pet_name: string;
          photo_count: number;
          report_closed_at: string;
          report_id: string;
          report_resolved_at: string;
          report_status: string;
          report_title: string;
          review_status: string;
          updated_at: string;
        }[];
      };
      get_my_sightings_page: {
        Args: {
          target_page?: number;
          target_page_size?: number;
          target_status?: string;
        };
        Returns: {
          confidence: string;
          created_at: string;
          id: string;
          location_label: string;
          location_source: string;
          notes: string;
          observed_at: string;
          pet_name: string;
          photo_count: number;
          report_closed_at: string;
          report_id: string;
          report_resolved_at: string;
          report_status: string;
          report_title: string;
          review_status: string;
          total_count: number;
          updated_at: string;
        }[];
      };
      get_owned_sighting_archive_state: {
        Args: { target_sighting_id: string };
        Returns: boolean;
      };
      get_owned_sightings: {
        Args: never;
        Returns: {
          confidence: string;
          created_at: string;
          exact_latitude: number;
          exact_longitude: number;
          id: string;
          location_label: string;
          location_source: string;
          notes: string;
          observed_at: string;
          pet_name: string;
          photo_count: number;
          public_latitude: number;
          public_location_precision: string;
          public_longitude: number;
          report_id: string;
          report_title: string;
          review_status: string;
          updated_at: string;
        }[];
      };
      get_owned_sightings_page: {
        Args: {
          target_archive?: string;
          target_has_photos?: boolean;
          target_page?: number;
          target_page_size?: number;
          target_sort?: string;
          target_status?: string;
        };
        Returns: {
          archived_at: string;
          confidence: string;
          created_at: string;
          exact_latitude: number;
          exact_longitude: number;
          id: string;
          location_label: string;
          location_source: string;
          notes: string;
          observed_at: string;
          pet_name: string;
          photo_count: number;
          public_latitude: number;
          public_location_precision: string;
          public_longitude: number;
          report_id: string;
          report_title: string;
          review_status: string;
          total_count: number;
          updated_at: string;
        }[];
      };
      get_owned_sightings_summary: {
        Args: never;
        Returns: {
          accepted: number;
          active: number;
          archived: number;
          flagged: number;
          pending: number;
          rejected: number;
          total: number;
          with_photos: number;
        }[];
      };
      get_public_report: {
        Args: { target_report_id: string };
        Returns: {
          contact_mode: string;
          description: string;
          id: string;
          incident_at: string;
          latitude: number;
          longitude: number;
          municipality_name: string;
          pet_breed: string;
          pet_name: string;
          pet_primary_color: string;
          pet_sex: string;
          pet_size: string;
          photos: Json;
          public_email: string;
          public_location_precision: string;
          public_phone: string;
          published_at: string;
          report_type: string;
          species_id: number;
          title: string;
          updated_at: string;
        }[];
      };
      get_public_reports: {
        Args: {
          filter_report_type?: string;
          filter_species_id?: number;
          result_limit?: number;
        };
        Returns: {
          contact_mode: string;
          description: string;
          id: string;
          incident_at: string;
          latitude: number;
          longitude: number;
          municipality_name: string;
          primary_photo_id: string;
          public_email: string;
          public_location_precision: string;
          public_phone: string;
          published_at: string;
          report_type: string;
          species_id: number;
          title: string;
          updated_at: string;
        }[];
      };
      get_unread_notification_count: { Args: never; Returns: number };
      manage_report_lifecycle: {
        Args: {
          target_action: string;
          target_notes?: string;
          target_report_id: string;
          target_resolution_type?: string;
        };
        Returns: {
          archived_at: string | null;
          closed_at: string | null;
          closure_reason: string | null;
          contact_mode: string;
          created_at: string;
          created_by: string;
          description: string | null;
          exact_location: unknown;
          id: string;
          incident_at: string | null;
          location_is_sensitive: boolean;
          municipality_name: string | null;
          pet_id: string | null;
          public_email: string | null;
          public_location: unknown;
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
          title_source: string;
          updated_at: string;
        };
        SetofOptions: {
          from: '*';
          to: 'reports';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      mark_all_notifications_read: { Args: never; Returns: number };
      mark_notification_read: {
        Args: { target_notification_id: string };
        Returns: boolean;
      };
      publish_report_draft: {
        Args: { target_report_id: string };
        Returns: {
          archived_at: string | null;
          closed_at: string | null;
          closure_reason: string | null;
          contact_mode: string;
          created_at: string;
          created_by: string;
          description: string | null;
          exact_location: unknown;
          id: string;
          incident_at: string | null;
          location_is_sensitive: boolean;
          municipality_name: string | null;
          pet_id: string | null;
          public_email: string | null;
          public_location: unknown;
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
          title_source: string;
          updated_at: string;
        };
        SetofOptions: {
          from: '*';
          to: 'reports';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      record_report_photo_update: {
        Args: { target_change: string; target_report_id: string };
        Returns: undefined;
      };
      reorder_report_photos: {
        Args: { ordered_photo_ids: string[]; target_report_id: string };
        Returns: {
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
        }[];
        SetofOptions: {
          from: '*';
          to: 'report_photos';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      review_owned_report_sighting: {
        Args: { target_sighting_id: string; target_status: string };
        Returns: {
          confidence: string;
          created_at: string;
          created_by: string;
          exact_location: unknown;
          id: string;
          location_label: string | null;
          location_source: string;
          notes: string | null;
          observed_at: string;
          public_location: unknown;
          public_location_precision: string;
          report_id: string;
          review_status: string;
          updated_at: string;
        };
        SetofOptions: {
          from: '*';
          to: 'sightings';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      set_owned_sighting_archived: {
        Args: { target_archived: boolean; target_sighting_id: string };
        Returns: boolean;
      };
      set_report_primary_photo: {
        Args: { target_photo_id: string };
        Returns: {
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
        SetofOptions: {
          from: '*';
          to: 'report_photos';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      update_my_notification_preferences: {
        Args: {
          target_in_app_report_updates: boolean;
          target_in_app_sightings: boolean;
        };
        Returns: boolean;
      };
      update_owned_report_content: {
        Args: {
          target_contact_mode: string;
          target_description: string;
          target_municipality_name: string;
          target_public_email?: string;
          target_public_phone?: string;
          target_report_id: string;
          target_title: string;
        };
        Returns: {
          archived_at: string | null;
          closed_at: string | null;
          closure_reason: string | null;
          contact_mode: string;
          created_at: string;
          created_by: string;
          description: string | null;
          exact_location: unknown;
          id: string;
          incident_at: string | null;
          location_is_sensitive: boolean;
          municipality_name: string | null;
          pet_id: string | null;
          public_email: string | null;
          public_location: unknown;
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
          title_source: string;
          updated_at: string;
        };
        SetofOptions: {
          from: '*';
          to: 'reports';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
