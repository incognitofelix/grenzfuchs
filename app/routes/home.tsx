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

export default function Home() {
  return (
    <div className="screen" style={{ padding: '14px 22px' }}>
      <h1>
        Schlau tanken. <span style={{ color: 'var(--accent)' }}>Drüben</span> sparen.
      </h1>
      <p>Screen folgt in Phase 4.</p>
    </div>
  );
}
