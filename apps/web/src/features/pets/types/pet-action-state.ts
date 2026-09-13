export interface PetActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
  speciesId?: number | null;
}

export const initialPetActionState: PetActionState = {
  status: 'idle',
};
