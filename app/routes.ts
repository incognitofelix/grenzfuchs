import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('sprit', 'routes/sprit.tsx'),
  route('umweg', 'routes/umweg.tsx'),
  route('einkauf', 'routes/einkauf.tsx'),
  route('ratgeber', 'routes/ratgeber.tsx'),
  route('ratgeber/:slug', 'routes/artikel.tsx'),
] satisfies RouteConfig;
