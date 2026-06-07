import { useEffect, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Radius, Spacing } from '@/constants/theme';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ width = '100%', height = 16, radius = Radius.sm, style }: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: colors.borderMid, opacity },
        style,
      ]}
    />
  );
}

export function RideCardSkeleton() {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Skeleton width={44} height={44} radius={22} />
        <View style={styles.flex}>
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={12} style={styles.mt8} />
        </View>
        <Skeleton width={56} height={20} radius={Radius.full} />
      </View>
      <Skeleton width="100%" height={1} style={styles.mt16} />
      <View style={[styles.row, styles.mt16]}>
        <Skeleton width="45%" height={32} />
        <Skeleton width="30%" height={32} />
      </View>
      <Skeleton width="100%" height={44} radius={Radius.md} style={styles.mt16} />
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: Spacing.base,
      marginBottom: Spacing.base,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      justifyContent: 'space-between',
    },
    flex: {
      flex: 1,
    },
    mt8: {
      marginTop: Spacing.sm,
    },
    mt16: {
      marginTop: Spacing.base,
    },
  });
