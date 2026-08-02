export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.15';
  };
  public: {
    Tables: {
      pet_photos: {
        Row: {
          alt_text: string | null;
          created_at: string;
          file_size_bytes: number | null;
          height: number | null;
          id: string;
          is_primary: boolean;
          mime_type: string | null;
          pet_id: string;
          position: number;
          storage_path: string;
          updated_at: string;
          visibility: string;
          width: number | null;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          file_size_bytes?: number | null;
          height?: number | null;
          id?: string;
          is_primary?: boolean;
          mime_type?: string | null;
          pet_id: string;
          position?: number;
          storage_path: string;
          updated_at?: string;
          visibility?: string;
          width?: number | null;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          file_size_bytes?: number | null;
          height?: number | null;
          id?: string;
          is_primary?: boolean;
          mime_type?: string | null;
          pet_id?: string;
          position?: number;
          storage_path?: string;
          updated_at?: string;
          visibility?: string;
          width?: number | null;
        };
        Relationships: [];
      };
      pet_species: {
        Row: {
          category: string;
          code: string;
          created_at: string;
          id: number;
          is_enabled: boolean;
          mvp_enabled: boolean;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          category: string;
          code: string;
          created_at?: string;
          id?: number;
          is_enabled?: boolean;
          mvp_enabled?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          category?: string;
          code?: string;
          created_at?: string;
          id?: number;
          is_enabled?: boolean;
          mvp_enabled?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      pets: {
        Row: {
          archived_at: string | null;
          birth_date: string | null;
          birth_date_precision: string;
          breed: string | null;
          created_at: string;
          deceased_at: string | null;
          description: string | null;
          distinctive_features: string | null;
          has_microchip: boolean;
          id: string;
          identification_notes: string | null;
          is_mixed_breed: boolean;
          microchip_number: string | null;
          name: string;
          owner_id: string;
          primary_color: string | null;
          private_notes: string | null;
          secondary_colors: string[];
          sex: string;
          size: string;
          species_id: number;
          status: string;
          updated_at: string;
          visibility: string;
          weight_kg: number | null;
        };
        Insert: {
          archived_at?: string | null;
          birth_date?: string | null;
          birth_date_precision?: string;
          breed?: string | null;
          created_at?: string;
          deceased_at?: string | null;
          description?: string | null;
          distinctive_features?: string | null;
          has_microchip?: boolean;
          id?: string;
          identification_notes?: string | null;
          is_mixed_breed?: boolean;
          microchip_number?: string | null;
          name: string;
          owner_id: string;
          primary_color?: string | null;
          private_notes?: string | null;
          secondary_colors?: string[];
          sex?: string;
          size?: string;
          species_id: number;
          status?: string;
          updated_at?: string;
          visibility?: string;
          weight_kg?: number | null;
        };
        Update: {
          archived_at?: string | null;
          birth_date?: string | null;
          birth_date_precision?: string;
          breed?: string | null;
          deceased_at?: string | null;
          description?: string | null;
          distinctive_features?: string | null;
          has_microchip?: boolean;
          identification_notes?: string | null;
          is_mixed_breed?: boolean;
          microchip_number?: string | null;
          name?: string;
          primary_color?: string | null;
          private_notes?: string | null;
          secondary_colors?: string[];
          sex?: string;
          size?: string;
          species_id?: number;
          status?: string;
          visibility?: string;
          weight_kg?: number | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_path: string | null;
          bio: string | null;
          created_at: string;
          full_name: string;
          id: string;
          is_public: boolean;
          municipality: string | null;
          public_alias: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_path?: string | null;
          bio?: string | null;
          created_at?: string;
          full_name?: string;
          id: string;
          is_public?: boolean;
          municipality?: string | null;
          public_alias?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_path?: string | null;
          bio?: string | null;
          full_name?: string;
          is_public?: boolean;
          municipality?: string | null;
          public_alias?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          avatar_path: string | null;
          bio: string | null;
          created_at: string | null;
          municipality: string | null;
          public_alias: string | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database['public'];

export type Tables<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Row'];

export type TablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update'];
