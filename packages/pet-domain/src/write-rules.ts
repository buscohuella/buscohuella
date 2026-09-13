import type { PetSpecies, PetStatus } from './types.js';

export function isPetSpeciesAllowed(
  species: Pick<PetSpecies, 'id' | 'isEnabled' | 'mvpEnabled'>[],
  speciesId: number,
): boolean {
  return species.some(
    (item) =>
      item.id === speciesId && item.isEnabled && item.mvpEnabled,
  );
}

export function canEditPet(status: PetStatus): boolean {
  return status === 'ACTIVE';
}
