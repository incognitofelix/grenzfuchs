/** Ratgeber-Inhalte — Quelle: Design-Handoff (Copy ist final gemeint). */

export type ArticleBlock =
  | { type: 'h2'; text: string }
  | { type: 'p'; text: string }
  | { type: 'li'; text: string };

export interface Article {
  slug: string;
  kicker: string;
  min: string;
  title: string;
  teaser: string;
  blocks: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: 'zoll-freimengen',
    kicker: 'Zoll',
    min: '4 Min.',
    title: 'Zoll-Freimengen einfach erklärt',
    teaser:
      'Wie viel Kaffee, Tabak und Alkohol darfst du aus Luxemburg mitbringen — ohne Ärger an der Grenze?',
    blocks: [
      { type: 'p', text: 'Innerhalb der EU gibt es keine Zollgrenzen mehr — aber sehr wohl Richtmengen. Bleibst du darunter, gilt dein Einkauf automatisch als Eigenbedarf und niemand stellt Fragen.' },
      { type: 'h2', text: 'Die wichtigsten Richtmengen pro Person' },
      { type: 'li', text: 'Zigaretten: 800 Stück (4 Stangen)' },
      { type: 'li', text: 'Spirituosen: 10 Liter' },
      { type: 'li', text: 'Kaffee: 10 kg (wegen der deutschen Kaffeesteuer)' },
      { type: 'li', text: 'Kraftstoff: der Tankinhalt plus 20 Liter im Reservekanister' },
      { type: 'h2', text: 'Was passiert, wenn ich drüber liege?' },
      { type: 'p', text: 'Dann musst du glaubhaft machen, dass alles für dich privat ist — sonst werden deutsche Verbrauchsteuern fällig, bei Tabak schnell dreistellig. Unser Grenzshopping-Rechner warnt dich automatisch, bevor es kritisch wird.' },
      { type: 'p', text: 'Wichtig: Die Mengen gelten pro Person, nicht pro Auto. Zu zweit darfst du also doppelt so viel mitbringen.' },
    ],
  },
  {
    slug: 'wo-lohnt-sich-tanken',
    kicker: 'Tanken',
    min: '3 Min.',
    title: 'Wo lohnt sich Tanken wirklich?',
    teaser: 'Luxemburg ist fast immer am günstigsten — aber nicht für jeden. Die Faustregeln.',
    blocks: [
      { type: 'p', text: 'Luxemburg deckelt die Spritpreise staatlich, deshalb liegt Diesel dort meist 10–15 Cent unter dem deutschen Preis. Frankreich liegt dazwischen, schwankt aber stark je nach Supermarkt-Tankstelle.' },
      { type: 'h2', text: 'Die Faustregel' },
      { type: 'p', text: 'Pro 10 Cent Preisunterschied und 50-Liter-Tank sparst du 5 Euro. Jeder Kilometer Umweg kostet dich (hin und zurück) etwa 20 Cent. Mehr als 15–20 km Umweg lohnen sich also selten — außer du fährst sowieso vorbei.' },
      { type: 'li', text: 'Pendler mit Arbeitsweg über die Grenze: immer drüben tanken.' },
      { type: 'li', text: 'Extra-Fahrt nur für den Tank: erst mit dem Umweg-Rechner prüfen.' },
      { type: 'p', text: 'Preise ändern sich in Luxemburg meist um Mitternacht, in Frankreich morgens. Ein Blick vor der Abfahrt lohnt sich.' },
    ],
  },
  {
    slug: 'pendler-basics',
    kicker: 'Basics',
    min: '3 Min.',
    title: 'Pendler-Basics: Einkaufen in drei Ländern',
    teaser: 'Kaffee in Luxemburg, Käse in Frankreich, Drogerie in Deutschland — wer wo wirklich spart.',
    blocks: [
      { type: 'p', text: 'Jedes Land der Großregion hat seine Preis-Spezialität. Wer die Wege sowieso fährt, kombiniert clever — ganz ohne Extra-Kilometer.' },
      { type: 'li', text: 'Luxemburg: Kraftstoff, Tabak, Kaffee, Spirituosen (niedrige Verbrauchsteuern)' },
      { type: 'li', text: 'Frankreich: Käse, Wein, Frischwaren im Supermarkt' },
      { type: 'li', text: 'Deutschland: Drogerie, Haushalt, viele Markenprodukte' },
      { type: 'p', text: 'Der größte Hebel bleibt der Tank: Wer zweimal pro Woche in Luxemburg statt in Deutschland tankt, spart übers Jahr mehrere hundert Euro.' },
    ],
  },
];
