import { ScreenHeader } from '../components/ScreenHeader';
import { Ticket } from '../components/Ticket';
import { PRODUKTE } from '../config/produkte';
import { fmt } from '../lib/format';
import { FUEL_NAMES, minLandPrice } from '../lib/prices';
import { useAppState } from '../state/AppState';

export function meta() {
  return [
    { title: 'Einkauf drüben rechnen — Grenzfuchs' },
    {
      name: 'description',
      content:
        'Grenzshopping-Rechner: Was spart dein Einkauf in Luxemburg? Inklusive Zoll-Freimengen-Check.',
    },
  ];
}

export default function Einkauf() {
  const { snapshot, fuel, qty, setQty } = useAppState();

  const pLU = snapshot ? minLandPrice(snapshot.stations, 'LU', fuel) : null;
  const pDE = snapshot ? minLandPrice(snapshot.stations, 'DE', fuel) : null;

  const rows = PRODUKTE.map((def) => {
    const de = def.key === 'sprit' ? pDE : def.de;
    const lu = def.key === 'sprit' ? pLU : def.lu;
    const name = def.key === 'sprit' ? `${FUEL_NAMES[fuel]} tanken` : def.name;
    const q = qty[def.key];
    const save = de !== null && lu !== null ? q * (de - lu) : 0;
    return { ...def, de, lu, name, q, save, over: q > def.limit };
  });

  const totalSave = rows.reduce((a, r) => a + r.save, 0);
  const overCount = rows.filter((r) => r.over).length;

  return (
    <div className="screen">
      <ScreenHeader
        title="🛒 Einkauf drüben rechnen"
        sub="Was spart dein Einkauf in Luxemburg? Inklusive Zoll-Check."
      />

      <div style={{ padding: '16px var(--page-pad) 0', display: 'grid', gap: 10 }}>
        {rows.map((r) => (
          <div key={r.key} className={`card product-card${r.over ? ' over' : ''}`}>
            <div className="product-head">
              <div className="product-icon" aria-hidden="true">
                {r.icon}
              </div>
              <div className="product-main">
                <div className="product-name">{r.name}</div>
                <div className="product-unit">
                  {r.unit} · DE {r.de !== null ? fmt(r.de) : '—'} € / LU{' '}
                  {r.lu !== null ? fmt(r.lu) : '—'} €
                </div>
              </div>
              <div className="stepper">
                <button
                  className="stepper-btn"
                  onClick={() => setQty(r.key, r.q - r.step)}
                  aria-label={`${r.name} verringern`}
                >
                  −
                </button>
                <div className="stepper-qty">{r.q}</div>
                <button
                  className="stepper-btn plus"
                  onClick={() => setQty(r.key, r.q + r.step)}
                  aria-label={`${r.name} erhöhen`}
                >
                  +
                </button>
              </div>
            </div>
            {r.save > 0 && (
              <div className="product-save">
                <span className="label">Ersparnis</span>
                <span className="value">−{fmt(r.save)} €</span>
              </div>
            )}
            {r.over && (
              <div className="warn-box">⚠️ Zoll-Freimenge überschritten: max. {r.limitText}</div>
            )}
          </div>
        ))}
      </div>

      <Ticket bg="var(--accent)" notchTop="52%">
        <div className="ticket-eyebrow" style={{ opacity: 0.8 }}>
          Dein Einkauf spart
        </div>
        <div className="ticket-big ticket-big-xl" style={{ marginTop: 6 }}>
          −{fmt(totalSave)}&nbsp;€
        </div>
        <div
          className="ticket-divider"
          style={{
            borderTopColor: 'rgba(255,255,255,0.35)',
            paddingTop: 10,
            font: '500 13px var(--font-body)',
            opacity: 0.9,
          }}
        >
          {overCount > 0
            ? `⚠️ ${overCount} Freimenge(n) überschritten — Menge reduzieren oder Abgaben einplanen.`
            : '✓ Alles innerhalb der Zoll-Freimengen. Gute Fahrt!'}
        </div>
      </Ticket>

      <p className="footnote">
        Richtmengen gelten pro Person für den Eigenbedarf, beim Kraftstoff pro Fahrzeug
        (EU-Richtwerte, Quelle: zoll.de). Tabak, Kaffee und Spirituosen: Beispielpreise.
      </p>
    </div>
  );
}
