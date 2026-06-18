import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { BadgeVariant } from '@/types';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
}

const VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  active: { bg: '#DCFCE7', text: '#15803D' },
  success: { bg: '#DCFCE7', text: '#15803D' },
  pending: { bg: '#FEF3C7', text: '#B45309' },
  cancelled: { bg: '#FEE2E2', text: '#B91C1C' },
  womens: { bg: '#FCE7F3', text: '#BE185D' },
  express: { bg: '#E0E7FF', text: '#4338CA' },
  info: { bg: '#E0F2FE', text: '#0369A1' },
};

export function Badge({ label, variant = 'info', style, small = false }: BadgeProps) {
  const colors = VARIANT_COLORS[variant];
  return (
    <View
      style={[
        styles.badge,
        small && styles.small,
        { backgroundColor: colors.bg },
        style,
      ]}
    >
      <Text style={[styles.text, small && styles.smallText, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

export const serviceTypeToBadge = (type: string): BadgeVariant => {
  switch (type) {
    case 'Women Special':
      return 'womens';
    case 'Express':
      return 'express';
    case 'AC':
      return 'info';
    default:
      return 'pending';
  }
};

export const statusToBadge = (status: string): BadgeVariant => {
  switch (status) {
    case 'upcoming':
      return 'active';
    case 'completed':
      return 'info';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  small: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  text: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.xs,
    fontWeight: '600',
  },
  smallText: {
    fontSize: 10,
  },
});
