'use client';

import type { PetSpecies } from '@buscohuella/pet-domain';
import type { ReactNode } from 'react';
import { useActionState } from 'react';
import { ArrowLeft, PawPrint, Save } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { createPetAction } from '../actions/create-pet';
import {
  petSexLabels,
  petSizeLabels,
  petSpeciesLabels,
} from '../lib/pet-labels';
import { initialPetActionState } from '../types/pet-action-state';

export function CreatePetForm({
  species,
}: {
  species: PetSpecies[];
}) {
  const [state, formAction, isPending] = useActionState(
    createPetAction,
    initialPetActionState,
  );

  return (
    <form action={formAction} className="space-y-8">
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
          <h2 className="text-lg font-semibold">
            Información básica
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Empieza por los datos que mejor identifican a tu mascota.
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
              defaultValue=""
              required
              aria-invalid={
                Boolean(state.fieldErrors?.speciesId) || undefined
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
              maxLength={80}
              autoComplete="off"
              hasError={Boolean(state.fieldErrors?.name)}
              required
            />
          </Field>

          <Field
            id="pet-breed"
            label="Raza"
            hint="Déjalo vacío si no la conoces."
            error={state.fieldErrors?.breed}
          >
            <Input
              id="pet-breed"
              name="breed"
              maxLength={120}
              hasError={Boolean(state.fieldErrors?.breed)}
            />
          </Field>

          <Field id="pet-sex" label="Sexo">
            <select
              id="pet-sex"
              name="sex"
              defaultValue="UNKNOWN"
              className={selectClasses(false)}
            >
              {Object.entries(petSexLabels).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </Field>

          <Field id="pet-size" label="Tamaño">
            <select
              id="pet-size"
              name="size"
              defaultValue="UNKNOWN"
              className={selectClasses(false)}
            >
              {Object.entries(petSizeLabels).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
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
              maxLength={80}
              hasError={Boolean(state.fieldErrors?.primaryColor)}
            />
          </Field>

          <div className="flex items-center">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-soft bg-surface p-4">
              <input
                type="checkbox"
                name="isMixedBreed"
                className="size-5 accent-[var(--primary)]"
              />
              <span>
                <span className="block font-semibold">
                  Es mestiza
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Marca esta opción si es un cruce de razas.
                </span>
              </span>
            </label>
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t border-border-soft pt-7">
        <div>
          <h2 className="text-lg font-semibold">
            Edad e identificación
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Estos datos ayudan a diferenciar animales parecidos.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="pet-birth-date"
            label="Fecha de nacimiento"
            hint="Puede ser exacta o aproximada."
            error={state.fieldErrors?.birthDate}
          >
            <Input
              id="pet-birth-date"
              name="birthDate"
              type="date"
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
              defaultValue="EXACT"
              className={selectClasses(
                Boolean(state.fieldErrors?.birthDatePrecision),
              )}
            >
              <option value="EXACT">Exacta</option>
              <option value="APPROXIMATE">Aproximada</option>
            </select>
          </Field>
        </div>

        <div
          className={cn(
            'rounded-xl border bg-surface p-5',
            state.fieldErrors?.microchipNumber
              ? 'border-danger bg-danger/5'
              : 'border-border-soft',
          )}
        >
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="hasMicrochip"
              className="mt-1 size-5 accent-[var(--primary)]"
            />
            <span>
              <span className="block font-semibold">
                Tiene microchip
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                El número es privado y no se mostrará públicamente.
              </span>
            </span>
          </label>

          <div className="mt-4 max-w-md">
            <Field
              id="pet-microchip"
              label="Número de microchip"
              hint="Introduce solo letras y números; los espacios y guiones se normalizan."
              error={state.fieldErrors?.microchipNumber}
            >
              <Input
                id="pet-microchip"
                name="microchipNumber"
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
        <div>
          <h2 className="text-lg font-semibold">
            Descripción
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Añade rasgos que permitan reconocerla con facilidad.
          </p>
        </div>

        <Field
          id="pet-description"
          label="Descripción general"
          error={state.fieldErrors?.description}
        >
          <textarea
            id="pet-description"
            name="description"
            maxLength={1000}
            rows={4}
            aria-invalid={
              Boolean(state.fieldErrors?.description) || undefined
            }
            className={textareaClasses(
              Boolean(state.fieldErrors?.description),
            )}
          />
        </Field>

        <Field
          id="pet-distinctive-features"
          label="Rasgos distintivos"
          hint="Por ejemplo: una mancha, cicatriz, forma de las orejas o color del collar."
          error={state.fieldErrors?.distinctiveFeatures}
        >
          <textarea
            id="pet-distinctive-features"
            name="distinctiveFeatures"
            maxLength={1000}
            rows={4}
            aria-invalid={
              Boolean(state.fieldErrors?.distinctiveFeatures) ||
              undefined
            }
            className={textareaClasses(
              Boolean(state.fieldErrors?.distinctiveFeatures),
            )}
          />
        </Field>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-border-soft pt-6 sm:flex-row sm:justify-between">
        <Link
          href="/mis-mascotas"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 font-semibold text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          <ArrowLeft className="size-5" aria-hidden="true" />
          Cancelar
        </Link>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <PawPrint
              className="size-5 animate-pulse"
              aria-hidden="true"
            />
          ) : (
            <Save className="size-5" aria-hidden="true" />
          )}
          {isPending ? 'Registrando...' : 'Registrar mascota'}
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
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold"
      >
        {label}
      </label>

      {children}

      {hint ? (
        <p className="mt-2 text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p className="mt-2 text-sm font-medium text-danger">
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
      ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/15'
      : 'border-border focus-visible:border-primary focus-visible:ring-primary/15',
  );
}

function textareaClasses(hasError: boolean) {
  return cn(
    'w-full resize-y rounded-lg border bg-surface-elevated px-3 py-3 text-base text-foreground',
    'placeholder:text-subtle-foreground focus-visible:outline-none focus-visible:ring-4',
    hasError
      ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/15'
      : 'border-border focus-visible:border-primary focus-visible:ring-primary/15',
  );
}
