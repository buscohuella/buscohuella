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

import type { PetActionState } from '../types/pet-action-state';

function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function getNullableString(formData: FormData, name: string) {
  const value = getString(formData, name);
  return value || null;
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
    PET_BIRTH_DATE_PRECISION_INVALID:
      'Selecciona si la fecha es exacta o aproximada.',
    PET_MICROCHIP_WITHOUT_FLAG:
      'Marca que tiene microchip antes de introducir el número.',
  };

  if (messages[message]) return messages[message];

  const fallbacks: Record<string, string> = {
    speciesId: 'Selecciona un tipo de animal.',
    name: 'Introduce un nombre válido.',
    breed: 'La raza es demasiado larga.',
    birthDate: 'Introduce una fecha válida.',
    weightKg: 'Introduce un peso válido.',
    primaryColor: 'El color es demasiado largo.',
    description: 'La descripción es demasiado larga.',
    microchipNumber: 'Introduce un microchip válido.',
  };

  return fallbacks[field] ?? 'Revisa este campo.';
}

export async function createPetAction(
  _previousState: PetActionState,
  formData: FormData,
): Promise<PetActionState> {
  const birthDate = getNullableString(formData, 'birthDate');
  const hasMicrochip = formData.get('hasMicrochip') === 'on';

  const rawInput: CreatePetRawInput = {
    speciesId: Number(getString(formData, 'speciesId')),
    name: getString(formData, 'name'),
    breed: getNullableString(formData, 'breed'),
    isMixedBreed: formData.get('isMixedBreed') === 'on',
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

  let petId: string;

  try {
    const repository = new PetRepository(supabase);
    const pet = await repository.createPet(user.id, parsed.data);
    petId = pet.id;
  } catch (error) {
    logServerError('pet.create.failed', error, {
      userId: user.id,
      speciesId: parsed.data.speciesId,
    });

    if (error instanceof PetDomainError) {
      if (error.code === 'PET_MICROCHIP_DUPLICATE') {
        return {
          status: 'error',
          message: 'Ese microchip ya está registrado.',
          fieldErrors: {
            microchipNumber:
              'Comprueba el número o revisa tus mascotas existentes.',
          },
        };
      }

      if (error.code === 'PET_FORBIDDEN') {
        return {
          status: 'error',
          message:
            'No tienes permisos para registrar esta mascota.',
        };
      }
    }

    return {
      status: 'error',
      message:
        'No se ha podido registrar la mascota. Inténtalo de nuevo.',
    };
  }

  revalidatePath('/mis-mascotas');
  redirect(`/mis-mascotas/${petId}`);
}
