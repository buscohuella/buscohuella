'use client';

import { Archive } from 'lucide-react';
import { useActionState } from 'react';

import { Button } from '@/components/ui/button';

import { archivePetAction } from '../actions/archive-pet';
import { initialPetActionState } from '../types/pet-action-state';

export function ArchivePetButton({
  petId,
  petName,
}: {
  petId: string;
  petName: string;
}) {
  const [state, formAction, isPending] = useActionState(
    archivePetAction,
    initialPetActionState,
  );

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

      <form
        action={formAction}
        onSubmit={(event) => {
          if (
            !window.confirm(
              `¿Quieres archivar a ${petName}? Podrás restaurarla más adelante.`,
            )
          ) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="petId" value={petId} />
        <Button
          type="submit"
          variant="danger"
          disabled={isPending}
        >
          <Archive className="size-5" aria-hidden="true" />
          {isPending ? 'Archivando...' : 'Archivar mascota'}
        </Button>
      </form>
    </div>
  );
}
