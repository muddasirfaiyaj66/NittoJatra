import { TextStyle, ViewStyle } from 'react-native';

/** Figma-accurate design tokens — dark-first glassmorphic system */
export const Colors = {
  primary: '#4F46E5',
  primaryGradStart: '#6366F1',
  primaryGradEnd: '#8B5CF6',
  primaryDeep: '#7E22CE',
  primaryAlt: '#9333EA',
  indigo400: '#818CF8',
  purple400: '#C084FC',
  purple500: '#A855F7',
  accent: '#EC4899',
  accentLight: '#FDF2F8',
  accentEmerald: '#10B981',
  accentTeal: '#14B8A6',
  successGlow: '#A7F3D0',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  surfaceMuted2: '#F3F4F6',
  surfaceIndigo: '#EEF2FF',
  track: '#E2E8F0',
  border: '#F1F5F9',
  borderMid: '#E2E8F0',
  textPrimary: '#0F172A',
  textHeading2: '#111827',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  textMuted2: '#6B7280',
  textMuted3: '#4B5563',
  textFaint: '#475569',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  dangerDeep: '#DC2626',
  gold: '#F59E0B',
  dark: '#1E293B',
  darkDeep: '#0F172A',
  darkBg: '#020617',
  darkBgNavy: '#0B1220',
  darkBgNavy2: '#111A2E',
  glassFill: 'rgba(0,0,0,0.4)',
  glassFillSubtle: 'rgba(0,0,0,0.2)',
  glassInput: 'rgba(255,255,255,0.05)',
  glassBorder: 'rgba(255,255,255,0.1)',
  glassBorderSubtle: 'rgba(255,255,255,0.05)',
  glassHairline: 'rgba(255,255,255,0.2)',
  orbIndigo: 'rgba(79,70,229,0.2)',
  orbPurple: 'rgba(147,51,234,0.1)',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const DarkColors = {
  ...Colors,
  background: Colors.darkBg,
  surface: Colors.darkBgNavy,
  surfaceMuted: Colors.glassFillSubtle,
  surfaceMuted2: Colors.glassFill,
  border: Colors.glassBorder,
  borderMid: Colors.glassBorderSubtle,
  textPrimary: Colors.white,
  textHeading2: Colors.white,
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textMuted2: '#64748B',
  textMuted3: '#64748B',
  textFaint: '#475569',
} as const;

export type ColorTokens = typeof Colors;
export type ColorName = keyof ColorTokens;

export const Gradients = {
  appIcon: ['#6366F1', '#8B5CF6'] as const,
  wordmark: ['#6366F1', '#8B5CF6'] as const,
  welcomeTagline: ['#6366F1', '#EC4899'] as const,
  headlineAccent: ['#818CF8', '#C084FC'] as const,
  premiumBanner: ['#0EA5E9', '#4F46E5'] as const,
  routeDivider: ['#6366F1', '#A855F7'] as const,
  ctaPrimary: ['#4F46E5', '#7E22CE'] as const,
  ctaRegister: ['#4F46E5', '#10B981'] as const,
  ctaRegisterAlt: ['#6366F1', '#14B8A6'] as const,
  avatar: ['#818CF8', '#A855F7'] as const,
  successBadge: ['#10B981', '#14B8A6'] as const,
  safetyHeader: ['#EF4444', '#EC4899'] as const,
  emergency: ['#EF4444', '#DC2626'] as const,
  navyHeader: ['#0B1220', '#111A2E'] as const,
} as const;

export const Typography = {
  fontSizes: { xs: 10, sm: 12, base: 14, md: 16, lg: 20, xl: 24, xxl: 32, display: 36 },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
  letterSpacing: {
    tight: -0.9,
    heading: -0.6,
    h2: -0.5,
    stat: -0.3,
    eyebrow: 1.2,
    label: 0.5,
    button: 2.4,
    buttonSm: 2,
    tab: 0.25,
    subtitle: 2.4,
  },
  lineHeights: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
  fonts: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    black: 'Inter_900Black',
    extrabold: 'Inter_900Black',
    bengali: 'NotoSansBengali_400Regular',
    bengaliBold: 'NotoSansBengali_700Bold',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  section: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  card: 32,
  xl: 40,
  full: 9999,
} as const;

export const Shadows: Record<'card' | 'float' | 'glass' | 'cta' | 'tabBar' | 'findCta' | 'sheet', ViewStyle> = {
  card: {
    shadowColor: '#E2E8F0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 4,
  },
  float: {
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 12,
  },
  cta: {
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 6,
  },
  tabBar: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 8,
  },
  findCta: {
    shadowColor: '#C7D2FE',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 8,
  },
  sheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 12,
  },
};

export const textStyle = (
  size: keyof typeof Typography.fontSizes,
  weight: keyof typeof Typography.fontWeights = 'regular',
  color: string = Colors.textPrimary,
): TextStyle => ({
  fontSize: Typography.fontSizes[size],
  fontWeight: Typography.fontWeights[weight] as TextStyle['fontWeight'],
  color,
});

/** Format Taka amounts with ৳ symbol */
export function formatTaka(amount: number, decimals = 0): string {
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `৳${formatted}`;
}
