import { unzipSync } from 'fflate';
import { XMLParser } from 'fast-xml-parser';
import type { Fuel, SourceInfo, Station } from '../../app/data/types.ts';

const URL = 'https://donnees.roulez-eco.fr/opendata/instantane';

// Grober Korridor um Forbach / Stiring-Wendel / Sarreguemines (Achsen-Abschnitt FR)
const BBOX = { latMin: 49.05, latMax: 49.35, lonMin: 6.7, lonMax: 7.15 };

// FR verkauft SP95 (E5) und E10 als getrennte Produkte
const FUEL_MAP: Record<string, Fuel> = { Gazole: 'diesel', SP95: 'e5', E10: 'e10' };

export const FR_SOURCE: SourceInfo = {
  land: 'FR',
  name: 'prix-carburants.gouv.fr (flux instantané)',
  url: 'https://www.prix-carburants.gouv.fr/rubrique/opendata/',
  license: 'Licence Ouverte 2.0',
};

interface PrixNode {
  '@_nom': string;
  '@_valeur': string;
}
interface PdvNode {
  '@_id': string;
  '@_latitude': string;
  '@_longitude': string;
  adresse?: string;
  ville?: string;
  prix?: PrixNode | PrixNode[];
}

/** Titel-Case für die durchgehend GROSSGESCHRIEBENEN Adressen/Orte im FR-Flux */
function titleCase(s: string): string {
  return s.toLowerCase().replace(/(^|[\s\-'.])\p{L}/gu, (m) => m.toUpperCase());
}

export async function fetchFR(): Promise<Omit<Station, 'kmFromSb'>[]> {
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`FR: HTTP ${res.status}`);
  const zip = new Uint8Array(await res.arrayBuffer());

  const files = unzipSync(zip);
  const xmlName = Object.keys(files).find((f) => f.endsWith('.xml'));
  if (!xmlName) throw new Error(`FR: keine XML im ZIP (Inhalt: ${Object.keys(files).join(', ')})`);
  // Der Flux ist ISO-8859-1-codiert (steht im XML-Prolog) — UTF-8-Decode würde Ortsnamen zerstören.
  const xml = new TextDecoder('iso-8859-1').decode(files[xmlName]);

  const parser = new XMLParser({ ignoreAttributes: false });
  const doc = parser.parse(xml);
  const pdvs: PdvNode[] = doc.pdv_liste?.pdv ?? [];

  const stations: Omit<Station, 'kmFromSb'>[] = [];
  for (const pdv of pdvs) {
    // Koordinaten liegen im Flux in PTV_GEODECIMAL: Grad × 100 000
    const lat = Number(pdv['@_latitude']) / 100000;
    const lon = Number(pdv['@_longitude']) / 100000;
    if (lat < BBOX.latMin || lat > BBOX.latMax || lon < BBOX.lonMin || lon > BBOX.lonMax) continue;

    const prixList = pdv.prix === undefined ? [] : Array.isArray(pdv.prix) ? pdv.prix : [pdv.prix];
    const prices: Station['prices'] = {};
    for (const prix of prixList) {
      const fuel = FUEL_MAP[prix['@_nom']];
      if (fuel) prices[fuel] = Number(prix['@_valeur']);
    }
    if (Object.keys(prices).length === 0) continue;

    stations.push({
      id: `fr-${pdv['@_id']}`,
      land: 'FR',
      // Der Flux enthält keine Markennamen — nur Adresse/Ort (siehe scripts/spike/README.md)
      name: titleCase(String(pdv.adresse ?? `Station ${pdv['@_id']}`)),
      ort: titleCase(String(pdv.ville ?? '?')),
      lat,
      lon,
      prices,
    });
  }
  return stations;
}
