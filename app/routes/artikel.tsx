import { Link, useParams } from 'react-router';
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
  const article = articles.find((a) => a.slug === slug);
  if (!article) {
    return (
      <div className="screen" style={{ padding: '14px 22px' }}>
        <h1>Artikel nicht gefunden</h1>
        <Link to="/ratgeber">‹ Ratgeber</Link>
      </div>
    );
  }
  return (
    <article className="screen" style={{ padding: '14px 22px' }}>
      <Link to="/ratgeber">‹ Ratgeber</Link>
      <h1>{article.title}</h1>
      {article.blocks.map((b, i) =>
        b.type === 'h2' ? <h2 key={i}>{b.text}</h2> : <p key={i}>{b.text}</p>,
      )}
    </article>
  );
}
