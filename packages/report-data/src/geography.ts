import type { GeoPoint } from '@buscohuella/report-domain';

import type { GeographyValue } from './database.types.js';

export const toGeographyPoint = (
  point: GeoPoint | null | undefined,
): GeographyValue =>
  point
    ? `SRID=4326;POINT(${point.longitude} ${point.latitude})`
    : null;

export const fromGeographyPoint = (
  value: GeographyValue,
): GeoPoint | null => {
  if (!value) return null;

  if (typeof value === 'object') {
    const coordinates = value.coordinates;

    if (
      Array.isArray(coordinates) &&
      coordinates.length >= 2 &&
      typeof coordinates[0] === 'number' &&
      typeof coordinates[1] === 'number'
    ) {
      return {
        longitude: coordinates[0],
        latitude: coordinates[1],
      };
    }

    return null;
  }

  const trimmed = value.trim();

  if (/^[0-9a-f]+$/i.test(trimmed) && trimmed.length >= 50) {
    const bytes = new Uint8Array(
      trimmed.match(/.{1,2}/g)?.map((pair) => Number.parseInt(pair, 16)) ?? [],
    );

    if (bytes.length >= 25 && bytes[0] === 1) {
      const view = new DataView(bytes.buffer);
      const longitude = view.getFloat64(9, true);
      const latitude = view.getFloat64(17, true);

      if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
        return { longitude, latitude };
      }
    }
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'coordinates' in parsed
    ) {
      return fromGeographyPoint(
        parsed as { coordinates?: number[] },
      );
    }
  } catch {
    // WKT/EWKT values are handled below.
  }

  const match = trimmed.match(
    /(?:SRID=\d+;)?POINT\s*\(\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s*\)/i,
  );

  if (!match?.[1] || !match[2]) return null;

  return {
    longitude: Number(match[1]),
    latitude: Number(match[2]),
  };
};
