import { ScreenHeader } from '../components/ScreenHeader';
import { SliderRow } from '../components/SliderRow';
import { Ticket } from '../components/Ticket';
import { fmt } from '../lib/format';
import { FUEL_NAMES, minLandPrice } from '../lib/prices';
import { useAppState } from '../state/AppState';

export function meta() {
  return [
    { title: 'Lohnt sich der Umweg? — Grenzfuchs' },
    {
      name: 'description',
      content:
        'Rechner: Lohnt sich der Umweg zum Tanken nach Luxemburg? Netto-Ersparnis nach Fahrtkosten.',
    },
  ];
}

export default function Umweg() {
  const { snapshot, fuel, detourKm, setDetourKm, verbrauch, setVerbrauch, tank, setTank } =
    useAppState();

  const pLU = snapshot ? minLandPrice(snapshot.stations, 'LU', fuel) : null;
  const pDE = snapshot ? minLandPrice(snapshot.stations, 'DE', fuel) : null;
  const ready = pLU !== null && pDE !== null;

  // Rechenlogik 1:1 aus dem Prototyp
  const gross = ready ? tank * (pDE - pLU) : 0;
  const cost = ready ? 2 * detourKm * (verbrauch / 100) * pLU : 0;
  const net = gross - cost;
  let verdict: string, verdictBg: string;
  if (net > 1) {
    verdict = 'Ja, der Umweg lohnt sich! 🎉';
    verdictBg = 'var(--verdict-yes)';
  } else if (net > 0) {
    verdict = 'Knapp — kaum der Rede wert.';
    verdictBg = 'var(--verdict-close)';
  } else {
    verdict = 'Nein, bleib lieber hier.';
    verdictBg = 'var(--verdict-no)';
  }

  return (
    <div className="screen">
      <ScreenHeader
        title="🧭 Lohnt sich der Umweg?"
        sub="Tanken in Luxemburg statt zuhause — nach Abzug der Fahrtkosten."
      />

      <div
        className="card"
        style={{ margin: '16px var(--page-pad) 0', padding: '16px 18px', display: 'grid', gap: 16 }}
      >
        <SliderRow
          label="Umweg (einfache Strecke)"
          valueLabel={`${detourKm} km`}
          min={0}
          max={60}
          step={1}
          value={detourKm}
          onChange={setDetourKm}
        />
        <SliderRow
          label="Verbrauch"
          valueLabel={`${fmt(verbrauch, 1)} l/100 km`}
          min={4}
          max={12}
          step={0.1}
          value={verbrauch}
          onChange={setVerbrauch}
        />
        <SliderRow
          label="Tankvolumen"
          valueLabel={`${tank} l`}
          min={30}
          max={80}
          step={5}
          value={tank}
          onChange={setTank}
        />
      </div>

      <Ticket bg={ready ? verdictBg : 'var(--text-3)'} notchTop="55%">
        <div className="ticket-eyebrow" style={{ opacity: 0.8 }}>
          Deine Netto-Ersparnis
        </div>
        <div className="ticket-bigrow" style={{ gap: 10 }}>
          <div className="ticket-big ticket-big-xl">
            {ready ? <>{net >= 0 ? '−' : '+'}{fmt(Math.abs(net))}&nbsp;€</> : '…'}
          </div>
        </div>
        <div className="ticket-verdict">{ready ? verdict : 'Preise werden geladen'}</div>
        <div className="ticket-divider ticket-rows" style={{ borderTopColor: 'rgba(255,255,255,0.35)' }}>
          <div className="ticket-row">
            <span className="dim">Ersparnis an der Zapfsäule ({FUEL_NAMES[fuel]})</span>
            <span className="strong">+{fmt(gross)} €</span>
          </div>
          <div className="ticket-row">
            <span className="dim">Fahrtkosten Umweg (hin &amp; zurück)</span>
            <span className="strong">−{fmt(cost)} €</span>
          </div>
        </div>
      </Ticket>

      <p className="footnote">
        Rechnung: {tank} l × (DE {pDE !== null ? fmt(pDE) : '—'} € − LU{' '}
        {pLU !== null ? fmt(pLU) : '—'} €) minus {detourKm} km × 2 Fahrtkosten. Zeit &amp;
        Verschleiß nicht eingerechnet.
      </p>
    </div>
  );
}
