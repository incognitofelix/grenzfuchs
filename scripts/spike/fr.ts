import { unzipSync } from 'fflate';
import { XMLParser } from 'fast-xml-parser';
import type { Fuel, SourceResult, SpikeStation } from './types.ts';

const URL = 'https://donnees.roulez-eco.fr/opendata/instantane';

// Grober Korridor um Forbach / Stiring-Wendel / Sarreguemines (Achsen-Abschnitt FR)
const BBOX = { latMin: 49.05, latMax: 49.35, lonMin: 6.7, lonMax: 7.15 };

// FR-Produktnamen → unser Format. FR verkauft SP95 (E5) und E10 getrennt.
const FUEL_MAP: Record<string, Fuel> = { Gazole: 'diesel', SP95: 'e5', E10: 'e10' };

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

export async function fetchFR(): Promise<SourceResult> {
  const notes: string[] = [];
  const res = await fetch(URL);
  if (!res.ok) throw new Error(`FR: HTTP ${res.status}`);
  const zip = new Uint8Array(await res.arrayBuffer());

  const files = unzipSync(zip);
  const xmlName = Object.keys(files).find((f) => f.endsWith('.xml'));
  if (!xmlName) throw new Error(`FR: keine XML im ZIP (Inhalt: ${Object.keys(files).join(', ')})`);
  // Der Flux ist ISO-8859-1-codiert (steht im XML-Prolog) — UTF-8-Decode würde Ortsnamen zerstören.
  const xml = new TextDecoder('iso-8859-1').decode(files[xmlName]);
  notes.push(`ZIP enthält ${xmlName} (${(files[xmlName].length / 1e6).toFixed(1)} MB XML)`);

  const parser = new XMLParser({ ignoreAttributes: false });
  const doc = parser.parse(xml);
  const pdvs: PdvNode[] = doc.pdv_liste?.pdv ?? [];
  notes.push(`${pdvs.length} Stationen in Frankreich gesamt`);

  const stations: SpikeStation[] = [];
  for (const pdv of pdvs) {
    // Koordinaten liegen im Flux in PTV_GEODECIMAL: Grad × 100 000
    const lat = Number(pdv['@_latitude']) / 100000;
    const lon = Number(pdv['@_longitude']) / 100000;
    if (lat < BBOX.latMin || lat > BBOX.latMax || lon < BBOX.lonMin || lon > BBOX.lonMax) continue;

    const prixList = pdv.prix === undefined ? [] : Array.isArray(pdv.prix) ? pdv.prix : [pdv.prix];
    const prices: SpikeStation['prices'] = {};
    for (const prix of prixList) {
      const fuel = FUEL_MAP[prix['@_nom']];
      if (fuel) prices[fuel] = Number(prix['@_valeur']);
    }
    if (Object.keys(prices).length === 0) continue;

    stations.push({
      land: 'FR',
      source: 'prix-carburants.gouv.fr (flux instantané)',
      // Der Flux enthält keine Markennamen — nur Adresse/Ort. Namen kämen aus dem
      // Zusatz-Dataset "Points de vente"; für den Spike reicht die Adresse.
      name: String(pdv.adresse ?? `PDV ${pdv['@_id']}`),
      ort: String(pdv.ville ?? '?'),
      lat,
      lon,
      prices,
    });
  }
  return { source: 'FR', fetchedAt: new Date().toISOString(), stations, notes };
}
