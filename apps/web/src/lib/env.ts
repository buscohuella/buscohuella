const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    'Falta la variable de entorno NEXT_PUBLIC_SUPABASE_URL.',
  );
}

if (!supabasePublishableKey) {
  throw new Error(
    'Falta la variable de entorno NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
  );
}

export const env = {
  supabaseUrl,
  supabasePublishableKey,
} as const;
