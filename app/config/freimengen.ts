/**
 * Zoll-Richtmengen für Reisen innerhalb der EU (privater Eigenbedarf).
 *
 * NICHT raten oder aus Prototypen kopieren: Jeder Wert ist gegen die amtliche
 * Quelle verifiziert (sourceUrl + verifiedAt). Bei Änderungen der Rechtslage
 * hier aktualisieren und verifiedAt neu setzen.
 *
 * Nuance: Genussmittel-Richtmengen gelten PRO PERSON, die Kraftstoff-Regel
 * (Hauptbehälter + max. 20 l Reservebehälter) gilt PRO FAHRZEUG.
 */

export interface Freimenge {
  limit: number;
  unit: string;
  sourceUrl: string;
  /** Datum der letzten Verifikation gegen die Quelle */
  verifiedAt: string;
  perVehicle?: boolean;
  note?: string;
}

const ZOLL_GENUSSMITTEL =
  'https://www.zoll.de/DE/Privatpersonen/Reisen/Reisen-innerhalb-der-EU/Steuern/Genussmittel/genussmittel_node.html';
const ZOLL_ENERGIE =
  'https://www.zoll.de/DE/Privatpersonen/Reisen/Reisen-innerhalb-der-EU/Steuern/Energieerzeugnisse/energieerzeugnisse_node.html';

export const FREIMENGEN = {
  zigaretten: {
    limit: 800,
    unit: 'Stück',
    sourceUrl: ZOLL_GENUSSMITTEL,
    verifiedAt: '2026-07-14',
  },
  spirituosen: {
    limit: 10,
    unit: 'Liter',
    sourceUrl: ZOLL_GENUSSMITTEL,
    verifiedAt: '2026-07-14',
  },
  kaffee: {
    limit: 10,
    unit: 'kg',
    sourceUrl: ZOLL_GENUSSMITTEL,
    verifiedAt: '2026-07-14',
    note: 'Deutsche Kaffeesteuer — deshalb überhaupt eine Richtmenge',
  },
  kraftstoffReserve: {
    limit: 20,
    unit: 'Liter im Reservebehälter',
    sourceUrl: ZOLL_ENERGIE,
    verifiedAt: '2026-07-14',
    perVehicle: true,
    note: 'Inhalt des Hauptbehälters (Tank) ist unbegrenzt steuerfrei; Regel gilt pro Fahrzeug, nicht pro Person',
  },
} satisfies Record<string, Freimenge>;
