'use client';

import { Archive } from 'lucide-react';
import {
  useActionState,
  useRef,
  useState,
} from 'react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useTranslations } from '@/features/i18n/i18n-provider';

import { archivePetAction } from '../actions/archive-pet';
import { initialPetActionState } from '../types/pet-action-state';

export function ArchivePetButton({
  petId,
  petName,
}: {
  petId: string;
  petName: string;
}) {
  const { t } = useTranslations('pets');
  const [state, formAction, isPending] =
    useActionState(
      archivePetAction,
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
          variant="danger"
          isLoading={isPending}
          loadingText={t(
            'management.archiving',
          )}
          onClick={() => setIsOpen(true)}
        >
          <Archive
            className="size-5"
            aria-hidden="true"
          />
          {t('management.archive')}
        </Button>
      </form>

      <ConfirmationDialog
        open={isOpen}
        title={t(
          'management.archiveDialogTitle',
          { name: petName },
        )}
        description={t(
          'management.archiveDialogDescription',
        )}
        confirmLabel={t(
          'management.archiveConfirm',
        )}
        confirmVariant="danger"
        isPending={isPending}
        icon={
          <Archive
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
