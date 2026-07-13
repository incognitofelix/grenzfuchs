import { useEffect } from 'react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import '@fontsource-variable/bricolage-grotesque';
import './styles/tokens.css';
import './styles/app.css';
import { TabBar } from './components/TabBar';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#fdfbf7" />
        <link rel="icon" href={`${import.meta.env.BASE_URL}icons/favicon.svg`} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={`${import.meta.env.BASE_URL}icons/icon-192.png`} />
        <link rel="manifest" href={`${import.meta.env.BASE_URL}manifest.webmanifest`} />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  // Service Worker manuell registrieren: der React-Router-Framework-Mode hat keine
  // index.html, in die vite-plugin-pwa sein Register-Script injizieren könnte.
  useEffect(() => {
    if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`);
    }
  }, []);

  return (
    <div className="app-frame">
      <Outlet />
      <TabBar />
    </div>
  );
}
