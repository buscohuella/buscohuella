export const passwordRequirements = {
  minimumLength: 8,
} as const;

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (password.length < passwordRequirements.minimumLength) {
    errors.push(
      `Debe tener al menos ${passwordRequirements.minimumLength} caracteres.`,
    );
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Debe incluir al menos una letra minúscula.');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Debe incluir al menos una letra mayúscula.');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Debe incluir al menos un número.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const passwordHint =
  'Usa 8 caracteres como mínimo, con mayúscula, minúscula y número.';
