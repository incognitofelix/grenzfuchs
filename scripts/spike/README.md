# Daten-Spike: Erkenntnisse zu den drei Preisquellen

Stand: 2026-07-13. Ziel: beweisen, dass DE/FR/LU live abrufbar und auf ein gemeinsames Format normalisierbar sind, **bevor** App-Code entsteht.

## 🇫🇷 Frankreich — prix-carburants.gouv.fr

- Endpoint: `https://donnees.roulez-eco.fr/opendata/instantane` (kein Key, Licence Ouverte 2.0)
- Liefert ZIP (~0,9 MB) mit einer XML-Datei, Aktualisierung ~alle 10 min
- **XML ist ISO-8859-1-codiert** (nicht UTF-8!) — beim Dekodieren beachten
- Koordinaten in `PTV_GEODECIMAL`: Grad × 100 000 → durch 100 000 teilen
- Preise in €/l als Dezimalzahl (`valeur="1.759"`)
- Produktnamen: `Gazole`→diesel, `SP95`→e5, `E10`→e10 (SP98/E85/GPLc ignorieren wir)
- **Keine Markennamen im Flux** — nur `adresse`/`ville`. Namen kämen aus dem separaten Dataset „Points de vente" (transport.data.gouv.fr); fürs Erste zeigen wir die Adresse.
- Kein CORS, ZIP-Format → nur serverseitig/im CI-Job abrufbar

## 🇱🇺 Luxemburg — STATEC/LUSTAT (amtliche Höchstpreise)

- SDMX-REST: `https://lustat.statec.lu/rest/data/LU1,DSD_PRIX_ESSENCE@DF_E5301,1.0/all?lastNObservations=1` (Essence) bzw. `…DF_E5302…` (Gasoil routier), Header `Accept: application/vnd.sdmx.data+csv`, Lizenz CC0
- Relevante Spalten: `MOTOR_ENERGY` (DIE/SP95/SP98), `TIME_PERIOD` (Gültig-ab-Datum), `OBS_VALUE` (€/l)
- Verifiziert 2026-07-13: DIE 1,642 (ab 09.07.) · SP95 1,698 · SP98 1,865 (ab 10.07.)
- ⚠ **Stolperfalle:** Nodes `fetch` sendet automatisch `Accept-Language: *` — das .NET-Backend
  von LUSTAT antwortet darauf mit HTTP 500 (Body `languageTag1`, ein CultureInfo-Parse-Fehler).
  Fix: `Accept-Language: en` explizit setzen. curl war unauffällig, weil es den Header gar nicht sendet.
- Höchstpreis gilt landesweit → Stationen sind nur geografische Anker (Frisange/Dudelange/Schengen)
- ⚠ **Offen (Phase 2 verifizieren):** LUSTAT nennt nur Oktanzahlen. An LU-Säulen ist „95" E10 und „98" E5 → vorläufiges Mapping SP95→e10, SP98→e5. Gegen offizielle Quelle prüfen und in der App transparent machen (DE-E5 vs. LU-98-Oktan ist kein 1:1-Vergleich).

## 🇩🇪 Deutschland — Tankerkönig (MTS-K)

- `https://creativecommons.tankerkoenig.de/json/list.php?lat=…&lng=…&rad=…&sort=dist&type=all&apikey=…`
- Key: kostenlose Registrierung via https://onboarding.tankerkoenig.de (Stand 13.07.2026 wegen
  Wartungsarbeiten geschlossen — später erneut versuchen); liegt lokal in `.env`, im CI als
  Actions-Secret. **Nie in Client-Code oder Git.**
- Offizieller Demo-Key `00000000-0000-0000-0000-000000000002`: echte Stationsliste/Struktur,
  aber **Dummy-Preise (1.009 überall)** — reicht, um die Pipeline zu beweisen, nicht für Produktion.
- Lizenz CC BY 4.0 → Attribution in README und App-Footer Pflicht
- Rate-Limit („best effort", 503 bei Überschreitung) → Abruf nur im Cron-Job (~stündlich), nicht pro App-Besucher
- Antwort: `{ ok, stations: [{ name, brand, place, lat, lng, dist, diesel, e5, e10, isOpen }] }`, Preise in €/l

## Konsequenz für die Architektur

Keine der Quellen ist direkt aus dem Browser konsumierbar (Key-Schutz, CORS, ZIP-Größe).
→ GitHub-Actions-Cron normalisiert alle Quellen zu einem statischen `prices.json` im Pages-Deployment; die PWA lädt nur dieses JSON (same-origin) und cached es offline mit „Stand: HH:MM".
