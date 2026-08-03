import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from './database.types.js';

export type PetRow = Tables<'pets'>;
export type PetInsert = TablesInsert<'pets'>;
export type PetUpdate = TablesUpdate<'pets'>;
export type PetBreedRow = Tables<'pet_breeds'>;
export type PetPhotoRow = Tables<'pet_photos'>;
export type PetPhotoInsert = TablesInsert<'pet_photos'>;
export type PetPhotoUpdate = TablesUpdate<'pet_photos'>;
export type PetSpeciesRow = Tables<'pet_species'>;
