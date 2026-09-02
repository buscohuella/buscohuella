'use client';

import { useState } from 'react';

import { createClient } from '@/services/supabase/client';

function GoogleMark() {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      role="img"
      aria-label="Google"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.72-.06-1.42-.18-2.09H12v3.96h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.26Z"
      />
      <path
        fill="#34A853"
        d="M12 21.72c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.72Z"
      />
      <path
        fill="#FBBC05"
        d="M6.54 13.8a5.86 5.86 0 0 1 0-3.6V7.67H3.3a9.73 9.73 0 0 0 0 8.66l3.24-2.53Z"
      />
      <path
        fill="#EA4335"
        d="M12 6.17c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.25 14.63 2.28 12 2.28a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 7.89 9.46 6.17 12 6.17Z"
      />
    </svg>
  );
}

export function GoogleAuthButton({
  label,
  pendingLabel,
  errorLabel,
  next,
}: {
  label: string;
  pendingLabel: string;
  errorLabel: string;
  next?: string;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    setPending(true);
    setError(false);

    const callbackUrl = new URL('/auth/callback', window.location.origin);
    if (next) callbackUrl.searchParams.set('next', next);

    const { error: authError } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl.toString(),
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (authError) {
      setPending(false);
      setError(true);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg border border-border bg-surface-elevated px-4 text-sm font-semibold text-foreground hover:bg-surface-hover disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
      >
        <GoogleMark />
        {pending ? pendingLabel : label}
      </button>
      {error ? <p className="text-sm text-danger" role="alert">{errorLabel}</p> : null}
    </div>
  );
}
