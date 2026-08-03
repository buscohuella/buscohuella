import {
  BREED_KNOWLEDGE_VALUES,
  type BreedKnowledge,
} from '@buscohuella/pet-domain';
import type { PetRepository } from '@buscohuella/pet-data';

export class BreedFormError extends Error {
  constructor(
    public readonly field: string,
    public readonly userMessage: string,
  ) {
    super(userMessage);
  }
}

function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function getNullableId(formData: FormData, name: string) {
  const value = getString(formData, name);
  if (!value) return null;

  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
}

function getKnowledge(formData: FormData): BreedKnowledge {
  const value = getString(formData, 'breedKnowledge');

  return BREED_KNOWLEDGE_VALUES.includes(
    value as BreedKnowledge,
  )
    ? (value as BreedKnowledge)
    : 'UNKNOWN';
}

export async function resolveBreedFormData({
  repository,
  speciesId,
  formData,
  currentLegacyBreed = null,
}: {
  repository: PetRepository;
  speciesId: number;
  formData: FormData;
  currentLegacyBreed?: string | null;
}) {
  const breedKnowledge = getKnowledge(formData);
  const primaryBreedId = getNullableId(
    formData,
    'primaryBreedId',
  );
  const secondaryBreedId = getNullableId(
    formData,
    'secondaryBreedId',
  );
  const isMixedBreed =
    breedKnowledge === 'MIXED_UNKNOWN' ||
    formData.get('isMixedBreed') === 'on';

  if (breedKnowledge !== 'KNOWN') {
    return {
      breedKnowledge,
      primaryBreedId: null,
      secondaryBreedId: null,
      isMixedBreed,
      breed:
        formData.get('preserveLegacyBreed') === '1'
          ? currentLegacyBreed
          : null,
    };
  }

  const breeds = await repository.listEnabledBreeds(speciesId);
  const primary = breeds.find(
    (breed) => breed.id === primaryBreedId,
  );
  const secondary = breeds.find(
    (breed) => breed.id === secondaryBreedId,
  );

  if (!primary) {
    throw new BreedFormError(
      'primaryBreedId',
      'Selecciona una raza principal del catálogo.',
    );
  }

  if (secondaryBreedId && !secondary) {
    throw new BreedFormError(
      'secondaryBreedId',
      'Selecciona una segunda raza válida.',
    );
  }

  if (secondary && !isMixedBreed) {
    throw new BreedFormError(
      'secondaryBreedId',
      'Marca que es un cruce antes de añadir otra raza.',
    );
  }

  if (secondary?.id === primary.id) {
    throw new BreedFormError(
      'secondaryBreedId',
      'La segunda raza debe ser distinta de la principal.',
    );
  }

  return {
    breedKnowledge,
    primaryBreedId: primary.id,
    secondaryBreedId: secondary?.id ?? null,
    isMixedBreed,
    breed: secondary
      ? `${primary.canonicalName} + ${secondary.canonicalName}`
      : primary.canonicalName,
  };
}
