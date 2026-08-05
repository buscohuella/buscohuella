import type { InputHTMLAttributes } from 'react';

import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export interface FormFieldProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  ...props
}: FormFieldProps) {
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
      <Input
        id={id}
        required={required}
        hasError={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      />
    </Field>
  );
}
