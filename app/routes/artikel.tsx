import { Link, useNavigate, useParams } from 'react-router';
import { articles } from '../content/articles';

export function meta({ params }: { params: { slug?: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) return [{ title: 'Artikel nicht gefunden — Grenzfuchs' }];
  return [
    { title: `${article.title} — Grenzfuchs` },
    { name: 'description', content: article.teaser },
  ];
}

export default function Artikel() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="screen screen-head">
        <h1 className="screen-title">Artikel nicht gefunden</h1>
        <Link to="/ratgeber" className="back-link">
          ‹ Ratgeber
        </Link>
      </div>
    );
  }

  return (
    <article className="screen">
      <div className="screen-head">
        <Link to="/ratgeber" className="back-link">
          ‹ Ratgeber
        </Link>
        <div className="kicker" style={{ marginTop: 8 }}>
          {article.kicker} · {article.min} Lesezeit
        </div>
        <h1 className="article-title">{article.title}</h1>
        <p className="article-meta">Aktualisiert: Juli 2026 · Grenzfuchs-Redaktion</p>
      </div>

      <div className="article-body">
        {article.blocks.map((b, i) =>
          b.type === 'h2' ? (
            <h2 key={i}>{b.text}</h2>
          ) : b.type === 'li' ? (
            <div key={i} className="article-li">
              <span aria-hidden="true">✅</span>
              <span>{b.text}</span>
            </div>
          ) : (
            <p key={i}>{b.text}</p>
          ),
        )}

        <div className="tipp-box">
          <div className="tipp-title">🦊 Fuchs-Tipp</div>
          <p className="tipp-text">
            Rechne deinen konkreten Einkauf durch — in 30 Sekunden, ohne Anmeldung.
          </p>
          <button className="btn-primary" onClick={() => navigate('/einkauf')}>
            Zum Grenzshopping-Rechner →
          </button>
        </div>
      </div>
    </article>
  );
}
