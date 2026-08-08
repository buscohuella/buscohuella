'use client';

import { Camera, LoaderCircle, Trash2, Upload } from 'lucide-react';
import { useActionState, useRef, useState } from 'react';

import { deleteAvatarAction } from '../actions/delete-avatar';
import { uploadAvatarAction } from '../actions/upload-avatar';
import { initialDeleteAvatarState } from '../types/delete-avatar-state';
import { initialUploadAvatarState } from '../types/upload-avatar-state';
import { useTranslations } from '@/features/i18n/i18n-provider';

export function AvatarForm({ avatarUrl }: { avatarUrl: string | null }) {
  const { t } = useTranslations('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [uploadState, uploadFormAction, isUploading] = useActionState(uploadAvatarAction, initialUploadAvatarState);
  const [deleteState, deleteFormAction, isDeleting] = useActionState(deleteAvatarAction, initialDeleteAvatarState);
  const error = uploadState.status === 'error' ? uploadState.message : deleteState.status === 'error' ? deleteState.message : null;

  return (
    <section className="rounded-xl border border-border bg-surface p-5" aria-labelledby="profile-avatar-heading">
      <div className="flex flex-wrap items-center gap-5">
        <div
          className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-primary/10 bg-cover bg-center text-primary"
          style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
          role={avatarUrl ? 'img' : undefined}
          aria-label={avatarUrl ? 'Fotografía de perfil actual' : undefined}
        >
          {!avatarUrl ? <Camera className="size-9" aria-hidden="true" /> : null}
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <h2 id="profile-avatar-heading" className="font-semibold">{t('form.avatar.label')}</h2>
            <p className="text-sm text-muted-foreground">{t('form.avatar.hint')}</p>
          </div>
          <form action={uploadFormAction} className="flex flex-wrap items-end gap-3">
            <div className="min-w-0 flex-1">
              <label htmlFor="profile-avatar-file" className="mb-1 block text-sm font-semibold">{t('form.avatar.chooseFile')}</label>
              <div className="flex min-h-12 items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
                <input
                  ref={fileInputRef}
                  id="profile-avatar-file"
                  name="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  className="sr-only"
                  onChange={(event) => setFileName(event.currentTarget.files?.[0]?.name ?? '')}
                />
                <label
                  htmlFor="profile-avatar-file"
                  className="inline-flex min-h-9 cursor-pointer items-center rounded-md bg-primary/20 px-3 font-semibold text-primary focus-within:outline-none focus-within:ring-4 focus-within:ring-focus-soft"
                >
                  {t('form.avatar.chooseFile')}
                </label>
                <span className="truncate text-sm text-muted-foreground">
                  {fileName || t('form.avatar.noFileSelected')}
                </span>
              </div>
            </div>
            <button type="submit" disabled={isUploading} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground disabled:cursor-wait disabled:opacity-60">
              {isUploading ? <LoaderCircle className="size-5 animate-spin" aria-hidden="true" /> : <Upload className="size-5" aria-hidden="true" />}
              {isUploading ? t('form.avatar.uploading') : avatarUrl ? t('form.avatar.replace') : t('form.avatar.upload')}
            </button>
          </form>
          {avatarUrl ? (
            <form action={deleteFormAction}>
              <button type="submit" disabled={isDeleting} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-danger/50 px-4 font-semibold text-danger disabled:opacity-60">
                {isDeleting ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Trash2 className="size-4" aria-hidden="true" />}
                {isDeleting ? t('form.avatar.deleting') : t('form.avatar.delete')}
              </button>
            </form>
          ) : null}
          {uploadState.status === 'success' || deleteState.status === 'success' ? <p className="text-sm text-primary" role="status">{uploadState.status === 'success' ? uploadState.message : deleteState.message}</p> : null}
          {error ? <p className="text-sm text-danger" role="alert">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}
