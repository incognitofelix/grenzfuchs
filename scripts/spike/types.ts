export type Fuel = 'diesel' | 'e5' | 'e10';

/** Gemeinsames Zielformat des Spikes — beweist, dass alle drei Quellen hierauf normalisierbar sind. */
export interface SpikeStation {
  land: 'DE' | 'FR' | 'LU';
  source: string;
  name: string;
  ort: string;
  lat: number;
  lon: number;
  /** Preise in €/l */
  prices: Partial<Record<Fuel, number>>;
  /** LU: amtlich fixierter Höchstpreis, gilt landesweit */
  isOfficialMax?: boolean;
}

export interface SourceResult {
  source: string;
  fetchedAt: string;
  stations: SpikeStation[];
  notes: string[];
}
