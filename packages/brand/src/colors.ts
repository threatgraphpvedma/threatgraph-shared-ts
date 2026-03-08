export const colors = {
  primary:   '#38BDF8',   // sky blue — main CTA, links, highlights
  secondary: '#818CF8',   // indigo — gradients, secondary elements
  bg:        '#0A0F1E',   // dark navy — page background
  bgCard:    '#0F172A',   // slightly lighter — card backgrounds
  text:      '#E2E8F0',   // slate-200 — primary text
  textMuted: '#94A3B8',   // slate-400 — secondary text
  border:    '#1E293B',   // slate-800 — card borders
} as const;

export type ColorKey = keyof typeof colors;
