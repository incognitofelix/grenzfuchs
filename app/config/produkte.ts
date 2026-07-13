import { FREIMENGEN } from './freimengen';

export type ProduktKey = 'sprit' | 'tabak' | 'kaffee' | 'alkohol';

export interface ProduktDef {
  key: ProduktKey;
  icon: string;
  name: string;
  unit: string;
  /** Beispielpreise (Stand Design-Handoff); Sprit kommt live aus prices.json */
  de: number | null;
  lu: number | null;
  step: number;
  limit: number;
  limitText: string;
}

/**
 * Produktdefinitionen des Grenzshopping-Rechners.
 * Tabak/Kaffee/Spirituosen: Beispielpreise (in der App als solche gekennzeichnet).
 * Limits: aus FREIMENGEN abgeleitet (amtlich verifiziert, siehe dort).
 */
export const PRODUKTE: ProduktDef[] = [
  {
    key: 'sprit',
    icon: '⛽',
    name: 'Tanken', // wird im Screen um die gewählte Sorte ergänzt
    unit: 'Liter',
    de: null, // live aus prices.json (gewählter Kraftstoff)
    lu: null,
    step: 10,
    // UX-Vereinfachung wie im Prototyp: 50-l-Tank + verifizierte 20-l-Kanister-Regel
    limit: 50 + FREIMENGEN.kraftstoffReserve.limit,
    limitText: 'voller Tank + 20 l Kanister (pro Fahrzeug)',
  },
  {
    key: 'tabak',
    icon: '🚬',
    name: 'Zigaretten',
    unit: 'Stange (200 Stk.)',
    de: 84.0,
    lu: 56.5,
    step: 1,
    limit: FREIMENGEN.zigaretten.limit / 200,
    limitText: '4 Stangen (800 Zigaretten)',
  },
  {
    key: 'kaffee',
    icon: '☕',
    name: 'Kaffee',
    unit: 'kg',
    de: 9.9,
    lu: 8.1,
    step: 1,
    limit: FREIMENGEN.kaffee.limit,
    limitText: '10 kg pro Person',
  },
  {
    key: 'alkohol',
    icon: '🥃',
    name: 'Spirituosen',
    unit: 'Flasche 0,7 l',
    de: 13.99,
    lu: 10.4,
    step: 1,
    limit: Math.floor(FREIMENGEN.spirituosen.limit / 0.7),
    limitText: '10 l Spirituosen (≈ 14 Flaschen)',
  },
];
