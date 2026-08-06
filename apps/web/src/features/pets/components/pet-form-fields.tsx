'use client';

import type { Pet, PetBreed, PetSpecies } from '@buscohuella/pet-domain';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { FormErrorSummary, type FormErrorItem } from '@/components/ui/form-error-summary';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/features/i18n/i18n-provider';

import type { PetActionState } from '../types/pet-action-state';
import { BreedFields } from './breed-fields';

export function PetFormFields({
  mode, action, state, isPending, species, breeds, pet,
}: {
  mode: 'create' | 'edit';
  action: (formData: FormData) => void;
  state: PetActionState;
  isPending: boolean;
  species: PetSpecies[];
  breeds: PetBreed[];
  pet?: Pet;
}) {
  const { t } = useTranslations('pets');
  const initialSpeciesId = pet?.speciesId ?? null;
  const [speciesId, setSpeciesId] = useState<number | null>(initialSpeciesId);
  const [birthDate, setBirthDate] = useState(pet?.birthDate ?? '');
  const isOriginalSpecies = speciesId === initialSpeciesId;
  const cancelHref = pet ? `/mis-mascotas/${pet.id}` : '/mis-mascotas';

  const errors: FormErrorItem[] = Object.entries(state.fieldErrors ?? {}).map(
    ([id, message]) => ({
      id,
      fieldId: fieldIds[id],
      message,
    }),
  );

  return (
    <form action={action} className="space-y-8">
      {pet ? <input type="hidden" name="petId" value={pet.id} /> : null}

      {!errors.length && state.message ? (
        <Alert variant={state.status === 'error' ? 'danger' : 'success'}>
          {state.message}
        </Alert>
      ) : null}
      <FormErrorSummary
        errors={errors}
        title={state.message ?? t('validation.review')}
      />

      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">{t('form.basicTitle')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('form.basicDescription')}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field htmlFor="pet-species" label={t('form.species')}
            error={state.fieldErrors?.speciesId} errorId="pet-species-error" required>
            <Select id="pet-species" name="speciesId" value={speciesId ?? ''}
              required hasError={Boolean(state.fieldErrors?.speciesId)}
              onChange={(event) => setSpeciesId(event.target.value ? Number(event.target.value) : null)}>
              <option value="" disabled>{t('form.speciesPlaceholder')}</option>
              {species.map((item) => (
                <option key={item.id} value={item.id}>
                  {t(`form.speciesOptions.${item.code}`)}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="pet-name" label={t('form.name')}
            error={state.fieldErrors?.name} errorId="pet-name-error" required>
            <Input id="pet-name" name="name" defaultValue={pet?.name ?? ''}
              maxLength={80} autoComplete="off"
              hasError={Boolean(state.fieldErrors?.name)} required />
          </Field>

          <BreedFields
            key={`${speciesId ?? 'none'}-${isOriginalSpecies ? 'original' : 'new'}`}
            breeds={breeds}
            speciesId={speciesId}
            initialBreedKnowledge={isOriginalSpecies ? pet?.breedKnowledge : 'UNKNOWN'}
            initialPrimaryBreedId={isOriginalSpecies ? pet?.primaryBreedId : null}
            initialSecondaryBreedId={isOriginalSpecies ? pet?.secondaryBreedId : null}
            initialIsMixedBreed={isOriginalSpecies ? pet?.isMixedBreed : false}
            legacyBreed={isOriginalSpecies ? pet?.breed : null}
            preserveLegacy={Boolean(isOriginalSpecies && pet?.breed && !pet.primaryBreedId)}
            fieldErrors={state.fieldErrors}
          />

          <Field htmlFor="pet-sex" label={t('form.sex')}>
            <Select id="pet-sex" name="sex" defaultValue={pet?.sex ?? 'UNKNOWN'}>
              {['UNKNOWN','FEMALE','MALE'].map((value) => (
                <option key={value} value={value}>{t(`form.sexOptions.${value}`)}</option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="pet-size" label={t('form.size')}>
            <Select id="pet-size" name="size" defaultValue={pet?.size ?? 'UNKNOWN'}>
              {['UNKNOWN','TINY','SMALL','MEDIUM','LARGE','GIANT'].map((value) => (
                <option key={value} value={value}>{t(`form.sizeOptions.${value}`)}</option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="pet-weight" label={t('form.weight')}
            description={t('form.weightHint')} error={state.fieldErrors?.weightKg}
            errorId="pet-weight-error">
            <Input id="pet-weight" name="weightKg" type="number"
              defaultValue={pet?.weightKg ?? ''} min="0.01" max="9999.99"
              step="0.01" inputMode="decimal"
              hasError={Boolean(state.fieldErrors?.weightKg)} />
          </Field>

          <Field htmlFor="pet-primary-color" label={t('form.primaryColor')}
            error={state.fieldErrors?.primaryColor} errorId="pet-primary-color-error">
            <Input id="pet-primary-color" name="primaryColor"
              defaultValue={pet?.primaryColor ?? ''} maxLength={80}
              hasError={Boolean(state.fieldErrors?.primaryColor)} />
          </Field>
        </div>
      </section>

      <section className="space-y-5 border-t border-border-soft pt-7">
        <h2 className="text-lg font-semibold">{t('form.ageTitle')}</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Field htmlFor="pet-birth-date" label={t('form.birthDate')}
            description={t('form.birthDateOptional')}
            error={state.fieldErrors?.birthDate} errorId="pet-birth-date-error">
            <Input
              id="pet-birth-date"
              name="birthDate"
              type="date"
              value={birthDate}
              onChange={(event) => setBirthDate(event.target.value)}
              hasError={Boolean(state.fieldErrors?.birthDate)}
            />
          </Field>

          {birthDate ? (
            <Field htmlFor="pet-birth-precision" label={t('form.birthPrecision')}
              error={state.fieldErrors?.birthDatePrecision}
              errorId="pet-birth-precision-error">
              <Select id="pet-birth-precision" name="birthDatePrecision"
                defaultValue={pet?.birthDatePrecision === 'APPROXIMATE' ? 'APPROXIMATE' : 'EXACT'}>
                <option value="EXACT">{t('form.birthExact')}</option>
                <option value="APPROXIMATE">{t('form.birthApproximate')}</option>
              </Select>
            </Field>
          ) : null}
        </div>

        <div className="rounded-xl border border-border-soft bg-surface p-5">
          <Checkbox name="hasMicrochip" defaultChecked={pet?.hasMicrochip ?? false}
            label={t('form.hasMicrochip')} description={t('form.microchipPrivate')} />
          <div className="mt-4 max-w-md">
            <Field htmlFor="pet-microchip" label={t('form.microchipNumber')}
              error={state.fieldErrors?.microchipNumber} errorId="pet-microchip-error">
              <Input id="pet-microchip" name="microchipNumber"
                defaultValue={pet?.microchipNumber ?? ''} minLength={8}
                maxLength={30} autoComplete="off"
                hasError={Boolean(state.fieldErrors?.microchipNumber)} />
            </Field>
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t border-border-soft pt-7">
        <h2 className="text-lg font-semibold">{t('form.descriptionTitle')}</h2>
        <Field htmlFor="pet-description" label={t('form.description')}
          error={state.fieldErrors?.description} errorId="pet-description-error">
          <Textarea id="pet-description" name="description"
            defaultValue={pet?.description ?? ''} maxLength={1000} rows={4}
            hasError={Boolean(state.fieldErrors?.description)} />
        </Field>
        <Field htmlFor="pet-distinctive-features" label={t('form.distinctiveFeatures')}
          error={state.fieldErrors?.distinctiveFeatures}
          errorId="pet-distinctive-features-error">
          <Textarea id="pet-distinctive-features" name="distinctiveFeatures"
            defaultValue={pet?.distinctiveFeatures ?? ''} maxLength={1000} rows={4}
            hasError={Boolean(state.fieldErrors?.distinctiveFeatures)} />
        </Field>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-border-soft pt-6 sm:flex-row sm:justify-between">
        <Link href={cancelHref}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 font-semibold hover:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
          <ArrowLeft className="size-5" aria-hidden="true" />
          {t('form.cancel')}
        </Link>
        <Button type="submit" isLoading={isPending}
          loadingText={t(mode === 'create' ? 'form.creating' : 'form.saving')}>
          <Save className="size-5" aria-hidden="true" />
          {t(mode === 'create' ? 'form.create' : 'form.save')}
        </Button>
      </div>
    </form>
  );
}

const fieldIds: Record<string, string | undefined> = {
  speciesId: 'pet-species', name: 'pet-name', weightKg: 'pet-weight',
  primaryColor: 'pet-primary-color', birthDate: 'pet-birth-date',
  birthDatePrecision: 'pet-birth-precision', microchipNumber: 'pet-microchip',
  description: 'pet-description', distinctiveFeatures: 'pet-distinctive-features',
  primaryBreedId: 'pet-primary-breed', secondaryBreedId: 'pet-secondary-breed',
};
