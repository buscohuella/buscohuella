import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const source = await readFile(
  new URL('../src/features/pets/components/pet-form-fields.tsx', import.meta.url),
  'utf8',
);
const actionSource = await readFile(
  new URL('../src/features/pets/actions/create-pet.ts', import.meta.url),
  'utf8',
);
const resolverSource = await readFile(
  new URL('../src/features/pets/lib/resolve-pet-form-species.ts', import.meta.url),
  'utf8',
);
const resolverModule = await import(
  `data:text/javascript;base64,${Buffer.from(ts.transpileModule(resolverSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText).toString('base64')}`
);
const { resolvePetFormSpeciesId, toPetSpeciesIdOrNull } = resolverModule;

test('mantiene el selector de especie sincronizado cuando no hay selección', () => {
  assert.match(source, /<Select[^>]*name="speciesId"[^>]*value=\{speciesId \?\? ''\}/s);
  assert.match(source, /<option value="" disabled=\{speciesId !== null\}>/);
});

test('conserva Gato tras submit inválido con un nuevo action state', () => {
  const initialActionState = { status: 'idle' };
  const failedActionState = { status: 'error', speciesId: 2 };

  assert.equal(resolvePetFormSpeciesId({
    actionState: initialActionState,
    actionStateAtLocalSelection: initialActionState,
    localSpeciesId: 2,
  }), 2);
  assert.equal(resolvePetFormSpeciesId({
    actionState: failedActionState,
    actionStateAtLocalSelection: initialActionState,
    localSpeciesId: 2,
  }), 2);
  assert.match(actionSource, /speciesId: toPetSpeciesIdOrNull\(speciesId\)/);
});

test('conserva Perro y otra especie, pero mantiene el placeholder si la acción no recibió especie', () => {
  const initialActionState = { status: 'idle' };

  for (const speciesId of [1, 4]) {
    assert.equal(resolvePetFormSpeciesId({
      actionState: { status: 'error', speciesId },
      actionStateAtLocalSelection: initialActionState,
      localSpeciesId: speciesId,
    }), speciesId);
  }
  assert.equal(resolvePetFormSpeciesId({
    actionState: { status: 'error', speciesId: null },
    actionStateAtLocalSelection: initialActionState,
    localSpeciesId: null,
  }), null);
  assert.equal(toPetSpeciesIdOrNull(0), null);
});

test('una selección posterior del usuario reemplaza el resultado anterior de la acción', () => {
  const failedActionState = { status: 'error', speciesId: 2 };

  assert.equal(resolvePetFormSpeciesId({
    actionState: failedActionState,
    actionStateAtLocalSelection: failedActionState,
    localSpeciesId: 4,
  }), 4);
});

test('mantiene la lógica de raza ligada a la especie restaurada', () => {
  assert.match(source, /speciesId=\{speciesId\}/);
  assert.match(source, /key=\{`\$\{speciesId \?\? 'none'\}/);
  assert.match(source, /value=\{speciesId \?\? ''\}/);
  assert.match(source, /onReset=\{\(event\) => event\.preventDefault\(\)\}/);
});
