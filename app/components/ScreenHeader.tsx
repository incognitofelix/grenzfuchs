import { Link } from 'react-router';

export function ScreenHeader({
  back = { to: '/', label: '‹ Start' },
  title,
  sub,
}: {
  back?: { to: string; label: string };
  title: string;
  sub: string;
}) {
  return (
    <div className="screen-head">
      <Link to={back.to} className="back-link">
        {back.label}
      </Link>
      <h1 className="screen-title">{title}</h1>
      <p className="screen-sub">{sub}</p>
    </div>
  );
}
