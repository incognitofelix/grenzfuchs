# Handoff: Grenzfuchs — Grenzgänger-Spar-App (SaarLorLux)

## Overview
Mobile-first PWA für Berufspendler in der Grenzregion DE/FR/LU (Achse Saarbrücken–Forbach–Luxemburg-Süd). Kern: grenzüberschreitendes Sparen — Spritpreis-Vergleich, "Lohnt sich der Umweg?"-Rechner, Grenzshopping-Rechner mit Zoll-Freimengen-Check, Ratgeber-Artikel (SEO), leichtgewichtiger E-Mail-Preis-Alarm. Komplett kostenlos, keine Registrierung, kein Login. Ergebnis ("Du sparst X €") ist der Höhepunkt jedes Flows.

## About the Design Files
Die Dateien in diesem Bundle sind **Design-Referenzen in HTML** (Prototyp `Grenzfuchs App.dc.html`): Sie zeigen die beabsichtigte Optik und das Verhalten, sind aber **kein Produktionscode**. Aufgabe: die Designs im Ziel-Codebase-Environment (React, Vue, Svelte, …) mit dessen etablierten Patterns nachbauen. Existiert noch kein Environment, wähle ein passendes Framework für eine installierbare PWA (z. B. React + Vite + vite-plugin-pwa oder Next.js) und implementiere dort.

## Fidelity
**High-fidelity.** Farben, Typografie, Abstände, Radii und Copy sind final gemeint und sollen pixelgenau übernommen werden. Die Beispieldaten (Preise, Tankstellen) sind Platzhalter und kommen später aus echten Datenquellen.

## Design Tokens

### Farben
- Akzent (Primär): `oklch(0.55 0.2 300)` — kräftiges Violett (Buttons, Ticket-Karten, aktive Filter)
- Akzent dunkel (Text/Links): `oklch(0.42 0.18 300)`
- Akzent hell (Flächen): `oklch(0.95 0.03 300)`, Border dazu `oklch(0.88 0.06 300)`
- Ink (Text): `#241f2e`; Sekundärtext: `#6f6a7c`; Tertiär/Muted: `#a09aac`; Fließtext Artikel: `#3d3849`
- Hintergrund App: `#fdfbf7` (warmes Off-White); Karten: `#fff`; Karten-Border: `#ece7db` (1.5px); neutrale Chips: `#f1ede4`
- **Günstiger (Ersparnis)**: Grün `oklch(0.45 0.12 155)`, Fläche `oklch(0.95 0.03 155)`, Border `oklch(0.85 0.06 155)` — Verdict-Ticket "Ja": `oklch(0.5 0.13 155)`
- **Teurer**: Orange `oklch(0.55 0.13 40)` — Verdict-Ticket "Nein": `oklch(0.55 0.13 40)`; "Knapp": `oklch(0.6 0.11 80)`
- Warnung (Zoll): Fläche `oklch(0.96 0.04 80)`, Border `oklch(0.85 0.09 80)`, Text `oklch(0.45 0.1 60)`
- WICHTIG (Barrierefreiheit): günstiger/teurer ist IMMER doppelt codiert — Farbe + Symbol ▼/▲ bzw. Text ("günstigster", "+7 ct"). Nie Farbe allein.

### Typografie
- Display/UI: **Bricolage Grotesque** (Google Fonts), Gewichte 400–800
- Fließtext/Labels: Systemstack `system-ui, sans-serif`
- Skala: H1 25–29px/800/-0.5…-0.7px · Ticket-Zahl 44–46px/800/-1.5px · Kartentitel 14–16.5px/700 · Body 13.5–15px/400, line-height 1.5–1.65 · Kicker/Eyebrow 11–12px/600, uppercase, letter-spacing 1px · Micro 10.5–12px
- Zahlen im Ergebnis immer riesig (44px+), Vorzeichen "−" für Ersparnis

### Spacing & Form
- Seitenränder: 22px; App-Breite max 430px, zentriert
- Card-Radius: 16–18px; Ticket: 20px; Chips/Pills: 99px; Buttons: 12–14px; Icon-Kacheln: 10–12px
- Card-Border: 1.5px solid; keine Schatten auf Karten (nur App-Rahmen: `0 0 40px rgba(0,0,0,0.12)`)
- Touch-Targets ≥ 44px (Stepper-Buttons 34px Kreis + Padding drumherum, Kacheln min-height 96px)
- Gaps: Grids 8–10px, Tool-Kacheln 10px

### Signatur-Element: das "Ticket"
Ergebnis-Karten sind als Abreiß-Ticket gestaltet: farbige Fläche (Violett bzw. Verdict-Farbe), radius 20px, links+rechts je ein 18px-Kreis in Hintergrundfarbe (`#fdfbf7`) auf halber Höhe (Kerben), Trennung per `border-top: 2px dashed rgba(255,255,255,0.3)`. Struktur: Eyebrow (12px/600/uppercase) → Riesenzahl (44–46px/800) → Zusatz → dashed Divider → Detailzeilen.

## Screens / Views
App ist eine Single-Page mit 6 Screens, gewechselt per Bottom-Tab-Bar + interner Navigation. Alle Screens: Statusbar-Attrappe oben, `padding-bottom: 92px` für die fixe Tab-Bar.

### 1. Home / Start
- Header: 36px Kreis-Logo (🦊 auf Violett) + Wortmarke "Grenzfuchs" (20px/800), rechts 36px Kreis-Button 🔔 (`#f1ede4`)
- H1: "Schlau tanken. **Drüben** sparen." — "Drüben" in Akzentviolett. Sub: "Der Fuchs weiß, wo's günstiger ist — heute in Luxemburg."
- Ticket (klickbar → Umweg-Rechner): Eyebrow "Deine Tankfüllung heute (50 l)", Zahl "−7,00 €", "in LU statt DE", Divider, Zeile "Diesel · LU 1,52 € · DE 1,66 €" + "Details →"
- 2×2 Tool-Kacheln (weiß, 1.5px Border, radius 18px, min-height 96px): ⛽ Spritpreise vergleichen · 🧭 Lohnt sich der Umweg? · 🛒 Einkauf drüben rechnen · 📖 Ratgeber & Zoll-Wissen (violett-hell hinterlegt). Hover: Border → `oklch(0.75 0.1 300)`
- Footer-Zeile: "Kostenlos · ohne Anmeldung · Preise von heute 08:12" (12px, muted, zentriert)

### 2. Spritpreis-Vergleich
- Back-Link "‹ Start" (13.5px/600, Akzent) · H1 "⛽ Spritpreise" · Sub mit Achsen-Beschreibung
- Filter: 3 Pill-Buttons (Diesel/Super E5/Super E10); aktiv = violett gefüllt, weißer Text; inaktiv = weiß, `#6f6a7c`
- Umkreis: Range-Slider 5–50 km (step 5), `accent-color` Violett, Label rechts fett
- Stilisierte Achsen-Karte (weiße Karte): 3 Stationen DE→FR→LU horizontal, verbunden mit 2.5px dashed Linie `#ded9cd`; je Station: 28px Länder-Kreis (günstigstes Land grün hinterlegt), Preis (14px/700, grün▼ oder orange▲), Ortsname (10.5px muted)
- Tankstellen-Liste, gruppiert nach Land (Gruppen-Label 12px/700/uppercase, Reihenfolge LU→FR→DE): Karte mit Länder-Badge (34px, radius 10px), Name (14px/700), "Ort · X km", rechts Preis (17px/800) + Delta ("▼ günstigster" grün / "+X ct" muted). Günstigste Station: grüne Border + grünes Badge. Preise ≥+10 ct: orange.
- Umkreis-Filter blendet Stationen > X km aus
- Preis-Alarm-Karte (violett-hell): Titel "🔔 Preis-Alarm (optional)", Erklärung "Nur E-Mail, kein Account", E-Mail-Input + "OK"-Button; nach Absenden ersetzt durch Bestätigung "✓ Alles klar! …". Bewusst dezent am Listenende — kein Modal, kein Nag.

### 3. Umweg-Rechner
- Inputs-Karte (weiß) mit 3 Slidern: Umweg 0–60 km (step 1) · Verbrauch 4–12 l/100km (step 0.1) · Tankvolumen 30–80 l (step 5). Label links, Wert rechts fett, live.
- Ergebnis-Ticket, Hintergrundfarbe = Verdict: Grün (>1 € Netto) "Ja, der Umweg lohnt sich! 🎉" · Gelbgrün (0–1 €) "Knapp — kaum der Rede wert." · Orange (<0 €) "Nein, bleib lieber hier." Zahl 46px, dann Verdict-Satz (16px/800), dann Aufschlüsselung: "+Ersparnis an der Zapfsäule" / "−Fahrtkosten Umweg (hin & zurück)"
- Formel-Fußnote (12px muted): Tank × (DE−LU) minus km × 2 × Verbrauch/100 × LU-Preis; Zeit & Verschleiß nicht eingerechnet
- Berechnung: `gross = tank × (pDE − pLU)`; `cost = 2 × km × (verbrauch/100) × pLU`; `net = gross − cost`

### 4. Grenzshopping-Rechner
- 4 Produkt-Karten: ⛽ Diesel (Liter, step 10, Freimenge 70) · 🚬 Zigaretten (Stange, Limit 4) · ☕ Kaffee (kg, Limit 10) · 🥃 Spirituosen (0,7l-Flasche, Limit ≈14). Je Karte: Icon, Name, "Einheit · DE X € / LU Y €", Stepper (− Kreis outline / Menge 16px/800 / + Kreis violett gefüllt)
- Bei Menge > 0: dashed Divider + Zeile "Ersparnis −X €" (grün)
- Bei Überschreiten der Freimenge: gelbe Warn-Box "⚠️ Zoll-Freimenge überschritten: max. …" + Karten-Border wird gelb
- Summen-Ticket (violett): "Dein Einkauf spart" + Gesamtzahl + Statuszeile ("✓ Alles innerhalb der Zoll-Freimengen. Gute Fahrt!" oder "⚠️ N Freimenge(n) überschritten …")
- Fußnote: Freimengen gelten pro Person, EU-Richtwerte, Beispielpreise

### 5. Ratgeber (Liste) + Artikel
- Liste: klickbare Artikel-Karten mit Kicker ("Zoll · 4 Min. Lesezeit", 11px uppercase Akzent), Titel (16.5px/700), Teaser (13px muted)
- Artikel: Back "‹ Ratgeber", Kicker, H1 (26px/800), Meta-Zeile ("Aktualisiert: … · Grenzfuchs-Redaktion"), Fließtext 15px/1.65, H2 18px/800, Listenpunkte als weiße Karten mit ✅-Prefix
- Am Artikelende: "🦊 Fuchs-Tipp"-Box (violett-hell) mit CTA-Button zum passenden Rechner (Cross-Linking für SEO/Conversion)
- SEO-Hinweis für Implementierung: Artikel als statische Routen mit echten `<h1>/<h2>`, Meta-Description, semantischem HTML rendern (SSG/SSR), nicht nur client-side

### 6. Tab-Bar (persistent)
- Fixed bottom, max-width 430px, `rgba(253,251,247,0.94)` + `backdrop-filter: blur(10px)`, 1.5px Top-Border
- 5 Tabs: 🏠 Start · ⛽ Sprit · 🧭 Umweg · 🛒 Einkauf · 📖 Wissen. Aktiv: Emoji farbig + Label Akzent-dunkel; inaktiv: `grayscale(1) opacity(0.55)` + Label muted. Padding-bottom 18px (Home-Indicator-Bereich)

## Interactions & Behavior
- Screen-Wechsel: Fade+Slide-In `gfPop` (opacity 0→1, translateY 6px→0, 0.25s ease-out)
- Alle Rechner reagieren live auf jede Eingabe — kein "Berechnen"-Button
- Kraftstoff-Auswahl gilt global (Home-Ticket, Sprit-Liste, Umweg-Rechner nutzen dieselben Preise)
- Kein Login, keine Modals, keine Cookie-/Signup-Nags. Preis-Alarm ist Double-Opt-in per E-Mail (nur E-Mail-Feld, kein Passwort)
- Hover (Desktop): Karten-Border → helles Violett; Touch: Standard-Tap
- PWA: installierbar (Manifest + Service Worker), Preise offline cachen mit "Stand: HH:MM"-Anzeige

## State Management
- `screen` ('home'|'sprit'|'umweg'|'shop'|'ratgeber'|'article'), `article` (Index)
- `fuel` ('diesel'|'e5'|'e10'), `radius` (km)
- Umweg: `detourKm`, `verbrauch`, `tank`
- Shopping: `qty` je Produkt-Key
- Alarm: `alarmEmail`, `alarmSent`
- Datenbedarf (später echt): Spritpreise je Station (DE: Tankerkönig-API, FR: prix-carburants.gouv.fr, LU: amtlich fixierte Höchstpreise); im Prototyp hartkodierte Beispielwerte

## Assets
Keine Bild-Assets. Logo = 🦊-Emoji auf violettem Kreis (später durch echtes Logo ersetzen). Icons = Emoji (bewusste Design-Entscheidung: freundlich, kein Icon-Font nötig — bei Implementierung optional durch ein Icon-Set ersetzen, Ton beibehalten). Font: Bricolage Grotesque via Google Fonts.

## Files
- `Grenzfuchs App.dc.html` — der komplette interaktive Prototyp (alle 6 Screens, echte Rechenlogik im `<script>`-Teil; Template mit Inline-Styles = Quelle aller exakten Werte)
- `Grenzgänger App – Explorationen.dc.html` — die 3 ursprünglichen Home-Richtungen (Kontext; 1b wurde gewählt)
