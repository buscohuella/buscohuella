'use client';

import { RotateCcw } from 'lucide-react';
import {
  useActionState,
  useRef,
  useState,
} from 'react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useTranslations } from '@/features/i18n/i18n-provider';

import { restorePetAction } from '../actions/restore-pet';
import { initialPetActionState } from '../types/pet-action-state';

export function RestorePetButton({
  petId,
  petName,
}: {
  petId: string;
  petName: string;
}) {
  const { t } = useTranslations('pets');
  const [state, formAction, isPending] =
    useActionState(
      restorePetAction,
      initialPetActionState,
    );
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="space-y-3">
      {state.message ? (
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

      <form ref={formRef} action={formAction}>
        <input
          type="hidden"
          name="petId"
          value={petId}
        />
        <Button
          type="button"
          isLoading={isPending}
          loadingText={t(
            'management.restoring',
          )}
          onClick={() => setIsOpen(true)}
        >
          <RotateCcw
            className="size-5"
            aria-hidden="true"
          />
          {t('management.restore')}
        </Button>
      </form>

      <ConfirmationDialog
        open={isOpen}
        title={t(
          'management.restoreDialogTitle',
          { name: petName },
        )}
        description={t(
          'management.restoreDialogDescription',
        )}
        confirmLabel={t(
          'management.restoreConfirm',
        )}
        isPending={isPending}
        icon={
          <RotateCcw
            className="size-5"
            aria-hidden="true"
          />
        }
        onCancel={() => setIsOpen(false)}
        onConfirm={() =>
          formRef.current?.requestSubmit()
        }
      />
    </div>
  );
}
