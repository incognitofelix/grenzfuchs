import { Link, useNavigate } from 'react-router';
import { Ticket } from '../components/Ticket';
import { fmt, fmtStand } from '../lib/format';
import { FUEL_NAMES, minLandPrice } from '../lib/prices';
import { useAppState } from '../state/AppState';

export function meta() {
  return [
    { title: 'Grenzfuchs — Schlau tanken, drüben sparen' },
    {
      name: 'description',
      content:
        'Spritpreis-Vergleich DE/FR/LU, Umweg-Rechner und Grenzshopping-Rechner für Pendler in der SaarLorLux-Region. Kostenlos, ohne Anmeldung.',
    },
  ];
}

const TILES = [
  { to: '/sprit', icon: '⛽', label: ['Spritpreise', 'vergleichen'] },
  { to: '/umweg', icon: '🧭', label: ['Lohnt sich', 'der Umweg?'] },
  { to: '/einkauf', icon: '🛒', label: ['Einkauf', 'drüben rechnen'] },
  { to: '/ratgeber', icon: '📖', label: ['Ratgeber', '& Zoll-Wissen'], accent: true },
];

export default function Home() {
  const { snapshot, fuel } = useAppState();
  const navigate = useNavigate();

  const pLU = snapshot ? minLandPrice(snapshot.stations, 'LU', fuel) : null;
  const pDE = snapshot ? minLandPrice(snapshot.stations, 'DE', fuel) : null;
  const ready = pLU !== null && pDE !== null;

  return (
    <div className="screen">
      <header className="home-head">
        <div className="home-brand">
          <div className="logo-circle" aria-hidden="true">
            🦊
          </div>
          <div className="brand-name">Grenzfuchs</div>
        </div>
        <button
          className="bell-btn"
          onClick={() => navigate('/sprit')}
          aria-label="Zum Preis-Alarm"
        >
          🔔
        </button>
      </header>

      <div className="home-intro">
        <h1 className="home-h1">
          Schlau tanken.
          <br />
          <span className="accent">Drüben</span> sparen.
        </h1>
        <p className="home-sub">Der Fuchs weiß, wo's günstiger ist — heute in Luxemburg.</p>
      </div>

      <Ticket
        as="button"
        bg="var(--accent)"
        notchTop="58%"
        className="home-ticket"
        onClick={() => navigate('/umweg')}
      >
        <div className="ticket-eyebrow">Deine Tankfüllung heute (50 l)</div>
        <div className="ticket-bigrow">
          <div className="ticket-big">
            {/* Ersparnis-Konvention wie im Prototyp: Sparen = "−"; falls DE mal
                günstiger ist (z. B. Demo-Daten), ehrlich "+" statt Doppel-Minus */}
            {ready ? (
              <>
                {50 * (pDE - pLU) >= 0 ? '−' : '+'}
                {fmt(Math.abs(50 * (pDE - pLU)))}&nbsp;€
              </>
            ) : (
              '…'
            )}
          </div>
          <div className="ticket-bigside">{ready ? 'in LU statt DE' : 'Preise werden geladen'}</div>
        </div>
        <div className="ticket-divider ticket-row" style={{ fontSize: 13, fontWeight: 500 }}>
          <span className="dim">
            {FUEL_NAMES[fuel]}
            {pLU !== null && <> · LU {fmt(pLU)} €</>}
            {pDE !== null ? <> · DE {fmt(pDE)} €</> : snapshot ? <> · DE-Preise folgen</> : null}
          </span>
          <span className="strong">Details →</span>
        </div>
      </Ticket>

      <nav className="tiles-grid" aria-label="Werkzeuge">
        {TILES.map((t) => (
          <Link key={t.to} to={t.to} className={`tile${t.accent ? ' tile-accent' : ''}`}>
            <div className="tile-icon" aria-hidden="true">
              {t.icon}
            </div>
            <div className="tile-label">
              {t.label[0]}
              <br />
              {t.label[1]}
            </div>
          </Link>
        ))}
      </nav>

      <p className="micro-center">
        Kostenlos · ohne Anmeldung{snapshot && <> · Preise von {fmtStand(snapshot.fetchedAt)}</>}
        <br />
        <span style={{ fontSize: 11 }}>
          Preisdaten: Tankerkönig (CC BY 4.0) · prix-carburants.gouv.fr · STATEC
        </span>
      </p>
    </div>
  );
}
