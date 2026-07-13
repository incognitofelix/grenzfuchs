# 🦊 Grenzfuchs

**Grenzgänger-Spar-App für die SaarLorLux-Region** — Spritpreis-Vergleich DE/FR/LU, „Lohnt sich der Umweg?"-Rechner und Grenzshopping-Rechner mit Zoll-Freimengen-Check für die Achse Saarbrücken – Forbach – Luxemburg-Süd.

Komplett kostenlos, ohne Registrierung, ohne Login. Installierbare PWA (React + Vite), gehostet auf GitHub Pages.

## Features

- ⛽ **Spritpreise vergleichen** — aktuelle Preise für Diesel, Super E5 und E10 entlang der Pendlerachse, gruppiert nach Land
- 🧭 **Lohnt sich der Umweg?** — Netto-Ersparnis nach Abzug der Fahrtkosten, live berechnet
- 🛒 **Einkauf drüben rechnen** — Ersparnis für Kraftstoff, Tabak, Kaffee & Spirituosen inkl. Warnung bei Überschreiten der Zoll-Richtmengen
- 📖 **Ratgeber & Zoll-Wissen** — kurze Artikel ohne Amtsdeutsch, statisch gerendert
- 🔔 **Preis-Alarm** — optional per E-Mail, kein Account nötig

## Architektur

Reine statische PWA. Ein zeitgesteuerter GitHub-Actions-Job ruft die Preisquellen ab, normalisiert sie in ein gemeinsames Format und veröffentlicht `prices.json` mit dem Pages-Deployment. Die App lädt nur dieses JSON und cached es offline („Stand: HH:MM").

## Datenquellen & Lizenzen

| Land | Quelle | Lizenz |
|------|--------|--------|
| 🇩🇪 DE | [Tankerkönig-API](https://creativecommons.tankerkoenig.de/) (MTS-K-Daten) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.de) |
| 🇫🇷 FR | [prix-carburants.gouv.fr](https://www.prix-carburants.gouv.fr/rubrique/opendata/) (Flux instantané) | [Licence Ouverte 2.0](https://www.etalab.gouv.fr/licence-ouverte-open-licence/) |
| 🇱🇺 LU | Amtliche Höchstpreise, [STATEC / LUSTAT](https://lustat.statec.lu/) via [data.public.lu](https://data.public.lu/) | CC0 |

Spritpreisdaten für Deutschland: © [Tankerkönig](https://www.tankerkoenig.de/), Lizenz CC BY 4.0.

Die Zoll-Richtmengen im Grenzshopping-Rechner sind Richtwerte für den privaten Eigenbedarf innerhalb der EU (Quellen: [zoll.de](https://www.zoll.de/), [douane.public.lu](https://douane.public.lu/)) und ersetzen keine Rechtsberatung.

## Entwicklung

```sh
npm install
npm run dev
```

Weitere Abschnitte (Build, Fetch-Job, Deployment) folgen mit dem Ausbau des Projekts.

## Design

Das UI basiert auf einem High-Fidelity-Design-Handoff (`design_handoff/`): warmes Off-White, Violett-Akzent in OKLCH, Bricolage Grotesque, Ergebnis-Karten als Abreiß-Tickets. Günstiger/teurer ist immer doppelt codiert (Farbe **und** Symbol ▼/▲) — Barrierefreiheit ist Teil des Designs.
