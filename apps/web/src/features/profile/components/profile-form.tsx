'use client';

import {
  ExternalLink,
  Save,
} from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import {
  FormErrorSummary,
  type FormErrorItem,
} from '@/components/ui/form-error-summary';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/features/i18n/i18n-provider';
import { cn } from '@/lib/utils';

import { updateProfileAction } from '../actions/update-profile';
import { AvatarForm } from './avatar-form';
import { initialProfileActionState } from '../types/profile-action-state';
import type { UserProfile } from '../types/profile';

export function ProfileForm({
  profile,
  email,
}: {
  profile: UserProfile;
  email: string;
}) {
  const { t } = useTranslations('profile');
  const [state, formAction, isPending] =
    useActionState(
      updateProfileAction,
      initialProfileActionState,
    );

  const formErrors: FormErrorItem[] = [];

  if (state.fieldErrors?.fullName) {
    formErrors.push({
      id: 'full-name',
      fieldId: 'profile-full-name',
      message: state.fieldErrors.fullName,
    });
  }

  if (state.fieldErrors?.publicAlias) {
    formErrors.push({
      id: 'public-alias',
      fieldId: 'profile-public-alias',
      message:
        state.fieldErrors.publicAlias,
    });
  }

  if (state.fieldErrors?.municipality) {
    formErrors.push({
      id: 'municipality',
      fieldId: 'profile-municipality',
      message:
        state.fieldErrors.municipality,
    });
  }

  if (state.fieldErrors?.bio) {
    formErrors.push({
      id: 'bio',
      fieldId: 'profile-bio',
      message: state.fieldErrors.bio,
    });
  }

  if (state.fieldErrors?.isPublic) {
    formErrors.push({
      id: 'is-public',
      fieldId: 'profile-is-public',
      message: state.fieldErrors.isPublic,
    });
  }

  const hasFieldErrors =
    formErrors.length > 0;

  return (
    <div className="space-y-7">
      <AvatarForm avatarUrl={profile.avatarUrl} />
      <form action={formAction} className="space-y-7">
      {!hasFieldErrors && state.message ? (
        <Alert
          variant={
            state.status === 'error'
              ? 'danger'
              : 'success'
          }
        >
          {state.message}
        </Alert>
      ) : null}

      <FormErrorSummary
        errors={formErrors}
        title={
          state.message ??
          t('validation.review')
        }
      />

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          htmlFor="profile-full-name"
          label={t('form.fullName.label')}
          error={state.fieldErrors?.fullName}
          errorId="profile-full-name-error"
          required
        >
          <Input
            id="profile-full-name"
            name="fullName"
            defaultValue={profile.fullName}
            maxLength={120}
            autoComplete="name"
            hasError={Boolean(
              state.fieldErrors?.fullName,
            )}
            aria-describedby={
              state.fieldErrors?.fullName
                ? 'profile-full-name-error'
                : undefined
            }
            required
          />
        </Field>

        <Field
          htmlFor="profile-email"
          label={t('form.email.label')}
          description={t('form.email.hint')}
          descriptionId="profile-email-hint"
        >
          <Input
            id="profile-email"
            value={email}
            readOnly
            disabled
            aria-describedby="profile-email-hint"
          />
        </Field>

        <Field
          htmlFor="profile-public-alias"
          label={t('form.alias.label')}
          description={t('form.alias.hint')}
          descriptionId="profile-public-alias-hint"
          error={
            state.fieldErrors?.publicAlias
          }
          errorId="profile-public-alias-error"
        >
          <div className="flex rounded-lg">
            <span className="flex min-h-12 items-center rounded-l-lg border border-r-0 border-border bg-surface px-3 text-sm text-muted-foreground">
              /u/
            </span>
            <Input
              id="profile-public-alias"
              name="publicAlias"
              defaultValue={
                profile.publicAlias
              }
              maxLength={30}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              hasError={Boolean(
                state.fieldErrors?.publicAlias,
              )}
              aria-describedby={[
                'profile-public-alias-hint',
                state.fieldErrors?.publicAlias
                  ? 'profile-public-alias-error'
                  : null,
              ]
                .filter(Boolean)
                .join(' ')}
              className="rounded-l-none"
            />
          </div>
        </Field>

        <Field
          htmlFor="profile-municipality"
          label={t(
            'form.municipality.label',
          )}
          description={t(
            'form.municipality.hint',
          )}
          descriptionId="profile-municipality-hint"
          error={
            state.fieldErrors?.municipality
          }
          errorId="profile-municipality-error"
        >
          <Input
            id="profile-municipality"
            name="municipality"
            defaultValue={
              profile.municipality
            }
            maxLength={120}
            autoComplete="address-level2"
            hasError={Boolean(
              state.fieldErrors?.municipality,
            )}
            aria-describedby={[
              'profile-municipality-hint',
              state.fieldErrors?.municipality
                ? 'profile-municipality-error'
                : null,
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </Field>
      </div>

      <Field
        htmlFor="profile-bio"
        label={t('form.bio.label')}
        description={t('form.bio.hint')}
        descriptionId="profile-bio-hint"
        error={state.fieldErrors?.bio}
        errorId="profile-bio-error"
      >
        <Textarea
          id="profile-bio"
          name="bio"
          defaultValue={profile.bio}
          maxLength={500}
          rows={5}
          hasError={Boolean(
            state.fieldErrors?.bio,
          )}
          aria-describedby={[
            'profile-bio-hint',
            state.fieldErrors?.bio
              ? 'profile-bio-error'
              : null,
          ]
            .filter(Boolean)
            .join(' ')}
        />
      </Field>

      <div
        className={cn(
          'rounded-xl border bg-surface p-5 transition-colors',
          state.fieldErrors?.isPublic
            ? 'border-danger bg-danger/5'
            : 'border-border-soft',
        )}
      >
        <Checkbox
          id="profile-is-public"
          name="isPublic"
          defaultChecked={profile.isPublic}
          label={t('form.public.label')}
          description={t(
            'form.public.description',
          )}
          aria-invalid={
            Boolean(
              state.fieldErrors?.isPublic,
            ) || undefined
          }
          aria-describedby={
            state.fieldErrors?.isPublic
              ? 'profile-public-error'
              : undefined
          }
        />

        {state.fieldErrors?.isPublic ? (
          <p
            id="profile-public-error"
            className="mt-3 text-sm font-medium text-danger"
            role="alert"
          >
            {state.fieldErrors.isPublic}
          </p>
        ) : null}

        {profile.isPublic &&
        profile.publicAlias ? (
          <Link
            href={`/u/${profile.publicAlias}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          >
            {t('form.public.view')}
            <ExternalLink
              className="size-4"
              aria-hidden="true"
            />
          </Link>
        ) : null}
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          isLoading={isPending}
          loadingText={t('form.saving')}
        >
          <Save
            className="size-5"
            aria-hidden="true"
          />
          {t('form.save')}
        </Button>
      </div>
      </form>
    </div>
  );
}
