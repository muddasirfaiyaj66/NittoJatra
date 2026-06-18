import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { haptics } from '@/hooks/useHaptics';

export type GradientVariant = 'primary' | 'register' | 'success' | 'emergency';

const VARIANT_COLORS: Record<GradientVariant, readonly [string, string]> = {
  primary: Gradients.ctaPrimary,
  register: Gradients.ctaRegister,
  success: Gradients.successBadge,
  emergency: Gradients.emergency,
};

interface GradientButtonProps {
  title: string;
  onPress?: () => void;
  variant?: GradientVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  accessibilityLabel?: string;
  icon?: React.ReactNode;
}

export function GradientButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  accessibilityLabel,
  icon,
}: GradientButtonProps) {
  const colors = VARIANT_COLORS[variant];

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
      style={({ pressed }) => [styles.wrapper, Shadows.cta, style, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={[colors[0], colors[1]]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            {icon}
            <Text style={styles.label}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderTopWidth: 0.8,
    borderTopColor: Colors.glassHairline,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
    paddingHorizontal: 40,
    minHeight: 56,
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
