import type { Fuel, SourceResult, SpikeStation } from './types.ts';

// LUSTAT (.Stat Suite von STATEC) — SDMX-REST-API, Daten CC0.
// DF_E5301 = Prix maxima essence (SP95/SP98), DF_E5302 = Prix maxima gasoil routier.
const BASE = 'https://lustat.statec.lu/rest/data';
const FLOWS = ['DSD_PRIX_ESSENCE@DF_E5301', 'DSD_PRIX_ESSENCE@DF_E5302'] as const;

// LU kennt nur SP95/SP98/Diesel. An LU-Zapfsäulen ist "95" E10 und "98" E5 —
// vorläufiges Mapping, wird in Phase 2 gegen offizielle Quelle verifiziert (siehe Spike-README).
const FUEL_MAP: Record<string, Fuel> = { DIE: 'diesel', SP95: 'e10', SP98: 'e5' };

// Kuratierte Stationen auf der Achse — in LU gilt überall derselbe amtliche Höchstpreis,
// die Stationen sind nur geografische Anker für Entfernungs-Filter und Karte.
const AXIS_STATIONS = [
  { name: 'Tankstellen Frisange (amtl. Höchstpreis)', ort: 'Frisange', lat: 49.5106, lon: 6.1908 },
  { name: 'Tankstellen Dudelange (amtl. Höchstpreis)', ort: 'Dudelange', lat: 49.4806, lon: 6.0875 },
  { name: 'Tankstellen Schengen (amtl. Höchstpreis)', ort: 'Schengen', lat: 49.4703, lon: 6.3644 },
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

async function fetchFlow(flow: string): Promise<{ fuelCode: string; date: string; price: number }[]> {
  const url = `${BASE}/LU1,${flow},1.0/all?lastNObservations=1`;
  const res = await fetch(url, { headers: { Accept: 'application/vnd.sdmx.data+csv' } });
  if (!res.ok) throw new Error(`LU ${flow}: HTTP ${res.status}`);
  const lines = (await res.text()).trim().split('\n');
  const header = parseCsvLine(lines[0]);
  const iEnergy = header.indexOf('MOTOR_ENERGY');
  const iPeriod = header.indexOf('TIME_PERIOD');
  const iValue = header.indexOf('OBS_VALUE');
  if (iEnergy < 0 || iPeriod < 0 || iValue < 0) {
    throw new Error(`LU ${flow}: unerwartete Spalten: ${header.join(', ')}`);
  }
  return lines.slice(1).map((l) => {
    const cols = parseCsvLine(l);
    return { fuelCode: cols[iEnergy], date: cols[iPeriod], price: Number(cols[iValue]) };
  });
}

export async function fetchLU(): Promise<SourceResult> {
  const notes: string[] = [];
  const rows = (await Promise.all(FLOWS.map(fetchFlow))).flat();

  const prices: SpikeStation['prices'] = {};
  for (const row of rows) {
    const fuel = FUEL_MAP[row.fuelCode];
    if (!fuel) {
      notes.push(`Unbekannter Produktcode ${row.fuelCode} ignoriert`);
      continue;
    }
    prices[fuel] = row.price;
    notes.push(`${row.fuelCode} → ${fuel}: ${row.price} €/l (gültig ab ${row.date})`);
  }

  const stations: SpikeStation[] = AXIS_STATIONS.map((s) => ({
    land: 'LU',
    source: 'STATEC/LUSTAT (amtlicher Höchstpreis)',
    ...s,
    prices,
    isOfficialMax: true,
  }));
  return { source: 'LU', fetchedAt: new Date().toISOString(), stations, notes };
}
