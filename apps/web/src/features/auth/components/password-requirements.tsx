import {
  CheckCircle2,
  Circle,
  XCircle,
} from 'lucide-react';

import { useTranslations } from '@/features/i18n/i18n-provider';

import { passwordRequirements } from '../lib/password-policy';

export interface PasswordRequirementsProps {
  password: string;
  confirmation: string;
}

interface Requirement {
  id: string;
  label: string;
  met: boolean;
  failed?: boolean;
}

export function PasswordRequirements({
  password,
  confirmation,
}: PasswordRequirementsProps) {
  const { t } = useTranslations('auth');
  const requirements: Requirement[] = [
    {
      id: 'length',
      label: t('passwordRequirements.length', { count: passwordRequirements.minimumLength }),
      met:
        password.length >=
        passwordRequirements.minimumLength,
    },
    {
      id: 'lowercase',
      label: t('passwordRequirements.lowercase'),
      met: /[a-z]/.test(password),
    },
    {
      id: 'uppercase',
      label: t('passwordRequirements.uppercase'),
      met: /[A-Z]/.test(password),
    },
    {
      id: 'number',
      label: t('passwordRequirements.number'),
      met: /[0-9]/.test(password),
    },
    {
      id: 'match',
      label: t('passwordRequirements.match'),
      met:
        confirmation.length > 0 &&
        password === confirmation,
      failed:
        confirmation.length > 0 &&
        password !== confirmation,
    },
  ];

  return (
    <div
      className="rounded-xl border border-border-soft bg-surface p-4"
      aria-labelledby="password-requirements-title"
    >
      <p
        id="password-requirements-title"
        className="text-sm font-semibold text-foreground"
      >
        {t('passwordRequirements.title')}
      </p>

      <ul className="mt-3 grid gap-2 text-sm">
        {requirements.map((requirement) => {
          const Icon = requirement.met
            ? CheckCircle2
            : requirement.failed
              ? XCircle
              : Circle;

          return (
            <li
              key={requirement.id}
              className="flex items-center gap-2"
            >
              <Icon
                className={
                  requirement.met
                    ? 'size-4 shrink-0 text-success'
                    : requirement.failed
                      ? 'size-4 shrink-0 text-danger'
                      : 'size-4 shrink-0 text-muted-foreground'
                }
                aria-hidden="true"
              />

              <span
                className={
                  requirement.met
                    ? 'text-foreground'
                    : requirement.failed
                      ? 'text-danger'
                      : 'text-muted-foreground'
                }
              >
                <span className="sr-only">
                  {requirement.met
                    ? t('passwordRequirements.met')
                    : requirement.failed
                      ? t('passwordRequirements.failed')
                      : t('passwordRequirements.pending')}
                </span>
                {requirement.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
