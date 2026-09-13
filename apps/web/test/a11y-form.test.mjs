import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const summarySource = await readFile(
  new URL('../src/components/ui/form-error-summary.tsx', import.meta.url),
  'utf8',
);
const petFormSource = await readFile(
  new URL('../src/features/pets/components/pet-form-fields.tsx', import.meta.url),
  'utf8',
);
const focusSource = await readFile(
  new URL('../src/components/ui/form-error-summary-focus.ts', import.meta.url),
  'utf8',
);
const focusModule = await import(
  `data:text/javascript;base64,${Buffer.from(ts.transpileModule(focusSource, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText).toString('base64')}`,
);
const { didInvalidSubmissionComplete } = focusModule;

test('el resumen enfoca y desplaza respetando la cabecera sticky y reduced motion', () => {
  assert.match(summarySource, /tabIndex=\{-1\}/);
  assert.match(summarySource, /summary\.focus\(\{ preventScroll: true \}\)/);
  assert.match(summarySource, /useLayoutEffect/);
  assert.doesNotMatch(summarySource, /requestAnimationFrame/);
  assert.match(summarySource, /prefers-reduced-motion: reduce/);
});

test('cada submit inválido completado genera un trigger aunque los errores se repitan', () => {
  const completeInvalidSubmit = ({ wasPending, hasErrors }) =>
    didInvalidSubmissionComplete({ wasPending, hasErrors, isPending: false });

  assert.equal(completeInvalidSubmit({ wasPending: false, hasErrors: true }), false);
  assert.equal(completeInvalidSubmit({ wasPending: true, hasErrors: true }), true);
  assert.equal(completeInvalidSubmit({ wasPending: true, hasErrors: true }), true);
  assert.equal(completeInvalidSubmit({ wasPending: true, hasErrors: false }), false);
  assert.match(summarySource, /useInvalidFormSubmissionFocusKey/);
  assert.match(petFormSource, /focusKey=\{errorSummaryFocusKey\}/);
});

test('la cabecera sticky reserva espacio global para el resumen y los anclajes de campos', async () => {
  const globalStyles = await readFile(
    new URL('../src/app/globals.css', import.meta.url),
    'utf8',
  );
  assert.match(globalStyles, /--sticky-header-scroll-offset: 7rem/);
  assert.match(globalStyles, /scroll-padding-top: var\(--sticky-header-scroll-offset\)/);
});
