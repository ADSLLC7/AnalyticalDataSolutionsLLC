/**
 * ADS logomark: three ascending bars (data, growth) with the tallest topped
 * by a terracotta dot (talent). Reads as both a bar chart and people standing:
 * IT consulting and staffing in one mark.
 */
export function LogoMark({
  size = 40,
  tile = 'oklch(0.17 0.012 28)',
  bars = 'oklch(0.975 0.003 28)',
  dot = 'oklch(0.58 0.17 28)',
}: {
  size?: number;
  tile?: string;
  bars?: string;
  dot?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="Analytical Data Solutions logo"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <rect width="48" height="48" rx="11" fill={tile} />
      {/* ascending bars, rounded caps */}
      <rect x="11" y="26" width="6" height="12" rx="3" fill={bars} />
      <rect x="21" y="19" width="6" height="19" rx="3" fill={bars} />
      <rect x="31" y="17" width="6" height="21" rx="3" fill={bars} />
      {/* talent dot crowning the tallest bar */}
      <circle cx="34" cy="11" r="4" fill={dot} />
    </svg>
  );
}

export default function Logo({
  size = 40,
  stacked = false,
  onDark = false,
}: {
  size?: number;
  stacked?: boolean;
  onDark?: boolean;
}) {
  const ink = onDark ? 'var(--mk-on-deep)' : 'var(--mk-ink)';
  const muted = onDark ? 'var(--mk-on-deep-muted)' : 'var(--mk-ink-muted)';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.7rem',
        lineHeight: 1,
      }}
    >
      <LogoMark
        size={size}
        tile={onDark ? 'oklch(0.975 0.003 28)' : 'oklch(0.17 0.012 28)'}
        bars={onDark ? 'oklch(0.17 0.012 28)' : 'oklch(0.975 0.003 28)'}
      />
      <span style={{ display: 'flex', flexDirection: 'column', gap: stacked ? 3 : 2 }}>
        <span
          style={{
            fontWeight: 800,
            fontSize: stacked ? '1.05rem' : '1.15rem',
            letterSpacing: '-0.025em',
            color: ink,
            whiteSpace: 'nowrap',
          }}
        >
          Analytical Data Solutions
        </span>
        <span
          style={{
            fontWeight: 500,
            fontSize: '0.62rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: muted,
          }}
        >
          IT Consulting &amp; Staffing
        </span>
      </span>
    </span>
  );
}
