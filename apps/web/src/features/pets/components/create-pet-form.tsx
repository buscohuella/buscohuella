'use client';

import type {
  PetBreed,
  PetSpecies,
} from '@buscohuella/pet-domain';
import { useActionState } from 'react';

import { createPetAction } from '../actions/create-pet';
import { initialPetActionState } from '../types/pet-action-state';
import { PetFormFields } from './pet-form-fields';

export function CreatePetForm({
  species,
  breeds,
}: {
  species: PetSpecies[];
  breeds: PetBreed[];
}) {
  const [state, formAction, isPending] = useActionState(
    createPetAction,
    initialPetActionState,
  );

  return (
    <PetFormFields
      mode="create"
      action={formAction}
      state={state}
      isPending={isPending}
      species={species}
      breeds={breeds}
    />
  );
}
