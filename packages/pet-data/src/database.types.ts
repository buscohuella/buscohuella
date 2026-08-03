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

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.15';
  };
  public: {
    Tables: {
      pet_breeds: {
        Row: {
          aliases: string[];
          canonical_name: string;
          code: string;
          created_at: string;
          id: number;
          is_enabled: boolean;
          mvp_enabled: boolean;
          sort_order: number;
          species_id: number;
          updated_at: string;
        };
        Insert: {
          aliases?: string[];
          canonical_name: string;
          code: string;
          created_at?: string;
          id?: number;
          is_enabled?: boolean;
          mvp_enabled?: boolean;
          sort_order?: number;
          species_id: number;
          updated_at?: string;
        };
        Update: Partial<
          Database['public']['Tables']['pet_breeds']['Insert']
        >;
        Relationships: Relation[];
      };
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
        Update: Partial<
          Database['public']['Tables']['pet_photos']['Insert']
        >;
        Relationships: Relation[];
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
        Update: Partial<
          Database['public']['Tables']['pet_species']['Insert']
        >;
        Relationships: Relation[];
      };
      pets: {
        Row: {
          archived_at: string | null;
          birth_date: string | null;
          birth_date_precision: string;
          breed: string | null;
          breed_knowledge: string;
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
          primary_breed_id: number | null;
          primary_color: string | null;
          private_notes: string | null;
          secondary_breed_id: number | null;
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
          breed_knowledge?: string;
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
          primary_breed_id?: number | null;
          primary_color?: string | null;
          private_notes?: string | null;
          secondary_breed_id?: number | null;
          secondary_colors?: string[];
          sex?: string;
          size?: string;
          species_id: number;
          status?: string;
          updated_at?: string;
          visibility?: string;
          weight_kg?: number | null;
        };
        Update: Partial<
          Database['public']['Tables']['pets']['Insert']
        >;
        Relationships: Relation[];
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
        Update: Partial<
          Database['public']['Tables']['profiles']['Insert']
        >;
        Relationships: Relation[];
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
        Relationships: Relation[];
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
