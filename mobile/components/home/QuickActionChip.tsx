import { Pressable, StyleSheet, Text } from 'react-native';
import { Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { ThemeColors, useThemedStyles } from '@/theme/ThemeContext';

export interface QuickAction {
  id: string;
  emoji: string;
  label: string;
}

interface QuickActionChipProps {
  action: QuickAction;
  active?: boolean;
  onPress?: (action: QuickAction) => void;
}

export function QuickActionChip({ action, active = false, onPress }: QuickActionChipProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={action.label}
      onPress={() => onPress?.(action)}
      style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && styles.pressed]}
    >
      <Text style={styles.emoji}>{action.emoji}</Text>
      <Text style={[styles.label, active && styles.labelActive]}>{action.label}</Text>
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.md,
      borderRadius: Radius.full,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      ...Shadows.card,
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    pressed: {
      opacity: 0.85,
    },
    emoji: {
      fontSize: 16,
    },
    label: {
      fontFamily: Typography.fonts.semibold,
      fontSize: Typography.fontSizes.sm,
      color: colors.textSecondary,
    },
    labelActive: {
      color: colors.white,
    },
  });
