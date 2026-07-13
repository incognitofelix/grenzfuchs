import { Link } from 'react-router';
import { articles } from '../content/articles';

export function meta() {
  return [
    { title: 'Ratgeber & Zoll-Wissen — Grenzfuchs' },
    {
      name: 'description',
      content: 'Zoll-Freimengen, Tank-Faustregeln und Pendler-Basics für die Grenzregion — kurz und ohne Amtsdeutsch.',
    },
  ];
}

export default function Ratgeber() {
  return (
    <div className="screen" style={{ padding: '14px 22px' }}>
      <h1>📖 Ratgeber &amp; Zoll-Wissen</h1>
      <p>Kurz, verständlich, ohne Amtsdeutsch.</p>
      <ul>
        {articles.map((a) => (
          <li key={a.slug}>
            <Link to={`/ratgeber/${a.slug}`}>{a.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
