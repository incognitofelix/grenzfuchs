import type { Config } from '@react-router/dev/config';
import { articles } from './app/content/articles';

export default {
  // Kein Laufzeit-Server (GitHub Pages ist rein statisch): alle Routen werden
  // beim Build zu HTML prerendered — echtes <h1>/<meta> für SEO, danach hydratisiert
  // die App und läuft als SPA weiter.
  ssr: false,
  basename: '/grenzfuchs/',
  prerender: [
    '/',
    '/sprit',
    '/umweg',
    '/einkauf',
    '/ratgeber',
    ...articles.map((a) => `/ratgeber/${a.slug}`),
  ],
} satisfies Config;
