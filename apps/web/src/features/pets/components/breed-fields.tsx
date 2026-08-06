'use client';

import type { BreedKnowledge, PetBreed } from '@buscohuella/pet-domain';
import { Check, ChevronDown, Info, Search } from 'lucide-react';
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Radio } from '@/components/ui/radio';
import { useTranslations } from '@/features/i18n/i18n-provider';
import { cn } from '@/lib/utils';

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function findBreed(breeds: PetBreed[], value: string) {
  const normalized = normalize(value);
  return breeds.find(
    (breed) =>
      normalize(breed.canonicalName) === normalized ||
      breed.aliases.some((alias) => normalize(alias) === normalized),
  );
}

function filterBreeds(breeds: PetBreed[], query: string, locale: string) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) return breeds.slice(0, 12);

  return breeds
    .map((breed) => {
      const canonical = normalize(breed.canonicalName);
      const aliases = breed.aliases.map(normalize);
      let score = 99;

      if (canonical === normalizedQuery) score = 0;
      else if (canonical.startsWith(normalizedQuery)) score = 1;
      else if (aliases.some((alias) => alias.startsWith(normalizedQuery))) score = 2;
      else if (canonical.includes(normalizedQuery)) score = 3;
      else if (aliases.some((alias) => alias.includes(normalizedQuery))) score = 4;

      return { breed, score };
    })
    .filter(({ score }) => score < 99)
    .sort(
      (left, right) =>
        left.score - right.score ||
        left.breed.sortOrder - right.breed.sortOrder ||
        left.breed.canonicalName.localeCompare(
          right.breed.canonicalName,
          locale,
        ),
    )
    .slice(0, 12)
    .map(({ breed }) => breed);
}

export function BreedFields({
  breeds,
  speciesId,
  initialBreedKnowledge = 'UNKNOWN',
  initialPrimaryBreedId = null,
  initialSecondaryBreedId = null,
  initialIsMixedBreed = false,
  legacyBreed = null,
  preserveLegacy = false,
  fieldErrors,
}: {
  breeds: PetBreed[];
  speciesId: number | null;
  initialBreedKnowledge?: BreedKnowledge;
  initialPrimaryBreedId?: number | null;
  initialSecondaryBreedId?: number | null;
  initialIsMixedBreed?: boolean;
  legacyBreed?: string | null;
  preserveLegacy?: boolean;
  fieldErrors?: Record<string, string>;
}) {
  const { locale, t } = useTranslations('pets');
  const availableBreeds = useMemo(
    () => breeds.filter((breed) => breed.speciesId === speciesId),
    [breeds, speciesId],
  );

  const inferredLegacyBreed =
    legacyBreed && !initialPrimaryBreedId
      ? findBreed(availableBreeds, legacyBreed)
      : undefined;

  const inferredKnowledge: BreedKnowledge = inferredLegacyBreed
    ? 'KNOWN'
    : initialBreedKnowledge;

  const [knowledge, setKnowledge] = useState<BreedKnowledge>(inferredKnowledge);
  const [primaryId, setPrimaryId] = useState<number | null>(
    initialPrimaryBreedId ?? inferredLegacyBreed?.id ?? null,
  );
  const [secondaryId, setSecondaryId] = useState<number | null>(
    initialSecondaryBreedId,
  );
  const [isMixed, setIsMixed] = useState(
    inferredKnowledge === 'MIXED_UNKNOWN' ? true : initialIsMixedBreed,
  );
  const [keepLegacy, setKeepLegacy] = useState(
    preserveLegacy && !inferredLegacyBreed,
  );

  const primaryBreed =
    availableBreeds.find((breed) => breed.id === primaryId) ?? null;
  const secondaryBreed =
    availableBreeds.find((breed) => breed.id === secondaryId) ?? null;

  function chooseKnowledge(value: BreedKnowledge) {
    setKnowledge(value);
    setKeepLegacy(false);

    if (value === 'UNKNOWN') {
      setPrimaryId(null);
      setSecondaryId(null);
      setIsMixed(false);
    }

    if (value === 'MIXED_UNKNOWN') {
      setPrimaryId(null);
      setSecondaryId(null);
      setIsMixed(true);
    }
  }

  return (
    <fieldset className="space-y-5 md:col-span-2">
      <legend className="text-sm font-semibold">
        {t('breed.legend')}
      </legend>

      {keepLegacy && legacyBreed ? (
        <div className="rounded-lg border border-border-soft bg-surface p-4">
          <p className="font-semibold">
            {t('breed.legacyTitle', { breed: legacyBreed })}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('breed.legacyDescription')}
          </p>
          <input type="hidden" name="preserveLegacyBreed" value="1" />
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <KnowledgeOption
          value="KNOWN"
          checked={knowledge === 'KNOWN'}
          disabled={!speciesId}
          label={t('breed.knownTitle')}
          description={t('breed.knownDescription')}
          onChange={() => chooseKnowledge('KNOWN')}
        />
        <KnowledgeOption
          value="UNKNOWN"
          checked={knowledge === 'UNKNOWN'}
          disabled={!speciesId}
          label={t('breed.unknownTitle')}
          description={t('breed.unknownDescription')}
          onChange={() => chooseKnowledge('UNKNOWN')}
        />
        <KnowledgeOption
          value="MIXED_UNKNOWN"
          checked={knowledge === 'MIXED_UNKNOWN'}
          disabled={!speciesId}
          label={t('breed.mixedUnknownTitle')}
          description={t('breed.mixedUnknownDescription')}
          onChange={() => chooseKnowledge('MIXED_UNKNOWN')}
        />
      </div>

      <input type="hidden" name="breedKnowledge" value={knowledge} />
      <input type="hidden" name="primaryBreedId" value={primaryId ?? ''} />
      <input type="hidden" name="secondaryBreedId" value={secondaryId ?? ''} />

      {!speciesId ? (
        <InformationState
          title={t('breed.selectSpeciesTitle')}
          description={t('breed.selectSpeciesDescription')}
        />
      ) : null}

      {speciesId && knowledge === 'KNOWN' ? (
        <div className="grid gap-5 md:grid-cols-2">
          <BreedCombobox
            id="pet-primary-breed"
            label={t('breed.primaryLabel')}
            breeds={availableBreeds}
            selectedBreed={primaryBreed}
            error={fieldErrors?.primaryBreedId}
            locale={locale}
            onSelect={(breed) => {
              setPrimaryId(breed?.id ?? null);
              setKeepLegacy(false);

              if (breed?.id === secondaryId) {
                setSecondaryId(null);
              }
            }}
          />

          <div className="flex items-end">
            <div className="w-full rounded-lg border border-border-soft bg-surface p-4">
              <Checkbox
                name="isMixedBreed"
                checked={isMixed}
                onChange={(event) => {
                  setIsMixed(event.target.checked);
                  if (!event.target.checked) setSecondaryId(null);
                }}
                label={t('breed.mixedLabel')}
                description={t('breed.mixedDescription')}
              />
            </div>
          </div>

          {isMixed ? (
            <BreedCombobox
              id="pet-secondary-breed"
              label={t('breed.secondaryLabel')}
              breeds={availableBreeds.filter((breed) => breed.id !== primaryId)}
              selectedBreed={secondaryBreed}
              error={fieldErrors?.secondaryBreedId}
              locale={locale}
              onSelect={(breed) => setSecondaryId(breed?.id ?? null)}
            />
          ) : null}
        </div>
      ) : null}

      {speciesId && knowledge === 'UNKNOWN' ? (
        <InformationState
          title={t('breed.unknownStateTitle')}
          description={t('breed.unknownStateDescription')}
        />
      ) : null}

      {speciesId && knowledge === 'MIXED_UNKNOWN' ? (
        <>
          <input type="hidden" name="isMixedBreed" value="on" />
          <InformationState
            title={t('breed.mixedStateTitle')}
            description={t('breed.mixedStateDescription')}
          />
        </>
      ) : null}

      {fieldErrors?.breedKnowledge ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {fieldErrors.breedKnowledge}
        </p>
      ) : null}
    </fieldset>
  );
}

function BreedCombobox({
  id,
  label,
  breeds,
  selectedBreed,
  error,
  locale,
  onSelect,
}: {
  id: string;
  label: string;
  breeds: PetBreed[];
  selectedBreed: PetBreed | null;
  error?: string;
  locale: string;
  onSelect: (breed: PetBreed | null) => void;
}) {
  const { t } = useTranslations('pets');
  const generatedId = useId();
  const listboxId = `${id}-${generatedId}-listbox`;
  const statusId = `${id}-${generatedId}-status`;
  const errorId = error ? `${id}-${generatedId}-error` : undefined;
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(selectedBreed?.canonicalName ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const matches = useMemo(
    () => filterBreeds(breeds, query, locale),
    [breeds, query, locale],
  );

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  function selectBreed(breed: PetBreed) {
    onSelect(breed);
    setQuery(breed.canonicalName);
    setIsOpen(false);
    setActiveIndex(0);
  }

  function handleInput(value: string) {
    setQuery(value);
    setIsOpen(true);
    setActiveIndex(0);
    onSelect(findBreed(breeds, value) ?? null);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        matches.length ? Math.min(current + 1, matches.length - 1) : 0,
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        matches.length ? Math.max(current - 1, 0) : 0,
      );
    } else if (event.key === 'Enter' && isOpen && matches[activeIndex]) {
      event.preventDefault();
      selectBreed(matches[activeIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
    } else if (event.key === 'Tab') {
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-3.5 size-5 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id={id}
          type="text"
          role="combobox"
          value={query}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && matches[activeIndex]
              ? `${listboxId}-option-${matches[activeIndex].id}`
              : undefined
          }
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={[statusId, errorId].filter(Boolean).join(' ') || undefined}
          placeholder={t('breed.searchPlaceholder')}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => handleInput(event.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            'min-h-12 w-full rounded-lg border bg-surface-elevated py-2 pl-10 pr-11 text-base',
            'focus-visible:outline-none focus-visible:ring-4',
            error
              ? 'border-danger focus-visible:ring-danger-soft'
              : 'border-border focus-visible:border-primary focus-visible:ring-focus-soft',
          )}
        />
        <button
          type="button"
          aria-label={t(
            isOpen ? 'breed.closeSuggestions' : 'breed.showSuggestions',
          )}
          onClick={() => setIsOpen((current) => !current)}
          className="absolute right-1.5 top-1.5 flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          <ChevronDown
            className={cn('size-5 transition-transform', isOpen && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      </div>

      <p id={statusId} aria-live="polite" className="mt-2 text-sm text-muted-foreground">
        {selectedBreed
          ? t('breed.selectedStatus', { breed: selectedBreed.canonicalName })
          : query
            ? t(matches.length === 1 ? 'breed.oneResult' : 'breed.manyResults', {
                count: matches.length,
              })
            : t('breed.searchHint')}
      </p>

      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}

      {isOpen ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label={t('breed.resultsLabel', { label })}
          className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-border bg-surface-elevated p-1 shadow-[var(--shadow-md)]"
        >
          {matches.length ? (
            matches.map((breed, index) => {
              const isSelected = breed.id === selectedBreed?.id;
              const isActive = index === activeIndex;

              return (
                <button
                  key={breed.id}
                  id={`${listboxId}-option-${breed.id}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectBreed(breed)}
                  className={cn(
                    'flex w-full items-start justify-between gap-3 rounded-lg px-3 py-3 text-left',
                    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft',
                    isActive && 'bg-surface',
                    isSelected && 'font-semibold text-primary',
                  )}
                >
                  <span>
                    <span className="block">{breed.canonicalName}</span>
                    {breed.aliases.length ? (
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {t('breed.also', {
                          aliases: breed.aliases.slice(0, 3).join(', '),
                        })}
                      </span>
                    ) : null}
                  </span>
                  {isSelected ? (
                    <Check className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                  ) : null}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-4 text-sm text-muted-foreground">
              {t('breed.noResults', { query })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function KnowledgeOption({
  value,
  checked,
  label,
  description,
  disabled = false,
  onChange,
}: {
  value: BreedKnowledge;
  checked: boolean;
  label: string;
  description: string;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        'rounded-lg border p-4',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        checked
          ? 'border-primary bg-primary-soft'
          : 'border-border-soft bg-surface',
      )}
    >
      <Radio
        name="breedKnowledgeChoice"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        label={label}
        description={description}
      />
    </label>
  );
}

function InformationState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border border-border-soft bg-surface p-4">
      <Info
        className="mt-0.5 size-5 shrink-0 text-primary"
        aria-hidden="true"
      />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
