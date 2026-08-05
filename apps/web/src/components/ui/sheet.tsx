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

export type SheetSide = 'left' | 'right' | 'bottom';

export interface SheetProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  side?: SheetSide;
  closeLabel?: string;
  dismissible?: boolean;
  className?: string;
  onOpenChange: (open: boolean) => void;
}

const sideClasses: Record<SheetSide, string> = {
  left:
    'mr-auto h-dvh w-[min(26rem,calc(100%-2rem))] rounded-r-2xl',
  right:
    'ml-auto h-dvh w-[min(26rem,calc(100%-2rem))] rounded-l-2xl',
  bottom:
    'mt-auto max-h-[85dvh] w-full rounded-t-2xl',
};

export function Sheet({
  open,
  title,
  description,
  children,
  footer,
  side = 'right',
  closeLabel = 'Cerrar',
  dismissible = true,
  className,
  onOpenChange,
}: SheetProps) {
  const sheetRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const sheet = sheetRef.current;

    if (!sheet) return;

    if (open && !sheet.open) {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      sheet.showModal();
      return;
    }

    if (!open && sheet.open) {
      sheet.close();
    }
  }, [open]);

  const requestClose = () => {
    if (dismissible) {
      onOpenChange(false);
    }
  };

  return (
    <dialog
      ref={sheetRef}
      aria-labelledby={titleId}
      aria-describedby={
        description ? descriptionId : undefined
      }
      className={cn(
        'fixed inset-0 m-0 max-h-none max-w-none overflow-hidden border-0 bg-transparent p-0 text-foreground',
        'backdrop:bg-overlay',
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
      <section
        className={cn(
          'flex max-w-full flex-col border-border bg-surface-elevated shadow-[var(--shadow-lg)]',
          side === 'left' && 'border-r',
          side === 'right' && 'border-l',
          side === 'bottom' && 'border-t',
          sideClasses[side],
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border-soft p-5">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight"
            >
              {title}
            </h2>

            {description ? (
              <div
                id={descriptionId}
                className="mt-1 text-sm text-muted-foreground"
              >
                {description}
              </div>
            ) : null}
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

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {children}
        </div>

        {footer ? (
          <footer className="border-t border-border-soft p-5">
            {footer}
          </footer>
        ) : null}
      </section>
    </dialog>
  );
}