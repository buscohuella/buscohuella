'use client';

import type { ReactNode } from 'react';
import { useActionState } from 'react';
import Link from 'next/link';
import { ExternalLink, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { updateProfileAction } from '../actions/update-profile';
import { initialProfileActionState } from '../types/profile-action-state';
import type { UserProfile } from '../types/profile';

export function ProfileForm({
  profile,
  email,
}: {
  profile: UserProfile;
  email: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialProfileActionState,
  );

  const publicProfileError = state.fieldErrors?.isPublic;

  return (
    <form action={formAction} className="space-y-7">
      {state.message && (
        <div
          role={state.status === 'error' ? 'alert' : 'status'}
          className={
            state.status === 'error'
              ? 'rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm font-medium text-danger'
              : 'rounded-lg border border-success/30 bg-primary-soft p-4 text-sm font-medium text-success'
          }
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          id="profile-full-name"
          label="Nombre"
          error={state.fieldErrors?.fullName}
        >
          <Input
            id="profile-full-name"
            name="fullName"
            defaultValue={profile.fullName}
            maxLength={120}
            autoComplete="name"
            hasError={Boolean(state.fieldErrors?.fullName)}
            required
          />
        </Field>

        <Field
          id="profile-email"
          label="Correo electrónico"
          hint="El correo se gestiona desde la cuenta y no forma parte del perfil público."
        >
          <Input
            id="profile-email"
            value={email}
            readOnly
            disabled
          />
        </Field>

        <Field
          id="profile-public-alias"
          label="Alias público"
          hint="Entre 3 y 30 caracteres. Solo minúsculas, números, guion y guion bajo."
          error={state.fieldErrors?.publicAlias}
        >
          <div className="flex rounded-lg">
            <span className="flex min-h-12 items-center rounded-l-lg border border-r-0 border-border bg-surface px-3 text-sm text-muted-foreground">
              /u/
            </span>
            <Input
              id="profile-public-alias"
              name="publicAlias"
              defaultValue={profile.publicAlias}
              maxLength={30}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              hasError={Boolean(state.fieldErrors?.publicAlias)}
              className="rounded-l-none"
            />
          </div>
        </Field>

        <Field
          id="profile-municipality"
          label="Municipio"
          hint="Usa una zona aproximada, nunca tu dirección."
          error={state.fieldErrors?.municipality}
        >
          <Input
            id="profile-municipality"
            name="municipality"
            defaultValue={profile.municipality}
            maxLength={120}
            autoComplete="address-level2"
            hasError={Boolean(state.fieldErrors?.municipality)}
          />
        </Field>
      </div>

      <Field
        id="profile-bio"
        label="Biografía"
        hint="Máximo 500 caracteres. Evita datos personales o de contacto."
        error={state.fieldErrors?.bio}
      >
        <textarea
          id="profile-bio"
          name="bio"
          defaultValue={profile.bio}
          maxLength={500}
          rows={5}
          aria-invalid={Boolean(state.fieldErrors?.bio) || undefined}
          className="w-full resize-y rounded-lg border border-border bg-surface-elevated px-3 py-3 text-base text-foreground placeholder:text-subtle-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15"
        />
      </Field>

      <div
        className={cn(
          'rounded-xl border bg-surface p-5 transition-colors',
          publicProfileError
            ? 'border-danger bg-danger/5'
            : 'border-border-soft',
        )}
      >
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="isPublic"
            defaultChecked={profile.isPublic}
            className="mt-1 size-5 accent-[var(--primary)]"
            aria-invalid={Boolean(publicProfileError) || undefined}
            aria-describedby="profile-public-description profile-public-error"
          />
          <span>
            <span
              className={cn(
                'block font-semibold',
                publicProfileError && 'text-danger',
              )}
            >
              Activar perfil público
            </span>
            <span
              id="profile-public-description"
              className="mt-1 block text-sm text-muted-foreground"
            >
              Mostrará únicamente alias, avatar, municipio, biografía y fecha
              de alta. El correo y tus datos privados nunca se publicarán.
            </span>
          </span>
        </label>

        {publicProfileError && (
          <p
            id="profile-public-error"
            className="mt-3 text-sm font-medium text-danger"
          >
            {publicProfileError}
          </p>
        )}

        {profile.isPublic && profile.publicAlias && (
          <Link
            href={`/u/${profile.publicAlias}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            Ver mi perfil público
            <ExternalLink className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          <Save className="size-5" aria-hidden="true" />
          {isPending ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      {children}

      {hint && (
        <p className="mt-2 text-sm text-muted-foreground">
          {hint}
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
