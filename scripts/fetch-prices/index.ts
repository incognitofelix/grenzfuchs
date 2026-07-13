/**
 * Fetch-Job: ruft alle drei Preisquellen ab, normalisiert sie auf das
 * PriceSnapshot-Schema und schreibt public/data/prices.json — das eine JSON,
 * das die PWA lädt. Läuft lokal (`npm run fetch-prices`, Key aus .env) und
 * im GitHub-Actions-Cron (Key aus Secret).
 *
 * Robustheit: fällt EINE Quelle aus, wird der Snapshot trotzdem geschrieben;
 * unter zwei Quellen bricht der Job mit Exit-Code 1 ab.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import type { PriceSnapshot, SourceInfo, Station } from '../../app/data/types.ts';
import { haversineKm, SAARBRUECKEN } from './geo.ts';
import { DE_SOURCE, fetchDE } from './de.ts';
import { FR_SOURCE, fetchFR } from './fr.ts';
import { fetchLU, LU_SOURCE } from './lu.ts';

try {
  process.loadEnvFile();
} catch {
  /* keine .env (z. B. im CI) — ok */
}

const apiKey = process.env.TANKERKOENIG_API_KEY;
const jobs: { source: SourceInfo; run: () => Promise<Omit<Station, 'kmFromSb'>[]> }[] = [
  { source: FR_SOURCE, run: fetchFR },
  { source: LU_SOURCE, run: fetchLU },
];
if (apiKey) {
  jobs.push({ source: DE_SOURCE, run: () => fetchDE(apiKey) });
} else {
  console.warn('⚠ DE übersprungen: kein TANKERKOENIG_API_KEY gesetzt');
}

const stations: Station[] = [];
const sources: SourceInfo[] = [];
const failures: string[] = [];

const results = await Promise.allSettled(jobs.map((j) => j.run()));
results.forEach((r, i) => {
  const { source } = jobs[i];
  if (r.status === 'fulfilled') {
    sources.push(source);
    for (const s of r.value) {
      stations.push({
        ...s,
        kmFromSb: Math.round(haversineKm(SAARBRUECKEN.lat, SAARBRUECKEN.lon, s.lat, s.lon) * 10) / 10,
      });
    }
    console.log(`✓ ${source.land}: ${r.value.length} Stationen`);
  } else {
    failures.push(`${source.land}: ${r.reason instanceof Error ? r.reason.message : r.reason}`);
  }
});

for (const f of failures) console.error(`✗ ${f}`);
if (sources.length < 2) {
  console.error('Abbruch: weniger als zwei Quellen verfügbar — kein Snapshot geschrieben.');
  process.exit(1);
}

const snapshot: PriceSnapshot = {
  schemaVersion: 1,
  fetchedAt: new Date().toISOString(),
  stations,
  sources,
};

const outDir = new URL('../../public/data/', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}prices.json`, JSON.stringify(snapshot, null, 1));
console.log(`→ ${outDir}prices.json (${stations.length} Stationen, ${sources.length} Quellen, ${snapshot.fetchedAt})`);
