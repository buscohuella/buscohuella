import { headers } from 'next/headers';

export async function getRequestOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get('origin');

  if (origin) {
    return origin;
  }

  const host =
    headerStore.get('x-forwarded-host') ?? headerStore.get('host');

  if (!host) {
    throw new Error('No se pudo determinar el origen de la aplicación.');
  }

  const protocol = headerStore.get('x-forwarded-proto') ?? 'http';

  return `${protocol}://${host}`;
}

export function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}
