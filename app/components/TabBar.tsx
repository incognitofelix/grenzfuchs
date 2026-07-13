import { NavLink } from 'react-router';

const TABS = [
  { to: '/', icon: '🏠', label: 'Start', end: true },
  { to: '/sprit', icon: '⛽', label: 'Sprit' },
  { to: '/umweg', icon: '🧭', label: 'Umweg' },
  { to: '/einkauf', icon: '🛒', label: 'Einkauf' },
  { to: '/ratgeber', icon: '📖', label: 'Wissen' },
] as const;

export function TabBar() {
  return (
    <nav className="tabbar" aria-label="Hauptnavigation">
      {TABS.map((t) => (
        <NavLink key={t.to} to={t.to} end={'end' in t ? t.end : false}>
          <span className="tab-icon" aria-hidden="true">
            {t.icon}
          </span>
          <span className="tab-label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
