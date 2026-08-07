import type {
  Database as ReportDatabase,
} from '@buscohuella/report-data';

export type SightingPhotoRow = {
  id: string;
  sighting_id: string;
  storage_path: string;
  position: number;
  alt_text: string | null;
  mime_type: string | null;
  file_size_bytes: number | null;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
};

export type SightingPhotoInsert = {
  id?: string;
  sighting_id: string;
  storage_path: string;
  position?: number;
  alt_text?: string | null;
  mime_type?: string | null;
  file_size_bytes?: number | null;
  width?: number | null;
  height?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type SightingPhotoUpdate =
  Partial<SightingPhotoInsert>;

export type ReportDatabaseWithSightingPhotos =
  Omit<ReportDatabase, 'public'> & {
    public: Omit<
      ReportDatabase['public'],
      'Tables'
    > & {
      Tables:
        ReportDatabase['public']['Tables'] & {
          sighting_photos: {
            Row: SightingPhotoRow;
            Insert: SightingPhotoInsert;
            Update: SightingPhotoUpdate;
            Relationships: [];
          };
        };
    };
  };
