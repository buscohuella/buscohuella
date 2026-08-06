'use client';

import {
  ArrowRight,
  CalendarClock,
  Check,
  Clock3,
  History,
  Sunrise,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { useTranslations } from '@/features/i18n/i18n-provider';

type IncidentMoment =
  | 'NOW'
  | 'RECENT'
  | 'TODAY'
  | 'YESTERDAY'
  | 'CUSTOM';

const options: {
  value: IncidentMoment;
  icon: typeof Clock3;
  labelKey: string;
  descriptionKey: string;
}[] = [
  {
    value: 'NOW',
    icon: Clock3,
    labelKey: 'incidentTime.options.now.label',
    descriptionKey:
      'incidentTime.options.now.description',
  },
  {
    value: 'RECENT',
    icon: History,
    labelKey:
      'incidentTime.options.recent.label',
    descriptionKey:
      'incidentTime.options.recent.description',
  },
  {
    value: 'TODAY',
    icon: Sunrise,
    labelKey:
      'incidentTime.options.today.label',
    descriptionKey:
      'incidentTime.options.today.description',
  },
  {
    value: 'YESTERDAY',
    icon: CalendarClock,
    labelKey:
      'incidentTime.options.yesterday.label',
    descriptionKey:
      'incidentTime.options.yesterday.description',
  },
  {
    value: 'CUSTOM',
    icon: CalendarClock,
    labelKey:
      'incidentTime.options.custom.label',
    descriptionKey:
      'incidentTime.options.custom.description',
  },
];

export function IncidentTimeStep({
  petId,
}: {
  petId: string;
}) {
  const router = useRouter();
  const { t } = useTranslations('reports');
  const [selected, setSelected] =
    useState<IncidentMoment | null>(null);
  const [customDateTime, setCustomDateTime] =
    useState('');

  const maxDateTime = useMemo(
    () => toLocalDateTimeValue(new Date()),
    [],
  );

  const customIsValid =
    selected !== 'CUSTOM' ||
    (customDateTime.length > 0 &&
      customDateTime <= maxDateTime);

  const canContinue =
    selected !== null && customIsValid;

  function continueToLocation() {
    if (!selected || !canContinue) {
      return;
    }

    const params = new URLSearchParams({
      mascota: petId,
      momento: selected,
    });

    if (
      selected === 'CUSTOM' &&
      customDateTime
    ) {
      params.set(
        'fecha',
        new Date(customDateTime).toISOString(),
      );
    }

    router.push(
      `/mis-reportes/nuevo/perdida/ubicacion?${params.toString()}`,
    );
  }

  return (
    <div className="space-y-6">
      <div
        role="radiogroup"
        aria-label={t(
          'incidentTime.groupLabel',
        )}
        className="grid gap-3 sm:grid-cols-2"
      >
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected =
            selected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() =>
                setSelected(option.value)
              }
              className={[
                'flex min-h-24 items-start gap-4 rounded-xl border p-4 text-left',
                'transition-[border-color,background-color,box-shadow]',
                'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft',
                isSelected
                  ? 'border-primary bg-primary-soft/40 shadow-[var(--shadow-sm)]'
                  : 'border-border bg-surface hover:border-primary/30 hover:bg-surface-hover',
              ].join(' ')}
            >
              <span
                className={[
                  'flex size-11 shrink-0 items-center justify-center rounded-full',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-surface-elevated text-primary',
                ].join(' ')}
                aria-hidden="true"
              >
                {isSelected ? (
                  <Check className="size-5" />
                ) : (
                  <Icon className="size-5" />
                )}
              </span>

              <span>
                <strong className="block">
                  {t(option.labelKey)}
                </strong>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {t(
                    option.descriptionKey,
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {selected === 'CUSTOM' ? (
        <div className="rounded-xl border border-border bg-surface p-4">
          <label
            htmlFor="incident-date-time"
            className="font-semibold"
          >
            {t(
              'incidentTime.customLabel',
            )}
          </label>

          <input
            id="incident-date-time"
            type="datetime-local"
            value={customDateTime}
            max={maxDateTime}
            required
            aria-invalid={
              customDateTime.length > 0 &&
              !customIsValid
                ? true
                : undefined
            }
            aria-describedby="incident-date-time-help"
            onChange={(event) =>
              setCustomDateTime(
                event.target.value,
              )
            }
            className="mt-3 min-h-12 w-full rounded-lg border border-border bg-background px-3 text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          />

          <p
            id="incident-date-time-help"
            className="mt-2 text-sm text-muted-foreground"
          >
            {customDateTime.length > 0 &&
            !customIsValid
              ? t(
                  'incidentTime.futureError',
                )
              : t(
                  'incidentTime.customHelp',
                )}
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 border-t border-border-soft pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-sm text-muted-foreground"
          aria-live="polite"
        >
          {selected
            ? t(
                `incidentTime.summary.${selected}`,
              )
            : t(
                'incidentTime.selectHint',
              )}
        </p>

        <button
          type="button"
          disabled={!canContinue}
          onClick={continueToLocation}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t('incidentTime.continue')}
          <ArrowRight
            className="size-5"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

function toLocalDateTimeValue(
  date: Date,
) {
  const offset =
    date.getTimezoneOffset() * 60_000;
  return new Date(
    date.getTime() - offset,
  )
    .toISOString()
    .slice(0, 16);
}
