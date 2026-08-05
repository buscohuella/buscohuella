'use client';

import { X } from 'lucide-react';
import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from 'react';

import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';

export interface DialogProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
  closeLabel?: string;
  dismissible?: boolean;
  className?: string;
  onOpenChange: (open: boolean) => void;
}

export function Dialog({
  open,
  title,
  description,
  children,
  footer,
  icon,
  closeLabel = 'Cerrar',
  dismissible = true,
  className,
  onOpenChange,
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      dialog.showModal();
      return;
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const requestClose = () => {
    if (!dismissible) return;

    onOpenChange(false);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={
        description ? descriptionId : undefined
      }
      className={cn(
        'm-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl',
        'border border-border bg-surface-elevated p-0 text-foreground shadow-[var(--shadow-lg)]',
        'backdrop:bg-overlay',
        className,
      )}
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={() => {
        if (open) {
          onOpenChange(false);
        }

        requestAnimationFrame(() => {
          returnFocusRef.current?.focus();
          returnFocusRef.current = null;
        });
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
    >
      <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-border-soft p-5 sm:p-6">
          <div className="flex min-w-0 items-start gap-4">
            {icon ? (
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"
                aria-hidden="true"
              >
                {icon}
              </span>
            ) : null}

            <div className="min-w-0">
              <h2
                id={titleId}
                className="text-xl font-semibold tracking-tight"
              >
                {title}
              </h2>

              {description ? (
                <div
                  id={descriptionId}
                  className="mt-2 text-sm leading-6 text-muted-foreground"
                >
                  {description}
                </div>
              ) : null}
            </div>
          </div>

          {dismissible ? (
            <IconButton
              label={closeLabel}
              className="-mr-1 -mt-1"
              onClick={requestClose}
            >
              <X className="size-5" aria-hidden="true" />
            </IconButton>
          ) : null}
        </header>

        {children ? (
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            {children}
          </div>
        ) : null}

        {footer ? (
          <footer className="border-t border-border-soft p-5 sm:p-6">
            {footer}
          </footer>
        ) : null}
      </div>
    </dialog>
  );
}