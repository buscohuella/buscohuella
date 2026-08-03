'use server';

import {
  BIRTH_DATE_PRECISIONS,
  createPetSchema,
  PET_SEXES,
  PET_SIZES,
  PetDomainError,
  type BirthDatePrecision,
  type CreatePetRawInput,
  type PetSex,
  type PetSize,
} from '@buscohuella/pet-domain';
import { PetRepository } from '@buscohuella/pet-data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import {
  BreedFormError,
  resolveBreedFormData,
} from '../lib/breed-form-data';
import type { PetActionState } from '../types/pet-action-state';

function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function getNullableString(formData: FormData, name: string) {
  return getString(formData, name) || null;
}

function getOptionalNumber(formData: FormData, name: string) {
  const value = getString(formData, name);
  if (!value) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : Number.NaN;
}

function isOneOf<const T extends readonly string[]>(
  value: string,
  values: T,
): value is T[number] {
  return values.includes(value);
}

function getPetSex(formData: FormData): PetSex {
  const value = getString(formData, 'sex');
  return isOneOf(value, PET_SEXES) ? value : 'UNKNOWN';
}

function getPetSize(formData: FormData): PetSize {
  const value = getString(formData, 'size');
  return isOneOf(value, PET_SIZES) ? value : 'UNKNOWN';
}

function getBirthDatePrecision(
  formData: FormData,
  hasBirthDate: boolean,
): BirthDatePrecision {
  if (!hasBirthDate) return 'UNKNOWN';
  const value = getString(formData, 'birthDatePrecision');
  return isOneOf(value, BIRTH_DATE_PRECISIONS)
    ? value
    : 'EXACT';
}

function mapValidationErrors(
  issues: Array<{ path: PropertyKey[]; message: string }>,
) {
  const fieldErrors: Record<string, string> = {};

  for (const issue of issues) {
    const field = String(issue.path[0] ?? 'form');
    if (!fieldErrors[field]) {
      fieldErrors[field] = translateValidationMessage(
        field,
        issue.message,
      );
    }
  }

  return fieldErrors;
}

function translateValidationMessage(field: string, message: string) {
  const messages: Record<string, string> = {
    PET_BIRTH_DATE_FUTURE:
      'La fecha de nacimiento no puede ser futura.',
    PET_BIRTH_DATE_REQUIRED:
      'Indica una fecha o selecciona que no la conoces.',
    PET_MICROCHIP_WITHOUT_FLAG:
      'Marca que tiene microchip antes de introducir el número.',
    PET_PRIMARY_BREED_REQUIRED:
      'Selecciona una raza principal del catálogo.',
    PET_SECONDARY_BREED_REQUIRES_MIXED:
      'Marca que es un cruce antes de añadir otra raza.',
    PET_BREEDS_MUST_DIFFER:
      'Las dos razas deben ser distintas.',
  };

  return (
    messages[message] ??
    {
      speciesId: 'Selecciona un tipo de animal.',
      name: 'Introduce un nombre válido.',
      weightKg: 'Introduce un peso válido.',
      primaryColor: 'El color es demasiado largo.',
      description: 'La descripción es demasiado larga.',
      microchipNumber: 'Introduce un microchip válido.',
    }[field] ??
    'Revisa este campo.'
  );
}

export async function createPetAction(
  _previousState: PetActionState,
  formData: FormData,
): Promise<PetActionState> {
  const speciesId = Number(getString(formData, 'speciesId'));
  const birthDate = getNullableString(formData, 'birthDate');
  const hasMicrochip = formData.get('hasMicrochip') === 'on';

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      message: 'Tu sesión ha caducado. Inicia sesión de nuevo.',
    };
  }

  const repository = new PetRepository(supabase);

  let breedData;

  try {
    breedData = await resolveBreedFormData({
      repository,
      speciesId,
      formData,
    });
  } catch (error) {
    if (error instanceof BreedFormError) {
      return {
        status: 'error',
        message: 'Revisa la información sobre la raza.',
        fieldErrors: {
          [error.field]: error.userMessage,
        },
      };
    }
    throw error;
  }

  const rawInput: CreatePetRawInput = {
    speciesId,
    name: getString(formData, 'name'),
    ...breedData,
    sex: getPetSex(formData),
    birthDate,
    birthDatePrecision: getBirthDatePrecision(
      formData,
      Boolean(birthDate),
    ),
    size: getPetSize(formData),
    weightKg: getOptionalNumber(formData, 'weightKg'),
    primaryColor: getNullableString(formData, 'primaryColor'),
    secondaryColors: [],
    description: getNullableString(formData, 'description'),
    distinctiveFeatures: getNullableString(
      formData,
      'distinctiveFeatures',
    ),
    hasMicrochip,
    microchipNumber: hasMicrochip
      ? getNullableString(formData, 'microchipNumber')
      : null,
    identificationNotes: null,
    privateNotes: null,
    visibility: 'PUBLIC_WHEN_REPORTED',
  };

  const parsed = createPetSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Revisa los campos indicados.',
      fieldErrors: mapValidationErrors(parsed.error.issues),
    };
  }

  let petId: string;

  try {
    const pet = await repository.createPet(user.id, parsed.data);
    petId = pet.id;
  } catch (error) {
    logServerError('pet.create.failed', error, {
      userId: user.id,
      speciesId,
    });

    if (
      error instanceof PetDomainError &&
      error.code === 'PET_MICROCHIP_DUPLICATE'
    ) {
      return {
        status: 'error',
        message: 'Ese microchip ya está registrado.',
        fieldErrors: {
          microchipNumber: 'Comprueba el número introducido.',
        },
      };
    }

    return {
      status: 'error',
      message: 'No se ha podido registrar la mascota.',
    };
  }

  revalidatePath('/mis-mascotas');
  redirect(`/mis-mascotas/${petId}?created=1`);
}
