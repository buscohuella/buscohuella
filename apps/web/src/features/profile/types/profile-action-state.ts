export interface ProfileActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: {
    fullName?: string;
    publicAlias?: string;
    municipality?: string;
    bio?: string;
  };
}

export const initialProfileActionState: ProfileActionState = {
  status: 'idle',
};
