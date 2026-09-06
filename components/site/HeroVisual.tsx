const NODES = [
  { x: 122, y: 84, label: 'Cloud & DevOps', tone: 'cool', float: '' },
  { x: 396, y: 70, label: 'Data & AI', tone: 'gold', float: 'late' },
  { x: 70, y: 234, label: 'Java & .NET', tone: 'gold', float: 'later' },
  { x: 450, y: 212, label: 'Salesforce', tone: 'cool', float: '' },
  { x: 132, y: 378, label: 'Workday', tone: 'cool', float: 'late' },
  { x: 402, y: 370, label: 'Security', tone: 'gold', float: 'later' },
] as const;

const CENTER = { x: 260, y: 226 };

// Tuned for the dark navy hero: light strokes and pale text, with gold
// carrying the emphasis. Do not reuse on a light ground without recoloring.
export default function HeroVisual() {
  const gold = '#d9a01c';
  const nodeFill = '#161d45';
  const nodeStroke = 'rgba(255,255,255,0.16)';
  const coolStroke = 'rgba(168,180,232,0.55)';
  const textLight = '#e8ebf7';
  const dot = 'rgba(255,255,255,0.10)';

  return (
    <svg
      className="hero-visual"
      viewBox="0 0 520 460"
      role="img"
      aria-label="Network of ADS consulting practices: cloud and DevOps, data and AI, Java and .NET, Salesforce, Workday, and security, all connected to one team"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        <pattern id="hv-dots" width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill={dot} />
        </pattern>
        <radialGradient id="hv-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={gold} stopOpacity="0.30" />
          <stop offset="100%" stopColor={gold} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="520" height="460" fill="url(#hv-dots)" />

      {/* warm halo behind the core */}
      <circle cx={CENTER.x} cy={CENTER.y} r="132" fill="url(#hv-halo)" />

      {/* connections */}
      <g fill="none" strokeWidth="1.6" strokeLinecap="round">
        {NODES.map((n, i) => (
          <path
            key={n.label}
            className={`flow ${i % 3 === 0 ? 'slow' : i % 3 === 1 ? '' : 'fast'}`}
            d={`M${CENTER.x} ${CENTER.y} Q ${(CENTER.x + n.x) / 2 + (i % 2 ? 26 : -26)} ${(CENTER.y + n.y) / 2}, ${n.x} ${n.y}`}
            stroke={n.tone === 'gold' ? gold : coolStroke}
            strokeOpacity={n.tone === 'gold' ? 0.85 : 0.5}
          />
        ))}
      </g>

      {/* center node */}
      <g className="mk-float">
        <circle cx={CENTER.x} cy={CENTER.y} r="58" fill="#1e2472" stroke={gold} strokeWidth="1.5" />
        <circle
          className="pulse"
          cx={CENTER.x}
          cy={CENTER.y}
          r="72"
          fill="none"
          stroke={gold}
          strokeWidth="1.5"
          strokeDasharray="4 8"
          strokeOpacity="0.7"
        />
        <text
          x={CENTER.x}
          y={CENTER.y + 7}
          fontSize="20"
          fontWeight="800"
          fill="#ffffff"
          textAnchor="middle"
          fontFamily="var(--mk-font)"
          letterSpacing="1.5"
        >
          ADS
        </text>
      </g>

      {/* practice nodes */}
      {NODES.map((n) => {
        const w = n.label.length * 7.2 + 34;
        const isGold = n.tone === 'gold';
        return (
          <g key={n.label} className={`mk-float${n.float ? `-${n.float}` : ''}`}>
            <rect
              x={n.x - w / 2}
              y={n.y - 21}
              width={w}
              height={42}
              rx={10}
              fill={nodeFill}
              stroke={isGold ? gold : nodeStroke}
              strokeWidth="1.5"
            />
            <circle
              className="pulse"
              cx={n.x - w / 2 + 17}
              cy={n.y}
              r="4"
              fill={isGold ? gold : coolStroke}
            />
            <text
              x={n.x - w / 2 + 28}
              y={n.y + 4.5}
              fontSize="13"
              fontWeight="600"
              fill={textLight}
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
