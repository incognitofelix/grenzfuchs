export type Fuel = 'diesel' | 'e5' | 'e10';
export type Land = 'DE' | 'FR' | 'LU';

export interface Station {
  id: string;
  land: Land;
  name: string;
  ort: string;
  lat: number;
  lon: number;
  /** Luftlinie ab Saarbrücken-Zentrum in km — Basis für den Umkreis-Filter */
  kmFromSb: number;
  /** Preise in €/l */
  prices: Partial<Record<Fuel, number>>;
  /** LU: amtlich fixierter Höchstpreis, gilt landesweit an jeder Station */
  isOfficialMax?: boolean;
}

export interface SourceInfo {
  land: Land;
  name: string;
  url: string;
  license: string;
}

/** Das eine JSON, das die PWA lädt — vom Fetch-Job erzeugt, offline gecached. */
export interface PriceSnapshot {
  schemaVersion: 1;
  fetchedAt: string;
  stations: Station[];
  sources: SourceInfo[];
}
