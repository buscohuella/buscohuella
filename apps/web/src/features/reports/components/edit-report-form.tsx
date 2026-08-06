'use client';

import {
  LoaderCircle,
  Save,
} from 'lucide-react';
import {
  useActionState,
  useState,
} from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';
import { updateReportAction } from '@/features/reports/actions/update-report';
import {
  initialUpdateReportState,
} from '@/features/reports/types/update-report-state';

type ContactMode =
  | 'PLATFORM_ONLY'
  | 'PUBLIC_PHONE'
  | 'PUBLIC_EMAIL';

export function EditReportForm({
  report,
}: {
  report: {
    id: string;
    title: string;
    description: string;
    municipalityName: string;
    contactMode: ContactMode;
    publicPhone: string;
    publicEmail: string;
  };
}) {
  const { t } =
    useTranslations('reportEdit');
  const [contactMode, setContactMode] =
    useState<ContactMode>(
      report.contactMode,
    );
  const [state, action, pending] =
    useActionState(
      updateReportAction,
      initialUpdateReportState,
    );

  return (
    <form
      action={action}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="reportId"
        value={report.id}
      />

      <Field
        label={t('fields.title')}
        htmlFor="report-title"
        help={t('fields.titleHelp')}
      >
        <input
          id="report-title"
          name="title"
          type="text"
          required
          minLength={3}
          maxLength={120}
          defaultValue={report.title}
          className="min-h-12 w-full rounded-lg border border-border bg-background px-3"
        />
      </Field>

      <Field
        label={t(
          'fields.description',
        )}
        htmlFor="report-description"
        help={t(
          'fields.descriptionHelp',
        )}
      >
        <textarea
          id="report-description"
          name="description"
          required
          minLength={10}
          maxLength={2000}
          rows={8}
          defaultValue={
            report.description
          }
          className="w-full rounded-lg border border-border bg-background p-3"
        />
      </Field>

      <Field
        label={t('fields.location')}
        htmlFor="report-location"
        help={t(
          'fields.locationHelp',
        )}
      >
        <input
          id="report-location"
          name="municipalityName"
          type="text"
          required
          minLength={3}
          maxLength={200}
          defaultValue={
            report.municipalityName
          }
          className="min-h-12 w-full rounded-lg border border-border bg-background px-3"
        />
      </Field>

      <fieldset className="space-y-3">
        <legend className="font-semibold">
          {t('contact.title')}
        </legend>
        <p className="text-sm text-muted-foreground">
          {t('contact.description')}
        </p>

        {(
          [
            'PLATFORM_ONLY',
            'PUBLIC_PHONE',
            'PUBLIC_EMAIL',
          ] as ContactMode[]
        ).map((mode) => (
          <label
            key={mode}
            className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-4"
          >
            <input
              type="radio"
              name="contactMode"
              value={mode}
              checked={
                contactMode === mode
              }
              onChange={() =>
                setContactMode(mode)
              }
              className="mt-1 size-5 accent-primary"
            />
            <span>
              <strong className="block">
                {t(
                  `contact.options.${mode}.label`,
                )}
              </strong>
              <span className="mt-1 block text-sm text-muted-foreground">
                {t(
                  `contact.options.${mode}.description`,
                )}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      {contactMode ===
      'PUBLIC_PHONE' ? (
        <Field
          label={t(
            'fields.publicPhone',
          )}
          htmlFor="report-phone"
          help={t(
            'fields.publicPhoneHelp',
          )}
        >
          <input
            id="report-phone"
            name="publicPhone"
            type="tel"
            required
            maxLength={40}
            defaultValue={
              report.publicPhone
            }
            className="min-h-12 w-full rounded-lg border border-border bg-background px-3"
          />
        </Field>
      ) : null}

      {contactMode ===
      'PUBLIC_EMAIL' ? (
        <Field
          label={t(
            'fields.publicEmail',
          )}
          htmlFor="report-email"
          help={t(
            'fields.publicEmailHelp',
          )}
        >
          <input
            id="report-email"
            name="publicEmail"
            type="email"
            required
            maxLength={254}
            defaultValue={
              report.publicEmail
            }
            className="min-h-12 w-full rounded-lg border border-border bg-background px-3"
          />
        </Field>
      ) : null}

      {state.status === 'error' ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger"
        >
          {state.message}
        </div>
      ) : null}

      <div className="flex justify-end border-t border-border-soft pt-5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-60"
        >
          {pending ? (
            <LoaderCircle
              className="size-5 animate-spin"
              aria-hidden="true"
            />
          ) : (
            <Save
              className="size-5"
              aria-hidden="true"
            />
          )}
          {t(
            pending
              ? 'saving'
              : 'save',
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  help,
  children,
}: {
  label: string;
  htmlFor: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-semibold"
      >
        {label}
      </label>
      <p className="mt-1 text-sm text-muted-foreground">
        {help}
      </p>
      <div className="mt-2">
        {children}
      </div>
    </div>
  );
}
