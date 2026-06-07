import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Radius, Spacing, Typography } from '@/constants/theme';
import { haptics } from '@/hooks/useHaptics';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: 'home', inactive: 'home-outline' },
  search: { active: 'search', inactive: 'search-outline' },
  bookings: { active: 'ticket', inactive: 'ticket-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

export function AnimatedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  const tabCount = state.routes.length;
  const indicator = useSharedValue(state.index);

  useEffect(() => {
    indicator.value = withSpring(state.index, { damping: 16, stiffness: 140 });
  }, [state.index, indicator]);

  const indicatorStyle = useAnimatedStyle(() => ({
    left: `${(indicator.value * 100) / tabCount}%`,
    width: `${100 / tabCount}%`,
  }));

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom || Spacing.sm }]}>
      <Animated.View style={[styles.indicatorTrack, indicatorStyle]}>
        <View style={styles.indicator} />
      </Animated.View>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = (options.title ?? route.name) as string;
        const focused = state.index === index;
        const icon = ICONS[route.name] ?? { active: 'ellipse', inactive: 'ellipse-outline' };

        const onPress = () => {
          haptics.selection();
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={label}
            onPress={onPress}
            style={styles.tab}
          >
            <Ionicons
              name={focused ? icon.active : icon.inactive}
              size={22}
              color={focused ? colors.primary : colors.textMuted}
            />
            <Text style={[styles.label, { color: focused ? colors.primary : colors.textMuted }]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
      paddingTop: Spacing.sm,
    },
    indicatorTrack: {
      position: 'absolute',
      top: 0,
      height: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    indicator: {
      width: 32,
      height: 3,
      borderRadius: Radius.full,
      backgroundColor: colors.primary,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 3,
      paddingVertical: Spacing.xs,
    },
    label: {
      fontFamily: Typography.fonts.medium,
      fontSize: 11,
    },
  });
