'use client';

import { RotateCcw } from 'lucide-react';
import { useActionState, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

import { restorePetAction } from '../actions/restore-pet';
import { initialPetActionState } from '../types/pet-action-state';

export function RestorePetButton({
  petId,
  petName,
}: {
  petId: string;
  petName: string;
}) {
  const [state, formAction, isPending] = useActionState(
    restorePetAction,
    initialPetActionState,
  );
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="space-y-3">
      {state.message ? (
        <p
          role={state.status === 'error' ? 'alert' : 'status'}
          className="text-sm font-medium text-danger"
        >
          {state.message}
        </p>
      ) : null}

      <form ref={formRef} action={formAction}>
        <input type="hidden" name="petId" value={petId} />
        <Button
          type="button"
          disabled={isPending}
          onClick={() => setIsOpen(true)}
        >
          <RotateCcw className="size-5" aria-hidden="true" />
          Restaurar mascota
        </Button>
      </form>

      <ConfirmationDialog
        open={isOpen}
        title={`Restaurar a ${petName}`}
        description="La mascota volverá a aparecer entre tus fichas activas y podrás editar sus datos."
        confirmLabel="Restaurar mascota"
        isPending={isPending}
        icon={<RotateCcw className="size-5" aria-hidden="true" />}
        onCancel={() => setIsOpen(false)}
        onConfirm={() => formRef.current?.requestSubmit()}
      />
    </div>
  );
}
