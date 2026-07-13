import { createContext, useContext, useEffect, useState } from 'react';
import type { Fuel, PriceSnapshot } from '../data/types';
import type { ProduktKey } from '../config/produkte';

/**
 * Globaler App-State (entspricht dem State des Prototyps):
 * Kraftstoffwahl gilt überall — Home-Ticket, Sprit-Liste und Umweg-Rechner
 * rechnen mit denselben Preisen. Der Preis-Snapshot wird einmal geladen
 * (offline beantwortet ihn der Service Worker aus dem Cache).
 */
interface AppState {
  snapshot: PriceSnapshot | null;
  fuel: Fuel;
  setFuel: (f: Fuel) => void;
  radius: number;
  setRadius: (km: number) => void;
  detourKm: number;
  setDetourKm: (km: number) => void;
  verbrauch: number;
  setVerbrauch: (l: number) => void;
  tank: number;
  setTank: (l: number) => void;
  qty: Record<ProduktKey, number>;
  setQty: (key: ProduktKey, q: number) => void;
  alarmSent: boolean;
  setAlarmSent: (sent: boolean) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<PriceSnapshot | null>(null);
  const [fuel, setFuel] = useState<Fuel>('diesel');
  const [radius, setRadius] = useState(80);
  const [detourKm, setDetourKm] = useState(12);
  const [verbrauch, setVerbrauch] = useState(6.5);
  const [tank, setTank] = useState(50);
  const [qty, setQtyState] = useState<Record<ProduktKey, number>>({
    sprit: 50,
    tabak: 2,
    kaffee: 2,
    alkohol: 2,
  });
  const [alarmSent, setAlarmSent] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`${import.meta.env.BASE_URL}data/prices.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: PriceSnapshot | null) => {
        if (!cancelled && data?.schemaVersion === 1) setSnapshot(data);
      })
      .catch(() => {
        /* offline ohne Cache: Screens zeigen Platzhalter */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setQty = (key: ProduktKey, q: number) =>
    setQtyState((s) => ({ ...s, [key]: Math.max(0, Math.min(199, q)) }));

  return (
    <Ctx.Provider
      value={{
        snapshot,
        fuel,
        setFuel,
        radius,
        setRadius,
        detourKm,
        setDetourKm,
        verbrauch,
        setVerbrauch,
        tank,
        setTank,
        qty,
        setQty,
        alarmSent,
        setAlarmSent,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState außerhalb von <AppStateProvider>');
  return ctx;
}
