'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import { Alert } from '@/components/ui/alert';

import { didInvalidSubmissionComplete } from './form-error-summary-focus';

export interface FormErrorItem {
  id: string;
  message: string;
  fieldId?: string;
}

export interface FormErrorSummaryProps {
  errors: readonly FormErrorItem[];
  title?: string;
  focusKey?: unknown;
}

/**
 * Produces one stable focus trigger for every completed invalid form action.
 * It does not depend on the number of errors or the action-state identity.
 */
export function useInvalidFormSubmissionFocusKey(
  isPending: boolean,
  hasErrors: boolean,
): number {
  const [focusKey, setFocusKey] = useState(0);
  const wasPendingRef = useRef(isPending);

  useEffect(() => {
    const wasPending = wasPendingRef.current;
    wasPendingRef.current = isPending;

    if (didInvalidSubmissionComplete({ wasPending, isPending, hasErrors })) {
      setFocusKey((current) => current + 1);
    }
  }, [hasErrors, isPending]);

  return focusKey;
}

export function FormErrorSummary({
  errors,
  title = 'Revisa los campos indicados',
  focusKey,
}: FormErrorSummaryProps) {
  const summaryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (errors.length === 0) return;

    const summary = summaryRef.current;
    if (!summary) return;

    summary.focus({ preventScroll: true });
    summary.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    });
  }, [errors.length, focusKey]);

  if (errors.length === 0) return null;

  return (
    <div ref={summaryRef} tabIndex={-1}>
      <Alert
        variant="danger"
        title={title}
      >
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {errors.map((error) => (
          <li key={error.id}>
            {error.fieldId ? (
              <a
                href={`#${error.fieldId}`}
                className="font-medium underline underline-offset-2 hover:no-underline"
              >
                {error.message}
              </a>
            ) : (
              error.message
            )}
          </li>
        ))}
      </ul>
      </Alert>
    </div>
  );
}
