import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages served das Projekt unter https://<user>.github.io/grenzfuchs/
  base: '/grenzfuchs/',
  plugins: [reactRouter()],
});
