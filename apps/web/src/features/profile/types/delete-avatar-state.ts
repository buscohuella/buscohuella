export type DeleteAvatarState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

export const initialDeleteAvatarState: DeleteAvatarState = { status: 'idle' };
