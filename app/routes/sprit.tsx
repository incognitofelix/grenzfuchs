import { useState } from 'react';
import { ScreenHeader } from '../components/ScreenHeader';
import { SliderRow } from '../components/SliderRow';
import { fmt, fmtPriceTruncated } from '../lib/format';
import { bestPrice, FUEL_NAMES, LAND_NAMES, LAND_ORDER, stationsInRadius } from '../lib/prices';
import { useAppState } from '../state/AppState';
import type { Fuel, Land } from '../data/types';

export function meta() {
  return [
    { title: 'Spritpreise DE/FR/LU — Grenzfuchs' },
    {
      name: 'description',
      content: 'Aktuelle Spritpreise auf der Achse Saarbrücken – Forbach – Luxemburg im Vergleich.',
    },
  ];
}

const AXIS_STOPS: { land: Land; ort: string }[] = [
  { land: 'DE', ort: 'Saarbrücken' },
  { land: 'FR', ort: 'Forbach' },
  { land: 'LU', ort: 'Frisange' },
];

export default function Sprit() {
  const { snapshot, fuel, setFuel, radius, setRadius, alarmSent, setAlarmSent } = useAppState();
  const [email, setEmail] = useState('');

  const inRadius = snapshot ? stationsInRadius(snapshot, radius) : [];
  const best = bestPrice(inRadius, fuel);

  const sorted = inRadius
    .filter((s) => s.prices[fuel] !== undefined)
    .sort(
      (a, b) => LAND_ORDER[a.land] - LAND_ORDER[b.land] || a.prices[fuel]! - b.prices[fuel]!,
    );

  return (
    <div className="screen">
      <ScreenHeader
        title="⛽ Spritpreise"
        sub="Achse Saarbrücken → Forbach → Luxemburg"
      />

      <div className="pills" role="group" aria-label="Kraftstoff wählen">
        {(Object.keys(FUEL_NAMES) as Fuel[]).map((f) => (
          <button
            key={f}
            className={`pill${f === fuel ? ' active' : ''}`}
            onClick={() => setFuel(f)}
            aria-pressed={f === fuel}
          >
            {FUEL_NAMES[f]}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px var(--page-pad) 0' }}>
        {/* Abweichung vom Handoff (max 50 km): LU liegt real 52–70 km Luftlinie
            von Saarbrücken — mit 50 km wäre Luxemburg nie sichtbar. */}
        <SliderRow
          label="Umkreis (Luftlinie)"
          valueLabel={`${radius} km`}
          min={5}
          max={80}
          step={5}
          value={radius}
          onChange={setRadius}
        />
      </div>

      {/* Stilisierte Achsen-Karte */}
      <div className="card axis-card">
        <div className="axis-track">
          <div className="axis-line" />
          {AXIS_STOPS.map(({ land, ort }) => {
            const landStations = inRadius.filter((s) => s.land === land);
            let min: number | null = null;
            for (const s of landStations) {
              const p = s.prices[fuel];
              if (p !== undefined && (min === null || p < min)) min = p;
            }
            const isBest = min !== null && best !== null && Math.abs(min - best) < 0.0001;
            return (
              <div key={land} className={`axis-stop${isBest ? ' best' : ''}`}>
                <div className="axis-land">{land}</div>
                <div className="axis-price">
                  {min === null ? '—' : `${fmt(min)} ${isBest ? '▼' : '▲'}`}
                </div>
                <div className="axis-ort">{ort}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tankstellen-Liste, gruppiert nach Land */}
      <div className="station-list">
        {snapshot === null && <p className="footnote" style={{ margin: 0 }}>Preise werden geladen …</p>}
        {snapshot !== null && sorted.length === 0 && (
          <p className="footnote" style={{ margin: 0 }}>
            Keine Stationen im Umkreis — Umkreis vergrößern.
          </p>
        )}
        {sorted.map((s, i) => {
          const price = s.prices[fuel]!;
          const deltaCt = best === null ? 0 : Math.round((price - best) * 100);
          const cheapest = deltaCt === 0;
          const priceColor = cheapest ? 'var(--good)' : deltaCt >= 10 ? 'var(--bad)' : 'var(--ink)';
          return (
            <div key={s.id}>
              {(i === 0 || sorted[i - 1].land !== s.land) && (
                <div className="group-label">
                  {LAND_NAMES[s.land]}
                  {s.land === 'LU' && ' · amtlicher Höchstpreis'}
                </div>
              )}
              <div className={`station-card${cheapest ? ' cheapest' : ''}`}>
                <div className="station-badge">{s.land}</div>
                <div className="station-main">
                  <div className="station-name">{s.name}</div>
                  <div className="station-ort">
                    {s.ort} · {fmt(s.kmFromSb, s.kmFromSb % 1 === 0 ? 0 : 1)} km
                  </div>
                </div>
                <div className="station-price-box">
                  <div className="station-price" style={{ color: priceColor }}>
                    {fmtPriceTruncated(price)} €
                  </div>
                  <div className="station-delta">
                    {cheapest ? '▼ günstigster' : `+${deltaCt} ct`}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preis-Alarm — bewusst dezent am Listenende */}
      <div className="alarm-card">
        {!alarmSent ? (
          <div>
            <div className="alarm-title">🔔 Preis-Alarm (optional)</div>
            <p className="alarm-text">
              Wir schreiben dir, wenn {FUEL_NAMES[fuel]} in LU unter 1,50 € fällt. Nur E-Mail,
              kein Account.
            </p>
            <form
              className="alarm-form"
              onSubmit={(e) => {
                e.preventDefault();
                setAlarmSent(true);
              }}
            >
              <input
                type="email"
                required
                placeholder="deine@mail.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="alarm-input"
                aria-label="E-Mail-Adresse für Preis-Alarm"
              />
              <button type="submit" className="btn-primary">
                OK
              </button>
            </form>
          </div>
        ) : (
          <div className="alarm-confirm">
            Der Preis-Alarm ist noch im Aufbau — deine Adresse wurde deshalb noch nicht
            gespeichert. Schau bald wieder vorbei!
          </div>
        )}
      </div>

      <p className="footnote" style={{ textAlign: 'center' }}>
        Preisdaten: Tankerkönig (CC BY 4.0) · prix-carburants.gouv.fr (Licence Ouverte) · STATEC (CC0)
      </p>
    </div>
  );
}
