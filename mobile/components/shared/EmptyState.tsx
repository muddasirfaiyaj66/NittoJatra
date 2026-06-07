import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, ReactNode } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

interface EmptyStateProps {
  icon?: ComponentProps<typeof Ionicons>['name'];
  title: string;
  message?: string;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  message,
  action,
  style,
  compact = false,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, compact && styles.compact, style]}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={compact ? 28 : 40} color={Colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.section,
    paddingHorizontal: Spacing.lg,
  },
  compact: {
    paddingVertical: Spacing.xl,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
  },
  title: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.md,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  message: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
    maxWidth: 260,
  },
  action: {
    marginTop: Spacing.lg,
    alignSelf: 'stretch',
  },
});
