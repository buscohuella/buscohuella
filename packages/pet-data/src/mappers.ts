import type {
  BirthDatePrecision,
  CreatePetData,
  Pet,
  PetPhoto,
  PetPhotoMimeType,
  PetPhotoVisibility,
  PetSex,
  PetSize,
  PetSpecies,
  PetSpeciesCategory,
  PetStatus,
  PetVisibility,
  UpdatePetData,
} from '@buscohuella/pet-domain';

import type {
  PetInsert,
  PetPhotoRow,
  PetRow,
  PetSpeciesRow,
  PetUpdate,
} from './rows.js';

export const mapPetSpeciesRow = (row: PetSpeciesRow): PetSpecies => ({
  id: row.id,
  code: row.code,
  category: row.category as PetSpeciesCategory,
  sortOrder: row.sort_order,
  isEnabled: row.is_enabled,
  mvpEnabled: row.mvp_enabled,
});

export const mapPetRow = (row: PetRow): Pet => ({
  id: row.id,
  ownerId: row.owner_id,
  speciesId: row.species_id,
  name: row.name,
  breed: row.breed,
  isMixedBreed: row.is_mixed_breed,
  sex: row.sex as PetSex,
  birthDate: row.birth_date,
  birthDatePrecision: row.birth_date_precision as BirthDatePrecision,
  size: row.size as PetSize,
  weightKg: row.weight_kg,
  primaryColor: row.primary_color,
  secondaryColors: row.secondary_colors,
  description: row.description,
  distinctiveFeatures: row.distinctive_features,
  hasMicrochip: row.has_microchip,
  microchipNumber: row.microchip_number,
  identificationNotes: row.identification_notes,
  privateNotes: row.private_notes,
  status: row.status as PetStatus,
  visibility: row.visibility as PetVisibility,
  archivedAt: row.archived_at,
  deceasedAt: row.deceased_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapPetPhotoRow = (row: PetPhotoRow): PetPhoto => ({
  id: row.id,
  petId: row.pet_id,
  storagePath: row.storage_path,
  position: row.position,
  isPrimary: row.is_primary,
  visibility: row.visibility as PetPhotoVisibility,
  altText: row.alt_text,
  mimeType: row.mime_type as PetPhotoMimeType | null,
  fileSizeBytes: row.file_size_bytes,
  width: row.width,
  height: row.height,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapCreatePetToInsert = (
  ownerId: string,
  input: CreatePetData,
): PetInsert => ({
  owner_id: ownerId,
  species_id: input.speciesId,
  name: input.name,
  breed: input.breed ?? null,
  is_mixed_breed: input.isMixedBreed,
  sex: input.sex,
  birth_date: input.birthDate ?? null,
  birth_date_precision: input.birthDatePrecision,
  size: input.size,
  weight_kg: input.weightKg ?? null,
  primary_color: input.primaryColor ?? null,
  secondary_colors: input.secondaryColors,
  description: input.description ?? null,
  distinctive_features: input.distinctiveFeatures ?? null,
  has_microchip: input.hasMicrochip,
  microchip_number: input.microchipNumber ?? null,
  identification_notes: input.identificationNotes ?? null,
  private_notes: input.privateNotes ?? null,
  visibility: input.visibility,
});

export const mapUpdatePetToUpdate = (input: UpdatePetData): PetUpdate => {
  const update: PetUpdate = {};

  if (input.speciesId !== undefined) update.species_id = input.speciesId;
  if (input.name !== undefined) update.name = input.name;
  if (input.breed !== undefined) update.breed = input.breed;
  if (input.isMixedBreed !== undefined) update.is_mixed_breed = input.isMixedBreed;
  if (input.sex !== undefined) update.sex = input.sex;
  if (input.birthDate !== undefined) update.birth_date = input.birthDate;
  if (input.birthDatePrecision !== undefined) {
    update.birth_date_precision = input.birthDatePrecision;
  }
  if (input.size !== undefined) update.size = input.size;
  if (input.weightKg !== undefined) update.weight_kg = input.weightKg;
  if (input.primaryColor !== undefined) update.primary_color = input.primaryColor;
  if (input.secondaryColors !== undefined) {
    update.secondary_colors = input.secondaryColors;
  }
  if (input.description !== undefined) update.description = input.description;
  if (input.distinctiveFeatures !== undefined) {
    update.distinctive_features = input.distinctiveFeatures;
  }
  if (input.hasMicrochip !== undefined) update.has_microchip = input.hasMicrochip;
  if (input.microchipNumber !== undefined) {
    update.microchip_number = input.microchipNumber;
  }
  if (input.identificationNotes !== undefined) {
    update.identification_notes = input.identificationNotes;
  }
  if (input.privateNotes !== undefined) update.private_notes = input.privateNotes;
  if (input.visibility !== undefined) update.visibility = input.visibility;

  return update;
};
