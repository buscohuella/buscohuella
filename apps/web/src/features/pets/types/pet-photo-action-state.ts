export interface PetPhotoActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  photoId?: string;
}

export const initialPetPhotoActionState: PetPhotoActionState = {
  status: 'idle',
};
