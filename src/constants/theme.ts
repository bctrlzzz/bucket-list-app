export const colors = {
  background: '#FCFCFA',
  sidebar: '#F3F4F0',
  surface: '#FFFFFF', // cards and buttons
  surfaceMuted: '#EBEFE8', // photo placeholders, progress bars
  border: '#E2E5DE',
  text: '#252B27',
  textMuted: '#747B75',
  accent: '#904527', // terracotta: buttons, active items
  accentSoft: '#FEECE5', // light terracotta backgrounds
  onAccent: '#FCFCFA', // text on top of accent buttons
} as const;

export const fonts = {
  regular: 'Inter_400Regular',
  semibold: 'Inter_600SemiBold',
} as const;

export const fontSize = {
  caption: 10,
  small: 11,
  body: 13,
  cardTitle: 15,
  heading: 16,
  title: 28,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 5,
  md: 7,
  lg: 9,
  pill: 100,
} as const;