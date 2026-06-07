import { ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { Typography as Type } from '@/constants/theme';
import { ThemeColors, useThemedStyles } from '@/theme/ThemeContext';

type Variant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'bodyLg' | 'caption' | 'label';

interface BaseTextProps extends TextProps {
  children: ReactNode;
  color?: string;
  style?: StyleProp<TextStyle>;
  bengali?: boolean;
  center?: boolean;
}

function Base({
  children,
  variant,
  color,
  style,
  bengali,
  center,
  ...rest
}: BaseTextProps & { variant: Variant }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Text
      style={[
        styles[variant],
        bengali && styles.bengali,
        center && styles.center,
        color ? { color } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export const Heading = ({ level = 1, ...props }: BaseTextProps & { level?: 1 | 2 | 3 }) => {
  const variant: Variant = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3';
  return <Base variant={variant} {...props} />;
};

export const Display = (props: BaseTextProps) => <Base variant="display" {...props} />;
export const Body = (props: BaseTextProps) => <Base variant="body" {...props} />;
export const BodyLarge = (props: BaseTextProps) => <Base variant="bodyLg" {...props} />;
export const Caption = (props: BaseTextProps) => <Base variant="caption" {...props} />;
export const Label = (props: BaseTextProps) => <Base variant="label" {...props} />;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    display: {
      fontFamily: Type.fonts.extrabold,
      fontSize: Type.fontSizes.display,
      color: colors.textPrimary,
    },
    h1: {
      fontFamily: Type.fonts.bold,
      fontSize: Type.fontSizes.xxl,
      color: colors.textPrimary,
    },
    h2: {
      fontFamily: Type.fonts.bold,
      fontSize: Type.fontSizes.xl,
      color: colors.textPrimary,
    },
    h3: {
      fontFamily: Type.fonts.semibold,
      fontSize: Type.fontSizes.lg,
      color: colors.textPrimary,
    },
    bodyLg: {
      fontFamily: Type.fonts.regular,
      fontSize: Type.fontSizes.md,
      color: colors.textSecondary,
    },
    body: {
      fontFamily: Type.fonts.regular,
      fontSize: Type.fontSizes.base,
      color: colors.textSecondary,
    },
    caption: {
      fontFamily: Type.fonts.regular,
      fontSize: Type.fontSizes.sm,
      color: colors.textMuted,
    },
    label: {
      fontFamily: Type.fonts.medium,
      fontSize: Type.fontSizes.sm,
      color: colors.textSecondary,
    },
    bengali: {
      fontFamily: Type.fonts.bengali,
    },
    center: {
      textAlign: 'center',
    },
  });
