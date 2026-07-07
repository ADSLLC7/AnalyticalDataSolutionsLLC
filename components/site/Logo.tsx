import Image from 'next/image';

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <Image
      src="/brand/ads-icon.png"
      alt="ADS logo mark"
      width={size}
      height={size}
      style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }}
      priority
    />
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
      <LogoMark size={size} />
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
