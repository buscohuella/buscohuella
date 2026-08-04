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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activePhoto =
    activeIndex === null ? null : photos[activeIndex] ?? null;

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
    if (!activePhoto || activeIndex === null) return;

    const currentIndex = activeIndex;

    function handleKeyDown(event: KeyboardEvent) {
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
          currentIndex === photos.length - 1
            ? 0
            : currentIndex + 1,
        );
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, activePhoto, onChange, photos.length]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Galería de ${petName}`}
      className="m-auto h-[calc(100%-2rem)] w-[calc(100%-2rem)] max-w-7xl overflow-hidden rounded-2xl border border-border bg-black p-0 text-white shadow-[var(--shadow-lg)] backdrop:bg-black/80"
      onClick={(event) => {
        // Los clics sobre el ::backdrop de un dialog nativo llegan
        // con el propio dialog como target.
        if (event.target === event.currentTarget) {
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
      {activePhoto && activeIndex !== null ? (
        <div className="relative flex h-full min-h-0 flex-col">
          <div className="flex items-center justify-between gap-4 border-b border-white/15 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {activePhoto.altText || `Fotografía de ${petName}`}
              </p>
              <p className="mt-1 text-xs text-white/70">
                {activeIndex + 1} de {photos.length}
              </p>
            </div>

            <button
              type="button"
              aria-label="Cerrar galería"
              onClick={onClose}
              className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 cursor-zoom-out items-center justify-center p-4"
            onClick={onClose}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activePhoto.signedUrl}
              alt={activePhoto.altText || `Fotografía de ${petName}`}
              onClick={(event) => event.stopPropagation()}
              className="max-h-full max-w-full cursor-default object-contain"
            />

            {photos.length > 1 ? (
              <>
                <button
                  type="button"
                  aria-label="Fotografía anterior"
                  onClick={(event) => {
                    event.stopPropagation();
                    onChange(
                      activeIndex === 0
                        ? photos.length - 1
                        : activeIndex - 1,
                    );
                  }}
                  className="absolute left-3 flex size-12 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                >
                  <ChevronLeft className="size-7" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  aria-label="Fotografía siguiente"
                  onClick={(event) => {
                    event.stopPropagation();
                    onChange(
                      activeIndex === photos.length - 1
                        ? 0
                        : activeIndex + 1,
                    );
                  }}
                  className="absolute right-3 flex size-12 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                >
                  <ChevronRight className="size-7" aria-hidden="true" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
