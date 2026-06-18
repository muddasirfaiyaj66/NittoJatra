import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { haptics } from '@/hooks/useHaptics';

interface SolidButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

/** Figma solid primary button (#4F46E5) with indigo glow shadow — Find screen CTA */
export function SolidButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
}: SolidButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    haptics.medium();
    onPress?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: disabled || loading }}
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [styles.wrapper, Shadows.findCta, style, pressed && styles.pressed]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text style={styles.label}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
  },
  label: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.sm,
    letterSpacing: Typography.letterSpacing.button,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.88,
  },
});
