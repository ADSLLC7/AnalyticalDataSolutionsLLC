// Deterministic tag → color mapping so blog categories are visually distinct
// but stable across renders. Known categories get fixed hues; unknown tags
// hash into the palette.

export type TagColor = { bg: string; fg: string };

const PALETTE: TagColor[] = [
  { bg: 'oklch(0.93 0.045 250)', fg: 'oklch(0.40 0.13 255)' }, // blue
  { bg: 'oklch(0.93 0.055 155)', fg: 'oklch(0.37 0.11 155)' }, // green
  { bg: 'oklch(0.93 0.055 305)', fg: 'oklch(0.42 0.13 305)' }, // purple
  { bg: 'oklch(0.94 0.06 85)', fg: 'oklch(0.44 0.11 75)' },    // amber
  { bg: 'oklch(0.94 0.025 28)', fg: 'oklch(0.50 0.16 28)' },   // terracotta
  { bg: 'oklch(0.93 0.04 200)', fg: 'oklch(0.38 0.09 210)' },  // teal
];

const FIXED: Record<string, number> = {
  'ai in practice': 0,
  'ai infrastructure': 2,
  'data engineering': 1,
  'talent': 3,
  'tech news': 5,
};

export function tagColor(tag: string): TagColor {
  const key = tag.trim().toLowerCase();
  if (key in FIXED) return PALETTE[FIXED[key]];
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
