/** Zahlformat wie im Prototyp: de-DE mit fixer Nachkommastellen-Zahl. */
export function fmt(n: number, d = 2): string {
  return n.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d });
}

/**
 * Stationspreis-Anzeige wie im Prototyp: drei Nachkommastellen formatiert,
 * letzte abgeschnitten (1,519 → "1,51" — abgeschnitten, nicht gerundet).
 */
export function fmtPriceTruncated(n: number): string {
  return fmt(n, 3).slice(0, -1);
}

/** "Preise von heute 08:12" bzw. mit Datum, wenn der Snapshot nicht von heute ist. */
export function fmtStand(iso: string): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const today = new Date().toDateString() === d.toDateString();
  if (today) return `heute ${time}`;
  return `${d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}, ${time}`;
}
