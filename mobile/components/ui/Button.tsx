import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { haptics } from '@/hooks/useHaptics';
import { ThemeColors, useTheme } from '@/theme/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = true,
  style,
  textColor,
}: ButtonProps) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const variantStyle = getVariant(colors)[variant];
  const resolvedTextColor = textColor ?? variantStyle.text.color;

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size].container,
        variantStyle.container,
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={resolvedTextColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          <Text style={[styles.text, sizeStyles[size].text, { color: resolvedTextColor }]}>
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: Spacing.sm,
  },
  text: {
    fontFamily: Typography.fonts.semibold,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.5,
  },
});

const sizeStyles: Record<ButtonSize, { container: ViewStyle; text: { fontSize: number } }> = {
  sm: {
    container: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.base, minHeight: 38 },
    text: { fontSize: Typography.fontSizes.sm },
  },
  md: {
    container: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg, minHeight: 48 },
    text: { fontSize: Typography.fontSizes.base },
  },
  lg: {
    container: { paddingVertical: Spacing.base, paddingHorizontal: Spacing.xl, minHeight: 56 },
    text: { fontSize: Typography.fontSizes.md },
  },
};

const getVariant = (
  colors: ThemeColors,
): Record<ButtonVariant, { container: ViewStyle; text: { color: string } }> => ({
  primary: {
    container: { backgroundColor: colors.primary },
    text: { color: colors.white },
  },
  secondary: {
    container: { backgroundColor: colors.accent },
    text: { color: colors.white },
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
    text: { color: colors.primary },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.primary },
  },
  danger: {
    container: { backgroundColor: colors.danger },
    text: { color: colors.white },
  },
});
