'use client';

import type { PetPhotoWithSignedUrl } from '@buscohuella/pet-domain';
import {
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  useEffect,
  useRef,
} from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';

export function PetPhotoLightbox({
  photos,
  activeIndex,
  petName,
  onClose,
  onChange,
}: {
  photos: PetPhotoWithSignedUrl[];
  activeIndex: number | null;
  petName: string;
  onClose: () => void;
  onChange: (index: number) => void;
}) {
  const { t } = useTranslations('pets');
  const dialogRef =
    useRef<HTMLDialogElement>(null);
  const activePhoto =
    activeIndex === null
      ? null
      : photos[activeIndex] ?? null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activePhoto && !dialog.open) {
      dialog.showModal();
    } else if (!activePhoto && dialog.open) {
      dialog.close();
    }
  }, [activePhoto]);

useEffect(() => {
  if (
    !activePhoto ||
    activeIndex === null
  ) {
    return;
  }

  const currentIndex = activeIndex;

  function handleKeyDown(
    event: KeyboardEvent,
  ) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onChange(
        currentIndex === 0
          ? photos.length - 1
          : currentIndex - 1,
      );
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onChange(
        currentIndex ===
          photos.length - 1
          ? 0
          : currentIndex + 1,
      );
    }
  }

  window.addEventListener(
    'keydown',
    handleKeyDown,
  );

  return () =>
    window.removeEventListener(
      'keydown',
      handleKeyDown,
    );
}, [
  activeIndex,
  activePhoto,
  onChange,
  photos.length,
]);

  const fallbackAlt = t(
    'photos.photoAlt',
    { name: petName },
  );

  return (
    <dialog
      ref={dialogRef}
      aria-label={t(
        'photos.galleryLabel',
        { name: petName },
      )}
      className="m-auto h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-7xl overflow-hidden rounded-2xl border border-border bg-black p-0 text-white shadow-[var(--shadow-lg)] backdrop:bg-black/80"
      onClick={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (activePhoto) onClose();
      }}
    >
      {activePhoto &&
      activeIndex !== null ? (
        <div className="relative flex h-full min-h-0 flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-white/15 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {activePhoto.altText ||
                  fallbackAlt}
              </p>
              <p className="mt-1 text-xs text-white/70">
                {t('photos.position', {
                  current:
                    activeIndex + 1,
                  total: photos.length,
                })}
              </p>
            </div>

            <button
              type="button"
              aria-label={t(
                'photos.closeGallery',
              )}
              onClick={onClose}
              className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              <X
                className="size-6"
                aria-hidden="true"
              />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 cursor-zoom-out items-center justify-center p-4"
            onClick={onClose}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePhoto.signedUrl}
              alt={
                activePhoto.altText ||
                fallbackAlt
              }
              onClick={(event) =>
                event.stopPropagation()
              }
              className="max-h-full max-w-full cursor-default object-contain"
            />

            {photos.length > 1 ? (
              <>
                <NavigationButton
                  label={t(
                    'photos.previous',
                  )}
                  side="left"
                  onClick={() =>
                    onChange(
                      activeIndex === 0
                        ? photos.length - 1
                        : activeIndex - 1,
                    )
                  }
                >
                  <ChevronLeft className="size-7" />
                </NavigationButton>

                <NavigationButton
                  label={t('photos.next')}
                  side="right"
                  onClick={() =>
                    onChange(
                      activeIndex ===
                        photos.length - 1
                        ? 0
                        : activeIndex + 1,
                    )
                  }
                >
                  <ChevronRight className="size-7" />
                </NavigationButton>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

function NavigationButton({
  label,
  side,
  onClick,
  children,
}: {
  label: string;
  side: 'left' | 'right';
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`absolute ${side}-3 flex size-12 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30`}
    >
      <span aria-hidden="true">
        {children}
      </span>
    </button>
  );
}
