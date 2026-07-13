/**
 * Daten-Spike: beweist, dass alle drei Preisquellen live abrufbar und auf EIN
 * gemeinsames Format (SpikeStation) normalisierbar sind.
 *
 *   npm run spike
 *
 * DE braucht TANKERKOENIG_API_KEY in .env — ohne Key wird DE übersprungen,
 * FR + LU laufen trotzdem.
 */
import { writeFileSync } from 'node:fs';
import { fetchFR } from './fr.ts';
import { fetchLU } from './lu.ts';
import { fetchDE } from './de.ts';
import type { SourceResult } from './types.ts';

try {
  process.loadEnvFile();
} catch {
  /* keine .env vorhanden — ok */
}

const results: SourceResult[] = [];
const errors: string[] = [];

for (const [label, run] of [
  ['FR', fetchFR],
  ['LU', fetchLU],
] as const) {
  try {
    results.push(await run());
  } catch (e) {
    errors.push(`${label}: ${e instanceof Error ? e.message : e}`);
  }
}

const apiKey = process.env.TANKERKOENIG_API_KEY;
if (apiKey) {
  try {
    results.push(await fetchDE(apiKey));
  } catch (e) {
    errors.push(`DE: ${e instanceof Error ? e.message : e}`);
  }
} else {
  errors.push('DE: übersprungen — kein TANKERKOENIG_API_KEY in .env (Registrierung: https://creativecommons.tankerkoenig.de)');
}

for (const r of results) {
  console.log(`\n═══ ${r.source} ═══ (${r.stations.length} Stationen, ${r.fetchedAt})`);
  for (const note of r.notes) console.log(`  ℹ ${note}`);
  for (const s of r.stations.slice(0, 8)) {
    const prices = Object.entries(s.prices)
      .map(([f, p]) => `${f} ${p.toFixed(3)}`)
      .join(' · ');
    console.log(`  ${s.land} ${s.name.slice(0, 38).padEnd(38)} ${s.ort.slice(0, 18).padEnd(18)} ${prices}${s.isOfficialMax ? '  [amtl. Max]' : ''}`);
  }
  if (r.stations.length > 8) console.log(`  … +${r.stations.length - 8} weitere`);
}

if (errors.length) {
  console.log('\n⚠ Probleme:');
  for (const e of errors) console.log(`  ${e}`);
}

const out = new URL('./spike-output.json', import.meta.url).pathname;
writeFileSync(out, JSON.stringify(results, null, 2));
console.log(`\n→ Vollständiger Output: ${out}`);
console.log(results.length >= 2 ? '✓ Spike-Ziel: gemeinsames Format für alle abgerufenen Quellen erfüllt.' : '✗ Spike unvollständig.');
