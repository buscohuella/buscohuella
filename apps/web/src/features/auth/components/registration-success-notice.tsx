'use client';

import Link from 'next/link';

import { Alert } from '@/components/ui/alert';
import { useTranslations } from '@/features/i18n/i18n-provider';

import { useRegistrationDraft } from '../hooks/use-registration-draft';
import {
  buildRegistrationEditPath,
  registrationDraftStorageKey,
} from '../lib/registration-draft';

const actionClassName =
  'inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface-elevated px-4 text-sm font-semibold text-foreground transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft';

export function RegistrationSuccessNotice({
  next,
}: {
  next?: string;
}) {
  const { t } = useTranslations('auth');
  const draft = useRegistrationDraft();

  function clearRegistrationDraft() {
    try {
      window.sessionStorage.removeItem(registrationDraftStorageKey);
    } catch {
      // Storage can be unavailable without blocking authentication.
    }
  }

  const editPath = buildRegistrationEditPath(draft?.next ?? next ?? null);

  return (
    <Alert
      variant="success"
      title={t('registrationSuccess.title')}
      className="mb-5"
    >
      <div className="space-y-3">
        <p className="break-words">
          {draft
            ? t('registrationSuccess.checkEmail', {
                email: draft.email,
              })
            : t('registrationSuccess.checkEmailFallback')}
        </p>
        <p>{t('registrationSuccess.newAccount')}</p>
        <p>{t('registrationSuccess.checkAddress')}</p>
        <p>{t('registrationSuccess.existingAccount')}</p>

        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap">
          <Link href={editPath} className={actionClassName}>
            {t('registrationSuccess.changeEmail')}
          </Link>
          <a
            href="#email"
            className={actionClassName}
            onClick={clearRegistrationDraft}
          >
            {t('registrationSuccess.login')}
          </a>
          <Link
            href="/recuperar-contrasena"
            className={actionClassName}
            onClick={clearRegistrationDraft}
          >
            {t('registrationSuccess.recover')}
          </Link>
        </div>
      </div>
    </Alert>
  );
}
