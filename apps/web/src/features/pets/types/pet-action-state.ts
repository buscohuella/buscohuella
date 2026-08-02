export interface PetActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Record<string, string>;
}

export const initialPetActionState: PetActionState = {
  status: 'idle',
};
