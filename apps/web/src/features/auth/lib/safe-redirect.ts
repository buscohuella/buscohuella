const INTERNAL_ORIGIN = 'https://buscohuella.invalid';

export function getSafeInternalPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return null;
  }

  try {
    const resolved = new URL(value, INTERNAL_ORIGIN);

    return resolved.origin === INTERNAL_ORIGIN ? value : null;
  } catch {
    return null;
  }
}

export function getPostLoginRedirectPath(value: string | null) {
  return getSafeInternalPath(value) ?? '/inicio?login=success';
}
