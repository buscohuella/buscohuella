import type { PetActionState } from '../types/pet-action-state';

export function hasSubmittedSpecies(state: PetActionState): boolean {
  return Object.prototype.hasOwnProperty.call(state, 'speciesId');
}

export function toPetSpeciesIdOrNull(value: number): number | null {
  return Number.isSafeInteger(value) && value > 0 ? value : null;
}

/**
 * Uses the action result until the user makes a later selection. This keeps the
 * native select and BreedFields on the same value without waiting for an effect.
 */
export function resolvePetFormSpeciesId({
  actionState,
  actionStateAtLocalSelection,
  localSpeciesId,
}: {
  actionState: PetActionState;
  actionStateAtLocalSelection: PetActionState;
  localSpeciesId: number | null;
}): number | null {
  if (
    hasSubmittedSpecies(actionState)
    && actionStateAtLocalSelection !== actionState
  ) {
    return actionState.speciesId ?? null;
  }

  return localSpeciesId;
}
