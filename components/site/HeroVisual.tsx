const NODES = [
  { x: 118, y: 78, label: 'Cloud & DevOps', tone: 'deep', float: '' },
  { x: 398, y: 66, label: 'Data & AI', tone: 'accent', float: 'late' },
  { x: 66, y: 232, label: 'Java & .NET', tone: 'accent', float: 'later' },
  { x: 452, y: 210, label: 'Salesforce', tone: 'deep', float: '' },
  { x: 128, y: 380, label: 'Workday', tone: 'deep', float: 'late' },
  { x: 404, y: 372, label: 'Security', tone: 'accent', float: 'later' },
] as const;

const CENTER = { x: 260, y: 226 };

export default function HeroVisual() {
  const ink = 'oklch(0.30 0.012 28)';
  const faint = 'oklch(0.88 0.008 28)';
  const accent = 'oklch(0.50 0.16 28)';
  const accentSoft = 'oklch(0.94 0.025 28)';
  const deep = 'oklch(0.17 0.012 28)';

  return (
    <svg
      className="hero-visual"
      viewBox="0 0 520 460"
      role="img"
      aria-label="Network of ADS consulting practices: cloud and DevOps, data and AI, Java and .NET, Salesforce, Workday, and security, all connected to one team"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill={faint} />
        </pattern>
      </defs>
      <rect width="520" height="460" fill="url(#dots)" />

      {/* soft accent halo behind center */}
      <circle cx={CENTER.x} cy={CENTER.y} r="86" fill={accentSoft} opacity="0.7" />

      {/* connections */}
      <g fill="none" strokeWidth="1.6" strokeLinecap="round">
        {NODES.map((n, i) => (
          <path
            key={n.label}
            className={`flow ${i % 3 === 0 ? 'slow' : i % 3 === 1 ? '' : 'fast'}`}
            d={`M${CENTER.x} ${CENTER.y} Q ${(CENTER.x + n.x) / 2 + (i % 2 ? 26 : -26)} ${(CENTER.y + n.y) / 2}, ${n.x} ${n.y}`}
            stroke={n.tone === 'accent' ? accent : ink}
          />
        ))}
      </g>

      {/* center node */}
      <g className="mk-float">
        <circle cx={CENTER.x} cy={CENTER.y} r="56" fill={deep} />
        <circle className="pulse" cx={CENTER.x} cy={CENTER.y} r="66" fill="none" stroke={accent} strokeWidth="1.5" strokeDasharray="4 8" />
        <text x={CENTER.x} y={CENTER.y + 7} fontSize="20" fontWeight="800" fill="oklch(0.975 0.003 28)" textAnchor="middle" fontFamily="var(--mk-font)" letterSpacing="1">
          ADS
        </text>
      </g>

      {/* practice nodes */}
      {NODES.map((n) => {
        const w = n.label.length * 7.2 + 34;
        const isAccent = n.tone === 'accent';
        return (
          <g key={n.label} className={`mk-float${n.float ? `-${n.float}` : ''}`}>
            <rect
              x={n.x - w / 2}
              y={n.y - 21}
              width={w}
              height={42}
              rx={21}
              fill={isAccent ? accent : 'oklch(1 0 0)'}
              stroke={isAccent ? 'none' : faint}
              strokeWidth="1.5"
            />
            <circle className="pulse" cx={n.x - w / 2 + 17} cy={n.y} r="4" fill={isAccent ? 'oklch(0.985 0 0)' : accent} />
            <text
              x={n.x - w / 2 + 28}
              y={n.y + 4.5}
              fontSize="13"
              fontWeight="600"
              fill={isAccent ? 'oklch(0.985 0 0)' : ink}
              fontFamily="var(--mk-font)"
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
