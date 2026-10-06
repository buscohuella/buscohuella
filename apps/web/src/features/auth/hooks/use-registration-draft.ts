'use client';

import {
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';

import {
  parseRegistrationDraft,
  registrationDraftStorageKey,
} from '../lib/registration-draft';

const EMPTY_SNAPSHOT = '';

function subscribe() {
  return () => undefined;
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

function getSessionSnapshot() {
  try {
    return (
      window.sessionStorage.getItem(registrationDraftStorageKey) ??
      EMPTY_SNAPSHOT
    );
  } catch {
    return EMPTY_SNAPSHOT;
  }
}

export function useRegistrationDraft(enabled = true) {
  const serializedDraft = useSyncExternalStore(
    subscribe,
    enabled ? getSessionSnapshot : getServerSnapshot,
    getServerSnapshot,
  );
  const draft = useMemo(
    () => parseRegistrationDraft(serializedDraft || null),
    [serializedDraft],
  );

  useEffect(() => {
    if (!enabled || !serializedDraft || draft) {
      return;
    }

    try {
      window.sessionStorage.removeItem(registrationDraftStorageKey);
    } catch {
      // Storage can be unavailable without blocking authentication.
    }
  }, [draft, enabled, serializedDraft]);

  return draft;
}
