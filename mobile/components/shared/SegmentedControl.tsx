import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { haptics } from '@/hooks/useHaptics';

interface SegmentedControlProps {
  options: string[];
  selected: number;
  onChange: (index: number) => void;
  dark?: boolean;
}

/** Figma segmented control — 16px track, 12px active pill, 10px Black uppercase labels */
export function SegmentedControl({ options, selected, onChange, dark = false }: SegmentedControlProps) {
  return (
    <View style={[styles.track, dark && styles.trackDark]}>
      {options.map((opt, i) => {
        const active = i === selected;
        return (
          <Pressable
            key={opt}
            accessibilityRole="button"
            accessibilityLabel={opt}
            accessibilityState={{ selected: active }}
            onPress={() => {
              haptics.selection();
              onChange(i);
            }}
            style={[styles.pill, active && (dark ? styles.pillActiveDark : styles.pillActive)]}
          >
            <Text style={[styles.label, dark && styles.labelDark, active && (dark ? styles.labelActiveDark : styles.labelActiveLight)]}>
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radius.lg,
    padding: 7,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  trackDark: {
    backgroundColor: Colors.glassFillSubtle,
    borderColor: Colors.glassBorderSubtle,
  },
  pill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: Colors.surface,
    ...Shadows.float,
  },
  pillActiveDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    ...Shadows.float,
  },
  label: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xs,
    letterSpacing: 1,
    color: Colors.textMuted2,
    textTransform: 'uppercase',
  },
  labelDark: {
    color: Colors.textSecondary,
  },
  labelActiveLight: {
    color: Colors.textHeading2,
  },
  labelActiveDark: {
    color: Colors.white,
  },
});
