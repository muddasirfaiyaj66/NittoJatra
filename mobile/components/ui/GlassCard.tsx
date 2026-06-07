import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Shadows } from '@/constants/theme';

interface GlassCardProps {
  children: ReactNode;
  style?: ViewStyle;
  intensity?: number;
  light?: boolean;
  /** Figma auth card inner padding — default 32.8px */
  padding?: number;
}

export function GlassCard({ children, style, intensity = 12, light = false, padding = 33 }: GlassCardProps) {
  const fill = light ? Colors.surface : Colors.glassFill;
  const borderColor = light ? Colors.border : Colors.glassBorder;

  return (
    <View style={[styles.wrapper, Shadows.glass, style]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={intensity} tint="dark" style={styles.blur}>
          <View style={[styles.inner, { backgroundColor: fill, borderColor, padding }]}>{children}</View>
        </BlurView>
      ) : (
        <View style={[styles.inner, { backgroundColor: fill, borderColor, padding }]}>{children}</View>
      )}
      <LinearGradient
        colors={['transparent', Colors.glassHairline, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.hairline}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  blur: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  inner: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: 32,
  },
  hairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
});
