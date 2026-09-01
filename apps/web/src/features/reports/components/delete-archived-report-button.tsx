'use client';

import { Trash2 } from 'lucide-react';
import { useActionState, useRef, useState } from 'react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useTranslations } from '@/features/i18n/i18n-provider';

import { deleteArchivedReportAction } from '../actions/delete-archived-report';
import { initialReportLifecycleState } from '../types/report-lifecycle-state';

export function DeleteArchivedReportButton({ reportId, title }: { reportId: string; title: string }) {
  const { t } = useTranslations('reports');
  const [state, formAction, isPending] = useActionState(deleteArchivedReportAction, initialReportLifecycleState);
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  return <div className="space-y-3">
    {state.message ? <Alert variant={state.status === 'error' ? 'danger' : 'success'}>{state.message}</Alert> : null}
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="reportId" value={reportId} />
      <Button type="button" variant="danger" isLoading={isPending} loadingText={t('detail.actions.deleting')} onClick={() => setOpen(true)}>
        <Trash2 className="size-4" aria-hidden="true" />
        {t('detail.actions.delete')}
      </Button>
    </form>
    <ConfirmationDialog open={open} title={t('detail.actions.deleteTitle', { title })} description={t('detail.actions.deleteDescription')} confirmLabel={t('detail.actions.deleteConfirm')} confirmVariant="danger" isPending={isPending} icon={<Trash2 className="size-5" aria-hidden="true" />} onCancel={() => setOpen(false)} onConfirm={() => formRef.current?.requestSubmit()} />
  </div>;
}
