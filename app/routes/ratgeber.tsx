import { Link } from 'react-router';
import { ScreenHeader } from '../components/ScreenHeader';
import { articles } from '../content/articles';

export function meta() {
  return [
    { title: 'Ratgeber & Zoll-Wissen — Grenzfuchs' },
    {
      name: 'description',
      content:
        'Zoll-Freimengen, Tank-Faustregeln und Pendler-Basics für die Grenzregion — kurz und ohne Amtsdeutsch.',
    },
  ];
}

export default function Ratgeber() {
  return (
    <div className="screen">
      <ScreenHeader
        title="📖 Ratgeber & Zoll-Wissen"
        sub="Kurz, verständlich, ohne Amtsdeutsch."
      />
      <div style={{ padding: '16px var(--page-pad) 10px', display: 'grid', gap: 10 }}>
        {articles.map((a) => (
          <Link key={a.slug} to={`/ratgeber/${a.slug}`} className="article-card">
            <div className="kicker">
              {a.kicker} · {a.min} Lesezeit
            </div>
            <div className="article-card-title">{a.title}</div>
            <div className="article-card-teaser">{a.teaser}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
