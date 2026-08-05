'use client';

import type { ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

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
    <Button
      type="submit"
      size="lg"
      fullWidth
      isLoading={pending}
      loadingText={pendingText}
    >
      {children}
    </Button>
  );
}
