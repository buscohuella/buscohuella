export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Relation = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type Database = {
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
        Update: Partial<Database['public']['Tables']['pet_breeds']['Insert']>;
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
        Update: Partial<Database['public']['Tables']['pet_photos']['Insert']>;
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
        Update: Partial<Database['public']['Tables']['pet_species']['Insert']>;
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
        Update: Partial<Database['public']['Tables']['pets']['Insert']>;
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
          public_show_avatar: boolean;
          public_show_municipality: boolean;
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
          public_show_avatar?: boolean;
          public_show_municipality?: boolean;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: Relation[];
      };
      public_profiles: {
        Row: {
          avatar_path: string | null;
          created_at: string;
          municipality: string | null;
          public_alias: string;
        };
        Insert: {
          avatar_path?: string | null;
          created_at: string;
          municipality?: string | null;
          public_alias: string;
        };
        Update: Partial<Database['public']['Tables']['public_profiles']['Insert']>;
        Relationships: Relation[];
      };
    };
    Views: Record<string, never>;
    Functions: {
      reorder_pet_photos: {
        Args: {
          ordered_photo_ids: string[];
          target_pet_id: string;
        };
        Returns: Database['public']['Tables']['pet_photos']['Row'][];
        SetofOptions: {
          from: '*';
          to: 'pet_photos';
          isOneToOne: false;
          isSetofReturn: true;
        };
      };
      repair_pet_photo_collection: {
        Args: {
          target_pet_id: string;
        };
        Returns: undefined;
      };
      set_pet_primary_photo: {
        Args: {
          target_photo_id: string;
        };
        Returns: Database['public']['Tables']['pet_photos']['Row'];
        SetofOptions: {
          from: '*';
          to: 'pet_photos';
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      user_can_delete_pet_photo_for_storage: {
        Args: {
          target_pet_id: string;
        };
        Returns: boolean;
      };
      user_owns_active_pet_for_storage: {
        Args: {
          target_pet_id: string;
        };
        Returns: boolean;
      };
      user_owns_pet_for_storage: {
        Args: {
          target_pet_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type PublicSchema = Database['public'];

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];

export type TablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update'];
