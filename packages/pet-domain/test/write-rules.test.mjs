import assert from 'node:assert/strict';
import test from 'node:test';

import {
  canEditPet,
  isPetSpeciesAllowed,
} from '../dist/index.js';

const species = [
  { id: 1, isEnabled: true, mvpEnabled: true },
  { id: 2, isEnabled: false, mvpEnabled: true },
  { id: 3, isEnabled: true, mvpEnabled: false },
];

test('solo permite especies habilitadas y admitidas por MVP', () => {
  assert.equal(isPetSpeciesAllowed(species, 1), true);
  assert.equal(isPetSpeciesAllowed(species, 2), false);
  assert.equal(isPetSpeciesAllowed(species, 3), false);
  assert.equal(isPetSpeciesAllowed(species, 999), false);
});

test('solo permite editar mascotas activas', () => {
  assert.equal(canEditPet('ACTIVE'), true);
  assert.equal(canEditPet('ARCHIVED'), false);
  assert.equal(canEditPet('DECEASED'), false);
});
