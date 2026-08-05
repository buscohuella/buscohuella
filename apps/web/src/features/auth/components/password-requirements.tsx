import {
  CheckCircle2,
  Circle,
  XCircle,
} from 'lucide-react';

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
  const requirements: Requirement[] = [
    {
      id: 'length',
      label: `Al menos ${passwordRequirements.minimumLength} caracteres`,
      met:
        password.length >=
        passwordRequirements.minimumLength,
    },
    {
      id: 'lowercase',
      label: 'Una letra minúscula',
      met: /[a-z]/.test(password),
    },
    {
      id: 'uppercase',
      label: 'Una letra mayúscula',
      met: /[A-Z]/.test(password),
    },
    {
      id: 'number',
      label: 'Un número',
      met: /[0-9]/.test(password),
    },
    {
      id: 'match',
      label: 'Las contraseñas coinciden',
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
        Requisitos de la contraseña
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
                    ? 'Cumplido: '
                    : requirement.failed
                      ? 'No cumplido: '
                      : 'Pendiente: '}
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
