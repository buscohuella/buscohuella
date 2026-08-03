'use client';

import type {
  Pet,
  PetBreed,
  PetSpecies,
} from '@buscohuella/pet-domain';
import { useActionState } from 'react';

import { updatePetAction } from '../actions/update-pet';
import { initialPetActionState } from '../types/pet-action-state';
import { PetFormFields } from './pet-form-fields';

export function EditPetForm({
  pet,
  species,
  breeds,
}: {
  pet: Pet;
  species: PetSpecies[];
  breeds: PetBreed[];
}) {
  const [state, formAction, isPending] = useActionState(
    updatePetAction,
    initialPetActionState,
  );

  return (
    <PetFormFields
      mode="edit"
      action={formAction}
      state={state}
      isPending={isPending}
      species={species}
      breeds={breeds}
      pet={pet}
    />
  );
}
