'use client';

import {
  ArrowRight,
  Check,
  Images,
  Pill,
  ShieldAlert,
  Smile,
  Tag,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';
import {
  readLostReportDetails,
  saveLostReportDetails,
} from '@/features/reports/lib/lost-report-details';

const descriptionMinLength = 10;
const descriptionMaxLength = 800;

export function LostReportDetailsStep({
  petId,
  petName,
  moment,
  exactDate,
}: {
  petId: string;
  petName: string;
  moment: string;
  exactDate?: string;
}) {
  const router = useRouter();
  const { t } = useTranslations('reports');

  const [description, setDescription] =
    useState('');
  const [
    hasCollarOrHarness,
    setHasCollarOrHarness,
  ] = useState(false);
  const [
    needsMedication,
    setNeedsMedication,
  ] = useState(false);
  const [isFearful, setIsFearful] =
    useState(false);
  const [isFriendly, setIsFriendly] =
    useState(false);
  const [usePetPhotos, setUsePetPhotos] =
    useState(true);

  useEffect(() => {
    const frameId =
      window.requestAnimationFrame(() => {
        const stored =
          readLostReportDetails();

        if (!stored) {
          return;
        }

        setDescription(
          stored.description,
        );
        setHasCollarOrHarness(
          stored.hasCollarOrHarness,
        );
        setNeedsMedication(
          stored.needsMedication,
        );
        setIsFearful(stored.isFearful);
        setIsFriendly(stored.isFriendly);
        setUsePetPhotos(
          stored.usePetPhotos,
        );
      });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  const normalizedDescription =
    description.trim();

  const isDescriptionValid =
    normalizedDescription.length >=
      descriptionMinLength &&
    normalizedDescription.length <=
      descriptionMaxLength;

  const helperText = useMemo(() => {
    if (description.length === 0) {
      return t(
        'description.form.descriptionHelp',
        {
          min: descriptionMinLength,
          max: descriptionMaxLength,
        },
      );
    }

    if (
      normalizedDescription.length <
      descriptionMinLength
    ) {
      return t(
        'description.form.descriptionTooShort',
        {
          remaining:
            descriptionMinLength -
            normalizedDescription.length,
        },
      );
    }

    return t(
      'description.form.characterCount',
      {
        count: description.length,
        max: descriptionMaxLength,
      },
    );
  }, [
    description,
    normalizedDescription.length,
    t,
  ]);

  function continueToReview() {
    if (!isDescriptionValid) {
      return;
    }

    saveLostReportDetails({
      description:
        normalizedDescription,
      hasCollarOrHarness,
      needsMedication,
      isFearful,
      isFriendly,
      usePetPhotos,
      savedAt: new Date().toISOString(),
    });

    const params = new URLSearchParams({
      mascota: petId,
      momento: moment,
    });

    if (exactDate) {
      params.set('fecha', exactDate);
    }

    router.push(
      `/mis-reportes/nuevo/perdida/revision?${params.toString()}`,
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="lost-report-description"
          className="font-semibold"
        >
          {t(
            'description.form.descriptionLabel',
          )}
        </label>

        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            'description.form.descriptionPrompt',
            { name: petName },
          )}
        </p>

        <textarea
          id="lost-report-description"
          value={description}
          minLength={descriptionMinLength}
          maxLength={descriptionMaxLength}
          rows={5}
          required
          aria-invalid={
            description.length > 0 &&
            !isDescriptionValid
              ? true
              : undefined
          }
          aria-describedby="lost-report-description-help"
          placeholder={t(
            'description.form.descriptionPlaceholder',
          )}
          onChange={(event) =>
            setDescription(
              event.target.value,
            )
          }
          className="mt-3 min-h-36 w-full resize-y rounded-xl border border-border bg-background p-4 text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        />

        <p
          id="lost-report-description-help"
          className="mt-2 text-sm text-muted-foreground"
          aria-live="polite"
        >
          {helperText}
        </p>
      </div>

      <fieldset>
        <legend className="font-semibold">
          {t(
            'description.form.quickDetailsTitle',
          )}
        </legend>

        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            'description.form.quickDetailsDescription',
          )}
        </p>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <ToggleCard
            checked={hasCollarOrHarness}
            icon={<Tag />}
            label={t(
              'description.form.hasCollar',
            )}
            onChange={
              setHasCollarOrHarness
            }
          />

          <ToggleCard
            checked={needsMedication}
            icon={<Pill />}
            label={t(
              'description.form.needsMedication',
            )}
            onChange={setNeedsMedication}
          />

          <ToggleCard
            checked={isFearful}
            icon={<ShieldAlert />}
            label={t(
              'description.form.isFearful',
            )}
            onChange={setIsFearful}
          />

          <ToggleCard
            checked={isFriendly}
            icon={<Smile />}
            label={t(
              'description.form.isFriendly',
            )}
            onChange={setIsFriendly}
          />
        </div>
      </fieldset>

      <div className="rounded-xl border border-border bg-surface p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={usePetPhotos}
            onChange={(event) =>
              setUsePetPhotos(
                event.target.checked,
              )
            }
            className="mt-1 size-5 rounded border-border accent-primary"
          />

          <span className="flex min-w-0 gap-3">
            <Images
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>
              <strong className="block">
                {t(
                  'description.form.usePhotosTitle',
                )}
              </strong>
              <span className="mt-1 block text-sm text-muted-foreground">
                {t(
                  'description.form.usePhotosDescription',
                )}
              </span>
            </span>
          </span>
        </label>
      </div>

      <div className="flex flex-col gap-3 border-t border-border-soft pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t(
            'description.form.reviewHint',
          )}
        </p>

        <button
          type="button"
          disabled={!isDescriptionValid}
          onClick={continueToReview}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t(
            'description.form.continue',
          )}
          <ArrowRight
            className="size-5"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

function ToggleCard({
  checked,
  icon,
  label,
  onChange,
}: {
  checked: boolean;
  icon: React.ReactNode;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={[
        'flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border p-3',
        'focus-within:ring-4 focus-within:ring-focus-soft',
        checked
          ? 'border-primary bg-primary-soft/40'
          : 'border-border bg-surface hover:border-primary/30',
      ].join(' ')}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="sr-only"
      />

      <span
        className={[
          'flex size-10 shrink-0 items-center justify-center rounded-full',
          checked
            ? 'bg-primary text-primary-foreground'
            : 'bg-surface-elevated text-primary',
        ].join(' ')}
        aria-hidden="true"
      >
        {checked ? (
          <Check className="size-5" />
        ) : (
          <span className="[&>svg]:size-5">
            {icon}
          </span>
        )}
      </span>

      <span className="font-medium">
        {label}
      </span>
    </label>
  );
}
