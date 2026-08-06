'use client';

import {
  ImagePlus,
  LoaderCircle,
  Upload,
} from 'lucide-react';
import {
  useActionState,
  useRef,
  useState,
} from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';
import {
  uploadReportPhotoAction,
} from '@/features/reports/actions/report-photos';
import {
  initialReportPhotoActionState,
} from '@/features/reports/types/report-photo-action-state';

export function ReportPhotoUploader({
  reportId,
  currentCount,
  maxCount,
}: {
  reportId: string;
  currentCount: number;
  maxCount: number;
}) {
  const { t } = useTranslations('reports');
  const inputRef =
    useRef<HTMLInputElement>(null);
  const [dragging, setDragging] =
    useState(false);
  const [state, action, pending] =
    useActionState(
      uploadReportPhotoAction,
      initialReportPhotoActionState,
    );

  return (
    <form
      action={action}
      className="space-y-4"
    >
      <input
        type="hidden"
        name="reportId"
        value={reportId}
      />

      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);

          const file =
            event.dataTransfer.files[0];

          if (
            file &&
            inputRef.current
          ) {
            const transfer =
              new DataTransfer();
            transfer.items.add(file);
            inputRef.current.files =
              transfer.files;
          }
        }}
        className={[
          'rounded-xl border-2 border-dashed p-6 text-center',
          dragging
            ? 'border-primary bg-primary-soft/40'
            : 'border-border bg-surface',
        ].join(' ')}
      >
        <ImagePlus
          className="mx-auto size-10 text-primary"
          aria-hidden="true"
        />

        <p className="mt-3 font-semibold">
          {t(
            'photos.uploader.title',
          )}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            'photos.uploader.description',
          )}
        </p>

        <input
          ref={inputRef}
          id="report-photo"
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp"
          required
          disabled={
            pending ||
            currentCount >= maxCount
          }
          className="mt-4 block w-full text-sm file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-primary file:px-4 file:font-semibold file:text-primary-foreground"
        />

        <label
          htmlFor="report-photo-alt"
          className="mt-4 block text-left text-sm font-semibold"
        >
          {t(
            'photos.uploader.altLabel',
          )}
        </label>
        <input
          id="report-photo-alt"
          type="text"
          name="altText"
          maxLength={300}
          placeholder={t(
            'photos.uploader.altPlaceholder',
          )}
          className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t(
            'photos.uploader.count',
            {
              count: currentCount,
              max: maxCount,
            },
          )}
        </p>

        <button
          type="submit"
          disabled={
            pending ||
            currentCount >= maxCount
          }
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-50"
        >
          {pending ? (
            <LoaderCircle
              className="size-5 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Upload
              className="size-5"
              aria-hidden="true"
            />
          )}
          {t(
            pending
              ? 'photos.uploader.uploading'
              : 'photos.uploader.upload',
          )}
        </button>
      </div>

      {state.status !== 'idle' ? (
        <p
          role={
            state.status === 'error'
              ? 'alert'
              : 'status'
          }
          className={
            state.status === 'error'
              ? 'text-sm text-danger'
              : 'text-sm text-primary'
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
