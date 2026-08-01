export interface AuthActionState {
  status: 'idle' | 'error' | 'success';
  message?: string;
  fieldErrors?: Partial<
    Record<
      | 'fullName'
      | 'email'
      | 'password'
      | 'confirmPassword'
      | 'acceptTerms',
      string
    >
  >;
}

export const initialAuthActionState: AuthActionState = {
  status: 'idle',
};
