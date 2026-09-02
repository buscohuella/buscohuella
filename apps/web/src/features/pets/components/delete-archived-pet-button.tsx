'use client';

import { Trash2 } from 'lucide-react';
import { useActionState, useRef, useState } from 'react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useTranslations } from '@/features/i18n/i18n-provider';

import { deleteArchivedPetAction } from '../actions/delete-archived-pet';
import { initialPetActionState } from '../types/pet-action-state';

export function DeleteArchivedPetButton({ petId, petName }: { petId: string; petName: string }) {
  const { t } = useTranslations('pets');
  const [state, formAction, isPending] = useActionState(deleteArchivedPetAction, initialPetActionState);
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  return <div className="space-y-3">
    {state.message ? <Alert variant={state.status === 'error' ? 'danger' : 'success'}>{state.message}</Alert> : null}
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="petId" value={petId} />
      <Button type="button" variant="danger" isLoading={isPending} loadingText={t('management.deleting')} onClick={() => setOpen(true)}>
        <Trash2 className="size-5" aria-hidden="true" />{t('management.delete')}
      </Button>
    </form>
    <ConfirmationDialog open={open} title={t('management.deleteDialogTitle', { name: petName })} description={t('management.deleteDialogDescription')} confirmLabel={t('management.deleteConfirm')} confirmVariant="danger" isPending={isPending} icon={<Trash2 className="size-5" aria-hidden="true" />} onCancel={() => setOpen(false)} onConfirm={() => formRef.current?.requestSubmit()} />
  </div>;
}
