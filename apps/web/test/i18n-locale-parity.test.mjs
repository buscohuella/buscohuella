import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

const localesDir = new URL('../src/features/i18n/locales/', import.meta.url);

function flatten(value, prefix = '', out = new Map()) {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child !== null && typeof child === 'object') {
      flatten(child, path, out);
    } else {
      out.set(path, child);
    }
  }
  return out;
}

function placeholders(text) {
  if (typeof text !== 'string') return [];
  return [...text.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort();
}

async function load(locale, file) {
  const raw = await readFile(new URL(`${locale}/${file}`, localesDir), 'utf8');
  return flatten(JSON.parse(raw));
}

const listJson = async (locale) =>
  (await readdir(new URL(`${locale}/`, localesDir))).filter((f) => f.endsWith('.json')).sort();

const [esFiles, caFiles] = await Promise.all([listJson('es'), listJson('ca')]);

test('es y ca tienen el mismo conjunto de archivos de traducción', () => {
  assert.deepEqual(caFiles, esFiles);
});

for (const file of esFiles.filter((f) => caFiles.includes(f))) {
  test(`es/ca ${file}: mismas claves y mismos parámetros de interpolación`, async () => {
    const [es, ca] = await Promise.all([load('es', file), load('ca', file)]);

    const missingInCa = [...es.keys()].filter((k) => !ca.has(k));
    const missingInEs = [...ca.keys()].filter((k) => !es.has(k));
    const paramMismatches = [...es.keys()]
      .filter((k) => ca.has(k))
      .filter((k) => placeholders(es.get(k)).join() !== placeholders(ca.get(k)).join())
      .map((k) => `${k}: es{${placeholders(es.get(k))}} ca{${placeholders(ca.get(k))}}`);

    assert.deepEqual(
      { missingInCa, missingInEs, paramMismatches },
      { missingInCa: [], missingInEs: [], paramMismatches: [] },
    );
  });
}
