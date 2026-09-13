'use server';

import {
  BIRTH_DATE_PRECISIONS,
  PET_LIMITS,
  PET_SEXES,
  PET_SIZES,
  PetDomainError,
  canEditPet,
  isPetSpeciesAllowed,
  isPetWeightValid,
  parseOptionalWeight,
  updatePetSchema,
  type BirthDatePrecision,
  type PetSex,
  type PetSize,
  type UpdatePetInput,
} from '@buscohuella/pet-domain';
import { PetRepository } from '@buscohuella/pet-data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { getServerTranslator } from '@/features/i18n/server';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import {
  BreedFormError,
  resolveBreedFormData,
} from '../lib/breed-form-data';
import { toPetSpeciesIdOrNull } from '../lib/resolve-pet-form-species';
import type { PetActionState } from '../types/pet-action-state';

function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function getNullableString(formData: FormData, name: string) {
  return getString(formData, name) || null;
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
  translate: (key: string) => string,
) {
  const fieldErrors: Record<string, string> = {};
  const codeKeys: Record<string, string> = {
    PET_NAME_CHARACTERS_INVALID: 'pets.validation.nameCharacters',
    PET_NAME_REQUIRES_LETTER_OR_NUMBER: 'pets.validation.nameCharacters',
    PET_BIRTH_DATE_FUTURE: 'pets.validation.birthFuture',
    PET_BIRTH_DATE_REQUIRED: 'pets.validation.birthRequired',
    PET_MICROCHIP_WITHOUT_FLAG: 'pets.validation.microchipFlag',
    PET_PRIMARY_BREED_REQUIRED: 'pets.validation.primaryBreed',
    PET_SECONDARY_BREED_REQUIRES_MIXED: 'pets.validation.secondaryMixed',
    PET_BREEDS_MUST_DIFFER: 'pets.validation.breedsDiffer',
    PET_WEIGHT_TOO_HIGH: 'pets.validation.weightTooHigh',
  };
  const fieldKeys: Record<string, string> = {
    speciesId: 'pets.validation.species',
    name: 'pets.validation.name',
    weightKg: 'pets.validation.weight',
    primaryColor: 'pets.validation.color',
    description: 'pets.validation.description',
    microchipNumber: 'pets.validation.microchip',
  };

  for (const issue of issues) {
    const field = String(issue.path[0] ?? 'form');
    if (!fieldErrors[field]) {
      fieldErrors[field] = translate(
        codeKeys[issue.message] ?? fieldKeys[field] ?? 'pets.validation.field',
      );
    }
  }
  return fieldErrors;
}

export async function updatePetAction(
  _previousState: PetActionState,
  formData: FormData,
): Promise<PetActionState> {
  const { translate } = await getServerTranslator();
  const petId = getString(formData, 'petId');

  if (!petId) {
    return {
      status: 'error',
      message: translate('pets.result.petMissing'),
      speciesId: null,
    };
  }

  const speciesId = Number(getString(formData, 'speciesId'));
  const birthDate = getNullableString(formData, 'birthDate');
  const hasMicrochip = formData.get('hasMicrochip') === 'on';
  const weightKg = parseOptionalWeight(getString(formData, 'weightKg'));

  if (weightKg !== null && !isPetWeightValid(weightKg)) {
    return {
      status: 'error',
      message: translate('pets.validation.review'),
      speciesId: toPetSpeciesIdOrNull(speciesId),
      fieldErrors: {
        weightKg: translate(
          Number.isFinite(weightKg) && weightKg > PET_LIMITS.weightMaxKg
            ? 'pets.validation.weightTooHigh'
            : 'pets.validation.weight',
        ),
      },
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      message: translate('pets.result.sessionExpired'),
      speciesId: toPetSpeciesIdOrNull(speciesId),
    };
  }

  const repository = new PetRepository(supabase);

  try {
    const currentPet = await repository.getOwnPetById(petId);

    if (!canEditPet(currentPet.status)) {
      return {
        status: 'error',
        message: translate('pets.result.notAvailable'),
        speciesId: toPetSpeciesIdOrNull(speciesId),
      };
    }

    const availableSpecies = await repository.listEnabledSpecies({
      mvpOnly: true,
    });

    if (!isPetSpeciesAllowed(availableSpecies, speciesId)) {
      return {
        status: 'error',
        message: translate('pets.validation.review'),
        speciesId: toPetSpeciesIdOrNull(speciesId),
        fieldErrors: {
          speciesId: translate('pets.validation.species'),
        },
      };
    }

    const breedData = await resolveBreedFormData({
      repository,
      speciesId,
      formData,
      currentLegacyBreed: currentPet.breed,
    });

    const rawInput: UpdatePetInput = {
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
      weightKg,
      primaryColor: getNullableString(formData, 'primaryColor'),
      description: getNullableString(formData, 'description'),
      distinctiveFeatures: getNullableString(
        formData,
        'distinctiveFeatures',
      ),
      hasMicrochip,
      microchipNumber: hasMicrochip
        ? getNullableString(formData, 'microchipNumber')
        : null,
    };

    const parsed = updatePetSchema.safeParse(rawInput);

    if (!parsed.success) {
      return {
        status: 'error',
        message: translate('pets.validation.review'),
        speciesId: toPetSpeciesIdOrNull(speciesId),
        fieldErrors: mapValidationErrors(parsed.error.issues, translate),
      };
    }

    await repository.updatePet(petId, parsed.data);
  } catch (error) {
    if (error instanceof BreedFormError) {
      return {
        status: 'error',
        message: translate('pets.validation.breedReview'),
        speciesId: toPetSpeciesIdOrNull(speciesId),
        fieldErrors: {
          [error.field]: error.userMessage,
        },
      };
    }

    logServerError('pet.update.failed', error, {
      userId: user.id,
      petId,
      speciesId,
    });

    if (error instanceof PetDomainError) {
      if (error.code === 'PET_MICROCHIP_DUPLICATE') {
        return {
          status: 'error',
          message: translate('pets.result.microchipDuplicate'),
          speciesId: toPetSpeciesIdOrNull(speciesId),
          fieldErrors: {
            microchipNumber: translate('pets.result.microchipCheck'),
          },
        };
      }

      if (error.code === 'PET_NOT_FOUND') {
        return {
          status: 'error',
          message: translate('pets.result.notAvailable'),
          speciesId: toPetSpeciesIdOrNull(speciesId),
        };
      }
    }

    return {
      status: 'error',
      message: translate('pets.result.updateError'),
      speciesId: toPetSpeciesIdOrNull(speciesId),
    };
  }

  revalidatePath('/mis-mascotas');
  revalidatePath(`/mis-mascotas/${petId}`);
  redirect(`/mis-mascotas/${petId}?updated=1`);
}
