'use client';

import type {
  Pet,
  PetBreed,
  PetSpecies,
} from '@buscohuella/pet-domain';
import { ArrowLeft, PawPrint, Save } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import {
  petSexLabels,
  petSizeLabels,
  petSpeciesLabels,
} from '../lib/pet-labels';
import type { PetActionState } from '../types/pet-action-state';
import { BreedFields } from './breed-fields';

export function PetFormFields({
  mode,
  action,
  state,
  isPending,
  species,
  breeds,
  pet,
}: {
  mode: 'create' | 'edit';
  action: (formData: FormData) => void;
  state: PetActionState;
  isPending: boolean;
  species: PetSpecies[];
  breeds: PetBreed[];
  pet?: Pet;
}) {
  const initialSpeciesId = pet?.speciesId ?? null;
  const [speciesId, setSpeciesId] = useState<number | null>(
    initialSpeciesId,
  );

  const isOriginalSpecies = speciesId === initialSpeciesId;
  const cancelHref = pet
    ? `/mis-mascotas/${pet.id}`
    : '/mis-mascotas';

  return (
    <form action={action} className="space-y-8">
      {pet ? <input type="hidden" name="petId" value={pet.id} /> : null}

      {state.message ? (
        <div
          role={state.status === 'error' ? 'alert' : 'status'}
          className={
            state.status === 'error'
              ? 'rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm font-medium text-danger'
              : 'rounded-lg border border-success/30 bg-primary-soft p-4 text-sm font-medium text-success'
          }
        >
          {state.message}
        </div>
      ) : null}

      <section className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Información básica</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Datos principales para identificar a tu mascota.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="pet-species"
            label="Tipo de animal"
            error={state.fieldErrors?.speciesId}
          >
            <select
              id="pet-species"
              name="speciesId"
              value={speciesId ?? ''}
              required
              onChange={(event) =>
                setSpeciesId(
                  event.target.value
                    ? Number(event.target.value)
                    : null,
                )
              }
              className={selectClasses(
                Boolean(state.fieldErrors?.speciesId),
              )}
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              {species.map((item) => (
                <option key={item.id} value={item.id}>
                  {petSpeciesLabels[item.code] ?? item.code}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id="pet-name"
            label="Nombre"
            error={state.fieldErrors?.name}
          >
            <Input
              id="pet-name"
              name="name"
              defaultValue={pet?.name ?? ''}
              maxLength={80}
              autoComplete="off"
              hasError={Boolean(state.fieldErrors?.name)}
              required
            />
          </Field>

          <BreedFields
            key={`${speciesId ?? 'none'}-${isOriginalSpecies ? 'original' : 'new'}`}
            breeds={breeds}
            speciesId={speciesId}
            initialBreedKnowledge={
              isOriginalSpecies
                ? pet?.breedKnowledge
                : 'UNKNOWN'
            }
            initialPrimaryBreedId={
              isOriginalSpecies ? pet?.primaryBreedId : null
            }
            initialSecondaryBreedId={
              isOriginalSpecies ? pet?.secondaryBreedId : null
            }
            initialIsMixedBreed={
              isOriginalSpecies ? pet?.isMixedBreed : false
            }
            legacyBreed={isOriginalSpecies ? pet?.breed : null}
            preserveLegacy={
              Boolean(
                isOriginalSpecies &&
                  pet?.breed &&
                  !pet.primaryBreedId,
              )
            }
            fieldErrors={state.fieldErrors}
          />

          <Field id="pet-sex" label="Sexo">
            <select
              id="pet-sex"
              name="sex"
              defaultValue={pet?.sex ?? 'UNKNOWN'}
              className={selectClasses(false)}
            >
              {Object.entries(petSexLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field id="pet-size" label="Tamaño">
            <select
              id="pet-size"
              name="size"
              defaultValue={pet?.size ?? 'UNKNOWN'}
              className={selectClasses(false)}
            >
              {Object.entries(petSizeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id="pet-weight"
            label="Peso aproximado"
            hint="En kilogramos."
            error={state.fieldErrors?.weightKg}
          >
            <Input
              id="pet-weight"
              name="weightKg"
              type="number"
              defaultValue={pet?.weightKg ?? ''}
              min="0.01"
              max="9999.99"
              step="0.01"
              inputMode="decimal"
              hasError={Boolean(state.fieldErrors?.weightKg)}
            />
          </Field>

          <Field
            id="pet-primary-color"
            label="Color principal"
            error={state.fieldErrors?.primaryColor}
          >
            <Input
              id="pet-primary-color"
              name="primaryColor"
              defaultValue={pet?.primaryColor ?? ''}
              maxLength={80}
              hasError={Boolean(state.fieldErrors?.primaryColor)}
            />
          </Field>
        </div>
      </section>

      <section className="space-y-5 border-t border-border-soft pt-7">
        <h2 className="text-lg font-semibold">
          Edad e identificación
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="pet-birth-date"
            label="Fecha de nacimiento"
            error={state.fieldErrors?.birthDate}
          >
            <Input
              id="pet-birth-date"
              name="birthDate"
              type="date"
              defaultValue={pet?.birthDate ?? ''}
              hasError={Boolean(state.fieldErrors?.birthDate)}
            />
          </Field>

          <Field
            id="pet-birth-precision"
            label="Precisión de la fecha"
            error={state.fieldErrors?.birthDatePrecision}
          >
            <select
              id="pet-birth-precision"
              name="birthDatePrecision"
              defaultValue={
                pet?.birthDatePrecision === 'APPROXIMATE'
                  ? 'APPROXIMATE'
                  : 'EXACT'
              }
              className={selectClasses(
                Boolean(state.fieldErrors?.birthDatePrecision),
              )}
            >
              <option value="EXACT">Exacta</option>
              <option value="APPROXIMATE">Aproximada</option>
            </select>
          </Field>
        </div>

        <div className="rounded-xl border border-border-soft bg-surface p-5">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="hasMicrochip"
              defaultChecked={pet?.hasMicrochip ?? false}
              className="mt-1 size-5 accent-[var(--primary)]"
            />
            <span>
              <span className="block font-semibold">
                Tiene microchip
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                El número es privado.
              </span>
            </span>
          </label>

          <div className="mt-4 max-w-md">
            <Field
              id="pet-microchip"
              label="Número de microchip"
              error={state.fieldErrors?.microchipNumber}
            >
              <Input
                id="pet-microchip"
                name="microchipNumber"
                defaultValue={pet?.microchipNumber ?? ''}
                minLength={8}
                maxLength={30}
                autoComplete="off"
                hasError={Boolean(
                  state.fieldErrors?.microchipNumber,
                )}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t border-border-soft pt-7">
        <h2 className="text-lg font-semibold">Descripción</h2>

        <Field
          id="pet-description"
          label="Descripción general"
          error={state.fieldErrors?.description}
        >
          <textarea
            id="pet-description"
            name="description"
            defaultValue={pet?.description ?? ''}
            maxLength={1000}
            rows={4}
            className={textareaClasses(
              Boolean(state.fieldErrors?.description),
            )}
          />
        </Field>

        <Field
          id="pet-distinctive-features"
          label="Rasgos distintivos"
          error={state.fieldErrors?.distinctiveFeatures}
        >
          <textarea
            id="pet-distinctive-features"
            name="distinctiveFeatures"
            defaultValue={pet?.distinctiveFeatures ?? ''}
            maxLength={1000}
            rows={4}
            className={textareaClasses(
              Boolean(state.fieldErrors?.distinctiveFeatures),
            )}
          />
        </Field>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-border-soft pt-6 sm:flex-row sm:justify-between">
        <Link
          href={cancelHref}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 font-semibold text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
          Cancelar
        </Link>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <PawPrint className="size-5 animate-pulse" aria-hidden="true" />
          ) : (
            <Save className="size-5" aria-hidden="true" />
          )}
          {isPending
            ? mode === 'create'
              ? 'Registrando...'
              : 'Guardando...'
            : mode === 'create'
              ? 'Registrar mascota'
              : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint ? (
        <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function selectClasses(hasError: boolean) {
  return cn(
    'flex min-h-12 w-full rounded-lg border bg-surface-elevated px-3 py-2 text-base text-foreground',
    'focus-visible:outline-none focus-visible:ring-4',
    hasError
      ? 'border-danger focus-visible:ring-danger/15'
      : 'border-border focus-visible:ring-primary/15',
  );
}

function textareaClasses(hasError: boolean) {
  return cn(
    'w-full resize-y rounded-lg border bg-surface-elevated px-3 py-3 text-base text-foreground',
    'focus-visible:outline-none focus-visible:ring-4',
    hasError
      ? 'border-danger focus-visible:ring-danger/15'
      : 'border-border focus-visible:ring-primary/15',
  );
}
