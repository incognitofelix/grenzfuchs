import type { Fuel, SourceInfo, Station } from '../../app/data/types.ts';

// LUSTAT (.Stat Suite von STATEC) — SDMX-REST-API, Daten CC0.
// DF_E5301 = Prix maxima essence (SP95/SP98), DF_E5302 = Prix maxima gasoil routier.
const BASE = 'https://lustat.statec.lu/rest/data';
const FLOWS = ['DSD_PRIX_ESSENCE@DF_E5301', 'DSD_PRIX_ESSENCE@DF_E5302'] as const;

// LU kennt nur SP95/SP98/Diesel. An LU-Zapfsäulen ist "95" E10 und "98" E5 —
// vorläufiges Mapping, Verifikation gegen offizielle Quelle steht aus (Spike-README).
const FUEL_MAP: Record<string, Fuel> = { DIE: 'diesel', SP95: 'e10', SP98: 'e5' };

export const LU_SOURCE: SourceInfo = {
  land: 'LU',
  name: 'STATEC/LUSTAT — amtliche Höchstpreise',
  url: 'https://lustat.statec.lu/',
  license: 'CC0',
};

// In LU gilt überall derselbe Höchstpreis — Stationen sind nur geografische Anker auf der Achse.
const AXIS_STATIONS = [
  { id: 'lu-frisange', name: 'Gulf Frisange', ort: 'Frisange', lat: 49.5106, lon: 6.1908 },
  { id: 'lu-dudelange', name: 'Q8 Dudelange', ort: 'Dudelange', lat: 49.4806, lon: 6.0875 },
  { id: 'lu-schengen', name: 'Shell Schengen', ort: 'Schengen', lat: 49.4703, lon: 6.3644 },
];

/** Minimaler CSV-Zeilen-Parser mit Quote-Handling (SDMX-CSV kann Kommas in Kommentarfeldern haben). */
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cur += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { out.push(cur); cur = ''; }
    else cur += c;
  }
  out.push(cur);
  return out;
}

async function fetchFlow(flow: string): Promise<{ fuelCode: string; price: number }[]> {
  const url = `${BASE}/LU1,${flow},1.0/all?lastNObservations=1`;
  // Accept-Language explizit: Nodes fetch sendet sonst "Accept-Language: *",
  // worauf das .NET-Backend von LUSTAT mit HTTP 500 ("languageTag") antwortet.
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.sdmx.data+csv', 'Accept-Language': 'en' },
  });
  if (!res.ok) throw new Error(`LU ${flow}: HTTP ${res.status}`);
  const lines = (await res.text()).trim().split('\n');
  const header = parseCsvLine(lines[0]);
  const iEnergy = header.indexOf('MOTOR_ENERGY');
  const iValue = header.indexOf('OBS_VALUE');
  if (iEnergy < 0 || iValue < 0) {
    throw new Error(`LU ${flow}: unerwartete Spalten: ${header.join(', ')}`);
  }
  return lines.slice(1).map((l) => {
    const cols = parseCsvLine(l);
    return { fuelCode: cols[iEnergy], price: Number(cols[iValue]) };
  });
}

export async function fetchLU(): Promise<Omit<Station, 'kmFromSb'>[]> {
  const rows = (await Promise.all(FLOWS.map(fetchFlow))).flat();

  const prices: Station['prices'] = {};
  for (const row of rows) {
    const fuel = FUEL_MAP[row.fuelCode];
    if (fuel) prices[fuel] = row.price;
  }
  if (Object.keys(prices).length === 0) throw new Error('LU: keine Preise erhalten');

  return AXIS_STATIONS.map((s) => ({
    land: 'LU' as const,
    ...s,
    prices,
    isOfficialMax: true,
  }));
}
