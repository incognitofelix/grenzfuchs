/**
 * Signatur-Element "Ticket": farbige Ergebnis-Karte mit Abreiß-Kerben
 * links/rechts (18px-Kreise in App-Hintergrundfarbe, per ::before/::after).
 * Kerbenhöhe variiert je Screen → CSS-Variable --notch-top.
 */
export function Ticket({
  bg,
  notchTop = '55%',
  as: Tag = 'div',
  className = '',
  style,
  children,
  ...rest
}: {
  bg: string;
  notchTop?: string;
  as?: 'div' | 'button';
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={`ticket ${className}`}
      style={{ background: bg, ['--notch-top' as string]: notchTop, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
