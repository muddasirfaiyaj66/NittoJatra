import { ApiLocation } from '@/services/api.types';
import { DhakaLocation } from '@/types';

export function geoJsonToLatLng(
  coords?: ApiLocation['coordinates'],
): [number, number] | null {
  if (!coords?.coordinates?.length) return null;
  const [lng, lat] = coords.coordinates;
  return [lat, lng];
}

export function normalizeLocationKey(value: string): string {
  return value.trim().toLowerCase();
}

export function buildLocationCoordLookup(
  locations: DhakaLocation[],
  fallback: Record<string, [number, number]> = {},
): Record<string, [number, number]> {
  const lookup: Record<string, [number, number]> = { ...fallback };

  for (const location of locations) {
    if (location.latitude == null || location.longitude == null) continue;
    const latLng: [number, number] = [location.latitude, location.longitude];
    lookup[normalizeLocationKey(location.nameEn)] = latLng;
    lookup[normalizeLocationKey(location.name)] = latLng;
    lookup[normalizeLocationKey(location.zone)] = latLng;
  }

  return lookup;
}

export function findCoordsInLookup(
  query: string,
  lookup: Record<string, [number, number]>,
): [number, number] | null {
  const key = normalizeLocationKey(query);
  if (!key) return null;
  if (lookup[key]) return lookup[key];

  for (const [name, coords] of Object.entries(lookup)) {
    if (key.includes(name) || name.includes(key)) {
      return coords;
    }
  }

  return null;
}
