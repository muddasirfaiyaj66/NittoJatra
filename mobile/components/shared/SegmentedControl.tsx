import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { haptics } from '@/hooks/useHaptics';

interface SegmentedControlProps {
  options: string[];
  selected: number;
  onChange: (index: number) => void;
  dark?: boolean;
}

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
    borderRadius: Radius.md,
    padding: 4,
  },
  trackDark: {
    backgroundColor: Colors.glassFillSubtle,
  },
  pill: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  pillActiveDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  label: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    letterSpacing: Typography.letterSpacing.label,
    color: Colors.textMuted3,
    textTransform: 'uppercase',
  },
  labelDark: {
    color: Colors.textSecondary,
  },
  labelActiveLight: {
    fontFamily: Typography.fonts.black,
    color: Colors.textHeading2,
  },
  labelActiveDark: {
    fontFamily: Typography.fonts.black,
    color: Colors.white,
  },
});
