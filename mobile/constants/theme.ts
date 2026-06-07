import { TextStyle, ViewStyle } from 'react-native';

export const Colors = {
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  accent: '#EC4899',
  accentLight: '#FDF2F8',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#F1F5F9',
  borderMid: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  dark: '#1E293B',
  darkDeep: '#0F172A',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const DarkColors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  accent: '#F472B6',
  accentLight: '#3F1D38',
  background: '#0F172A',
  surface: '#1E293B',
  border: '#334155',
  borderMid: '#475569',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#F87171',
  dark: '#0F172A',
  darkDeep: '#020617',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorTokens = typeof Colors;
export type ColorName = keyof ColorTokens;

export const Typography = {
  fontSizes: { xs: 11, sm: 13, base: 15, md: 17, lg: 20, xl: 24, xxl: 30, display: 38 },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
  fonts: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
    extrabold: 'Poppins_800ExtraBold',
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
  section: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Shadows: Record<'card' | 'float', ViewStyle> = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  float: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
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
