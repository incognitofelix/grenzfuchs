import type { SourceInfo, Station } from '../../app/data/types.ts';

// Tankerkönig (MTS-K), CC BY 4.0 — Attribution in README & App-Footer!
// Key aus .env / Actions-Secret; Abruf nur im Cron-Job, nie pro App-Besucher.
const URL = 'https://creativecommons.tankerkoenig.de/json/list.php';
const SB = { lat: 49.2354, lng: 6.9819, rad: 15 };

export const DE_SOURCE: SourceInfo = {
  land: 'DE',
  name: 'Tankerkönig (MTS-K)',
  url: 'https://www.tankerkoenig.de/',
  license: 'CC BY 4.0',
};

interface TkStation {
  id: string;
  name: string;
  brand: string;
  place: string;
  lat: number;
  lng: number;
  diesel: number | null;
  e5: number | null;
  e10: number | null;
  isOpen: boolean;
}

export async function fetchDE(apiKey: string): Promise<Omit<Station, 'kmFromSb'>[]> {
  const params = new URLSearchParams({
    lat: String(SB.lat),
    lng: String(SB.lng),
    rad: String(SB.rad),
    sort: 'dist',
    type: 'all',
    apikey: apiKey,
  });
  const res = await fetch(`${URL}?${params}`);
  if (!res.ok) throw new Error(`DE: HTTP ${res.status}`);
  const data = (await res.json()) as { ok: boolean; message?: string; stations?: TkStation[] };
  if (!data.ok) throw new Error(`DE: API-Fehler: ${data.message}`);

  return (data.stations ?? [])
    .filter((s) => s.isOpen)
    .map((s) => ({
      id: `de-${s.id}`,
      land: 'DE' as const,
      name: s.brand || s.name,
      ort: s.place,
      lat: s.lat,
      lon: s.lng,
      prices: {
        ...(s.diesel ? { diesel: s.diesel } : {}),
        ...(s.e5 ? { e5: s.e5 } : {}),
        ...(s.e10 ? { e10: s.e10 } : {}),
      },
    }))
    .filter((s) => Object.keys(s.prices).length > 0);
}
