'use client';

import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  confirmVariant = 'primary',
  isPending = false,
  icon,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  isPending?: boolean;
  icon?: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-border bg-surface-elevated p-0 text-foreground shadow-[var(--shadow-lg)] backdrop:bg-black/50"
      onCancel={(event) => {
        event.preventDefault();
        if (!isPending) onCancel();
      }}
      onClose={() => {
        if (open && !isPending) onCancel();
      }}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {icon ? (
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                {icon}
              </span>
            ) : null}
            <div>
              <h2
                id="confirmation-dialog-title"
                className="text-xl font-semibold"
              >
                {title}
              </h2>
              <p
                id="confirmation-dialog-description"
                className="mt-2 text-sm leading-6 text-muted-foreground"
              >
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Cerrar"
            disabled={isPending}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:opacity-50"
            onClick={onCancel}
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? 'Procesando...' : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
