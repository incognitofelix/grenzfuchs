/** Referenzpunkt der Achse: Saarbrücken-Zentrum */
export const SAARBRUECKEN = { lat: 49.2354, lon: 6.9819 };

const EARTH_RADIUS_KM = 6371;

/** Großkreis-Distanz (Luftlinie) in km */
export function haversineKm(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(bLat - aLat);
  const dLon = rad(bLon - aLon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}
