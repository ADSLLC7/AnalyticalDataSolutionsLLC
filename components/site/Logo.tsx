import Image from 'next/image';

export function LogoMark({ size = 48, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <Image
      src={onDark ? '/brand/ads-icon-ondark.png' : '/brand/ads-icon-onlight.png'}
      alt="ADS logo mark"
      width={size}
      height={size}
      style={{ display: 'block', flexShrink: 0, objectFit: 'contain' }}
      priority
    />
  );
}

export default function Logo({
  size = 48,
  stacked = false,
  onDark = false,
}: {
  size?: number;
  stacked?: boolean;
  onDark?: boolean;
}) {
  const ink = onDark ? 'var(--mk-ink)' : '#0F1533';
  const muted = onDark ? 'var(--mk-accent)' : '#52597A';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.24,
        lineHeight: 1,
      }}
    >
      <LogoMark size={size} onDark={onDark} />
      <span style={{ display: 'flex', flexDirection: 'column', gap: stacked ? 5 : 4 }}>
        <span
          style={{
            fontWeight: 800,
            fontSize: stacked ? '1.2rem' : '1.35rem',
            letterSpacing: '-0.03em',
            color: ink,
            whiteSpace: 'nowrap',
          }}
        >
          Analytical Data Solutions
        </span>
        <span
          style={{
            fontWeight: 600,
            fontSize: '0.66rem',
            letterSpacing: '0.17em',
            textTransform: 'uppercase',
            color: muted,
          }}
        >
          Empowering the Leaders of Tomorrow
        </span>
      </span>
    </span>
  );
}
