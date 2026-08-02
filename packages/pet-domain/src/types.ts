import type {
  BIRTH_DATE_PRECISIONS,
  PET_PHOTO_MIME_TYPES,
  PET_PHOTO_VISIBILITIES,
  PET_SEXES,
  PET_SIZES,
  PET_SPECIES_CATEGORIES,
  PET_STATUSES,
  PET_VISIBILITIES,
} from './constants.js';

export type PetStatus = (typeof PET_STATUSES)[number];
export type PetVisibility = (typeof PET_VISIBILITIES)[number];
export type PetSex = (typeof PET_SEXES)[number];
export type PetSize = (typeof PET_SIZES)[number];
export type BirthDatePrecision = (typeof BIRTH_DATE_PRECISIONS)[number];
export type PetPhotoVisibility = (typeof PET_PHOTO_VISIBILITIES)[number];
export type PetPhotoMimeType = (typeof PET_PHOTO_MIME_TYPES)[number];
export type PetSpeciesCategory = (typeof PET_SPECIES_CATEGORIES)[number];

export interface PetSpecies {
  id: number;
  code: string;
  category: PetSpeciesCategory;
  sortOrder: number;
  isEnabled: boolean;
  mvpEnabled: boolean;
}

export interface Pet {
  id: string;
  ownerId: string;
  speciesId: number;
  name: string;
  breed: string | null;
  isMixedBreed: boolean;
  sex: PetSex;
  birthDate: string | null;
  birthDatePrecision: BirthDatePrecision;
  size: PetSize;
  weightKg: number | null;
  primaryColor: string | null;
  secondaryColors: string[];
  description: string | null;
  distinctiveFeatures: string | null;
  hasMicrochip: boolean;
  microchipNumber: string | null;
  identificationNotes: string | null;
  privateNotes: string | null;
  status: PetStatus;
  visibility: PetVisibility;
  archivedAt: string | null;
  deceasedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PetPhoto {
  id: string;
  petId: string;
  storagePath: string;
  position: number;
  isPrimary: boolean;
  visibility: PetPhotoVisibility;
  altText: string | null;
  mimeType: PetPhotoMimeType | null;
  fileSizeBytes: number | null;
  width: number | null;
  height: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetInput {
  speciesId: number;
  name: string;
  breed?: string | null;
  isMixedBreed?: boolean;
  sex?: PetSex;
  birthDate?: string | null;
  birthDatePrecision?: BirthDatePrecision;
  size?: PetSize;
  weightKg?: number | null;
  primaryColor?: string | null;
  secondaryColors?: string[];
  description?: string | null;
  distinctiveFeatures?: string | null;
  hasMicrochip?: boolean;
  microchipNumber?: string | null;
  identificationNotes?: string | null;
  privateNotes?: string | null;
  visibility?: PetVisibility;
}

export type UpdatePetInput = Partial<CreatePetInput>;
