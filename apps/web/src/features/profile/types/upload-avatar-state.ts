export type UploadAvatarState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

export const initialUploadAvatarState: UploadAvatarState = {
  status: 'idle',
};
