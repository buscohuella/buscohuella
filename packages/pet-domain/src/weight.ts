import { PET_LIMITS } from './constants.js';

const WEIGHT_PATTERN = /^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/;

export function parseOptionalWeight(value: string | null | undefined): number | null {
  const normalizedValue = value?.trim() ?? '';

  if (!normalizedValue) return null;
  if (!WEIGHT_PATTERN.test(normalizedValue)) return Number.NaN;

  const parsed = Number(normalizedValue.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function isPetWeightValid(weightKg: number | null): boolean {
  return (
    weightKg !== null &&
    Number.isFinite(weightKg) &&
    weightKg > 0 &&
    weightKg <= PET_LIMITS.weightMaxKg
  );
}
