import { ReactNode, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...rest
}: InputProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[styles.inputWrapper, focused && styles.focused, !!error && styles.errorBorder]}
      >
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    label: {
      fontFamily: Typography.fonts.medium,
      fontSize: Typography.fontSizes.sm,
      color: colors.textSecondary,
      marginBottom: Spacing.xs,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.borderMid,
      borderRadius: Radius.md,
      paddingHorizontal: Spacing.base,
      minHeight: 52,
    },
    focused: {
      borderColor: colors.primary,
    },
    errorBorder: {
      borderColor: colors.danger,
    },
    input: {
      flex: 1,
      fontFamily: Typography.fonts.regular,
      fontSize: Typography.fontSizes.base,
      color: colors.textPrimary,
      paddingVertical: Spacing.md,
    },
    leftIcon: {
      marginRight: Spacing.sm,
    },
    rightIcon: {
      marginLeft: Spacing.sm,
    },
    error: {
      fontFamily: Typography.fonts.regular,
      fontSize: Typography.fontSizes.xs,
      color: colors.danger,
      marginTop: Spacing.xs,
    },
  });
