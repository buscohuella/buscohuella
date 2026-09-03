'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState, type InputHTMLAttributes } from 'react';

import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export interface FormFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  showPasswordLabel = 'Mostrar contraseña',
  hidePasswordLabel = 'Ocultar contraseña',
  type = 'text',
  ...props
}: FormFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy =
    [hintId, errorId].filter(Boolean).join(' ') ||
    undefined;

  return (
    <Field
      htmlFor={id}
      label={label}
      description={hint}
      descriptionId={hintId}
      error={error}
      errorId={errorId}
      required={required}
    >
      <div className="relative">
        <Input
          id={id}
          type={type === 'password' && passwordVisible ? 'text' : type}
          required={required}
          hasError={Boolean(error)}
          aria-describedby={describedBy}
          className={type === 'password' ? 'pr-12' : undefined}
          {...props}
        />
        {type === 'password' ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
            onClick={() => setPasswordVisible((visible) => !visible)}
            aria-label={passwordVisible ? hidePasswordLabel : showPasswordLabel}
            aria-pressed={passwordVisible}
          >
            {passwordVisible ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
          </button>
        ) : null}
      </div>
    </Field>
  );
}
