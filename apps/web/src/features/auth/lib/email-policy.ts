export const emailInputPattern =
  String.raw`^[^\s@]+@[^\s@]+\.[A-Za-z]{2,63}$`;

export interface EmailValidationResult {
  isValid: boolean;
  normalizedEmail: string;
  error?: string;
}

export function validateEmail(
  input: string,
): EmailValidationResult {
  const normalizedEmail = input.trim().toLowerCase();

  if (!normalizedEmail) {
    return {
      isValid: false,
      normalizedEmail,
      error: 'Introduce tu correo electrónico.',
    };
  }

  if (normalizedEmail.length > 254) {
    return {
      isValid: false,
      normalizedEmail,
      error: 'El correo electrónico es demasiado largo.',
    };
  }

  const parts = normalizedEmail.split('@');

  if (parts.length !== 2) {
    return {
      isValid: false,
      normalizedEmail,
      error:
        'Introduce un correo válido, por ejemplo nombre@dominio.com.',
    };
  }

  const [localPart, domain] = parts;

  if (
    !localPart ||
    localPart.length > 64 ||
    localPart.startsWith('.') ||
    localPart.endsWith('.') ||
    localPart.includes('..') ||
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(
      localPart,
    )
  ) {
    return {
      isValid: false,
      normalizedEmail,
      error:
        'La parte anterior a @ del correo no es válida.',
    };
  }

  if (
    !domain ||
    domain.length > 253 ||
    !domain.includes('.') ||
    domain.includes('..')
  ) {
    return {
      isValid: false,
      normalizedEmail,
      error:
        'El dominio del correo debe incluir una extensión, por ejemplo .com o .es.',
    };
  }

  const labels = domain.split('.');

  const hasInvalidLabel = labels.some(
    (label) =>
      !label ||
      label.length > 63 ||
      label.startsWith('-') ||
      label.endsWith('-') ||
      !/^[a-z0-9-]+$/i.test(label),
  );

  if (hasInvalidLabel) {
    return {
      isValid: false,
      normalizedEmail,
      error: 'El dominio del correo no es válido.',
    };
  }

  const topLevelDomain = labels.at(-1) ?? '';

  if (
    !/^(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i.test(
      topLevelDomain,
    )
  ) {
    return {
      isValid: false,
      normalizedEmail,
      error:
        'La extensión del correo no es válida.',
    };
  }

  return {
    isValid: true,
    normalizedEmail,
  };
}
