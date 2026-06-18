import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Radius, Shadows, Spacing } from '@/constants/theme';
import { ThemeColors, useThemedStyles } from '@/theme/ThemeContext';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padded?: boolean;
  elevated?: boolean;
}

export function Card({ children, style, onPress, padded = true, elevated = true }: CardProps) {
  const styles = useThemedStyles(makeStyles);
  const content = (
    <View style={[styles.card, padded && styles.padded, elevated && Shadows.card, style]}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    padded: {
      padding: Spacing.base,
    },
    pressed: {
      opacity: 0.92,
      transform: [{ scale: 0.995 }],
    },
  });
