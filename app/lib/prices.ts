import type { Fuel, Land, PriceSnapshot, Station } from '../data/types';

export const FUEL_NAMES: Record<Fuel, string> = {
  diesel: 'Diesel',
  e5: 'Super E5',
  e10: 'Super E10',
};

export const LAND_NAMES: Record<Land, string> = {
  DE: 'Deutschland',
  FR: 'Frankreich',
  LU: 'Luxemburg',
};

/** Anzeige-Reihenfolge der Länder (günstigstes Land zuerst — LU→FR→DE wie im Prototyp) */
export const LAND_ORDER: Record<Land, number> = { LU: 0, FR: 1, DE: 2 };

export function stationsInRadius(snapshot: PriceSnapshot, radius: number): Station[] {
  return snapshot.stations.filter((s) => s.kmFromSb <= radius);
}

/** Günstigster Preis eines Landes für einen Kraftstoff — null, wenn keine Daten. */
export function minLandPrice(stations: Station[], land: Land, fuel: Fuel): number | null {
  let min: number | null = null;
  for (const s of stations) {
    if (s.land !== land) continue;
    const p = s.prices[fuel];
    if (p !== undefined && (min === null || p < min)) min = p;
  }
  return min;
}

/** Günstigster Preis über alle Stationen — null, wenn keine Daten. */
export function bestPrice(stations: Station[], fuel: Fuel): number | null {
  let min: number | null = null;
  for (const s of stations) {
    const p = s.prices[fuel];
    if (p !== undefined && (min === null || p < min)) min = p;
  }
  return min;
}
