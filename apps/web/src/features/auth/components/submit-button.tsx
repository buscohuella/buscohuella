'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import { LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

export interface SubmitButtonProps {
  children: ReactNode;
  pendingText: string;
}

export function SubmitButton({
  children,
  pendingText,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" fullWidth disabled={pending}>
      {pending && (
        <LoaderCircle
          className="size-5 animate-spin"
          aria-hidden="true"
        />
      )}
      {pending ? pendingText : children}
    </Button>
  );
}
