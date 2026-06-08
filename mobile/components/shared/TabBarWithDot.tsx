import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { haptics } from '@/hooks/useHaptics';

export type TabIconConfig = Record<
  string,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap; label: string }
>;

interface TabBarWithDotProps extends BottomTabBarProps {
  icons: TabIconConfig;
  centerAction?: {
    routeName: string;
    onPress: () => void;
  };
}

export function TabBarWithDot({ state, descriptors, navigation, icons, centerAction }: TabBarWithDotProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, Shadows.tabBar, { paddingBottom: insets.bottom || Spacing.sm }]}>
      {state.routes.map((route, index) => {
        const config = icons[route.name];
        if (!config) return null;

        const focused = state.index === index;
        const isCenter = centerAction?.routeName === route.name;

        const onPress = () => {
          haptics.selection();
          if (isCenter && centerAction) {
            centerAction.onPress();
            return;
          }
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isCenter) {
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={config.label}
              onPress={onPress}
              style={styles.tab}
            >
              <View style={styles.centerBtn}>
                <Ionicons name="add" size={28} color={Colors.white} />
              </View>
              <Text style={styles.label}>{config.label}</Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={config.label}
            onPress={onPress}
            style={styles.tab}
          >
            <View style={focused ? styles.activeIconBubble : styles.iconBubble}>
              <Ionicons
                name={focused ? config.active : config.inactive}
                size={24}
                color={focused ? Colors.primary : Colors.textMuted2}
              />
            </View>
            <Text style={[styles.label, focused && styles.labelActive]}>
              {config.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 0.8,
    borderTopColor: Colors.surfaceMuted2,
    paddingTop: Spacing.xs,
    height: 68,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconBubble: {
    width: 40,
    height: 32,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconBubble: {
    width: 40,
    height: 32,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceIndigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.xs,
    letterSpacing: Typography.letterSpacing.tab,
    color: Colors.textMuted2,
  },
  labelActive: {
    color: Colors.primary,
    fontFamily: Typography.fonts.semibold,
  },
  centerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -4,
  },
});
