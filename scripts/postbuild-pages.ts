/**
 * Postbuild für GitHub Pages (läuft nach `react-router build`):
 *
 * 1. Flatten: React Router prerendert wegen basename "/grenzfuchs/" alle Seiten
 *    nach build/client/grenzfuchs/**. GitHub Pages served das Artefakt-Root aber
 *    bereits unter /grenzfuchs/ — also wird der Ordner ins Root gehoben, damit
 *    URL-Pfad und Dateipfad wieder übereinanderliegen.
 * 2. 404.html als SPA-Fallback (GitHub Pages liefert sie bei unbekannten Pfaden).
 * 3. Service Worker mit Workbox über den FINALEN Site-Ordner generieren:
 *    App-Shell + Assets precached (offlinefähig), prices.json runtime-cached
 *    (StaleWhileRevalidate — offline gibt's den letzten Stand).
 */
import { copyFileSync, cpSync, existsSync, rmSync } from 'node:fs';
import { generateSW } from 'workbox-build';

const root = new URL('../build/client/', import.meta.url).pathname;
const nested = `${root}grenzfuchs/`;

if (!existsSync(nested)) {
  throw new Error(`${nested} fehlt — erst \`react-router build\` laufen lassen.`);
}
cpSync(nested, root, { recursive: true, force: true });
rmSync(nested, { recursive: true });
copyFileSync(`${root}index.html`, `${root}404.html`);

const { count, size, warnings } = await generateSW({
  globDirectory: root,
  globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
  globIgnores: ['404.html'],
  swDest: `${root}sw.js`,
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  navigateFallback: '/grenzfuchs/index.html',
  navigateFallbackDenylist: [/\/data\//],
  runtimeCaching: [
    {
      urlPattern: /\/data\/prices\.json$/,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'prices' },
    },
  ],
});
for (const w of warnings) console.warn('⚠', w);
console.log(`→ sw.js: ${count} Dateien precached (${(size / 1024).toFixed(0)} KiB)`);
