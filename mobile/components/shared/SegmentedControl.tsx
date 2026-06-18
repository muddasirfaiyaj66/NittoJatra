import { LayoutChangeEvent, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Colors, Radius, Shadows, Typography } from '@/constants/theme';
import { haptics } from '@/hooks/useHaptics';

interface SegmentedControlProps {
  options: string[];
  selected: number;
  onChange: (index: number) => void;
  dark?: boolean;
}

/** Figma login segmented — 16px track, sliding pill, 10px Black uppercase */
export function SegmentedControl({ options, selected, onChange, dark = false }: SegmentedControlProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const pad = 6.8;
  const innerWidth = trackWidth - pad * 2;
  const pillWidth = innerWidth / options.length;

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  return (
    <View
      style={[styles.track, dark && styles.trackDark]}
      onLayout={onLayout}
    >
      {trackWidth > 0 ? (
        <View
          style={[
            styles.slidingPill,
            dark && styles.slidingPillDark,
            {
              width: pillWidth,
              left: pad + selected * pillWidth,
            },
          ]}
        />
      ) : null}
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
            style={styles.segment}
          >
            <Text
              style={[
                styles.label,
                dark && !active && styles.labelInactiveDark,
                dark && active && styles.labelActiveDark,
                !dark && active && styles.labelActiveLight,
              ]}
            >
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
    position: 'relative',
  },
  trackDark: {
    backgroundColor: Colors.glassFillSubtle,
    borderColor: Colors.glassBorderSubtle,
  },
  slidingPill: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    ...Shadows.float,
  },
  slidingPillDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xs,
    letterSpacing: 1,
    color: Colors.textMuted2,
    textTransform: 'uppercase',
    lineHeight: 15,
  },
  labelInactiveDark: {
    color: Colors.textSecondary,
  },
  labelActiveDark: {
    color: Colors.white,
  },
  labelActiveLight: {
    color: Colors.textHeading2,
  },
});
