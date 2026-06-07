import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Gradients, Radius, Spacing } from '@/constants/theme';

interface MapHeaderProps {
  height?: number;
  onBack?: () => void;
  children?: ReactNode;
  style?: ViewStyle;
}

/** Figma-style dark map header with decorative route lines and pins */
export function MapHeader({ height = 240, onBack, children, style }: MapHeaderProps) {
  return (
    <LinearGradient colors={[...Gradients.navyHeader]} style={[styles.container, { height }, style]}>
      <View style={styles.routeLine1} />
      <View style={styles.routeLine2} />
      <View style={[styles.pin, styles.pinA]}>
        <View style={styles.pinDot} />
      </View>
      <View style={[styles.pin, styles.pinB]}>
        <Ionicons name="location" size={22} color={Colors.primaryAlt} />
      </View>
      <View style={styles.gridDot1} />
      <View style={styles.gridDot2} />
      <View style={styles.gridDot3} />

      <SafeAreaView edges={['top']} style={styles.overlay}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </Pressable>
        ) : null}
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.darkBgNavy,
  },
  overlay: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  routeLine1: {
    position: 'absolute',
    top: 120,
    left: 60,
    width: 280,
    height: 3,
    backgroundColor: Colors.primary,
    opacity: 0.5,
    transform: [{ rotate: '12deg' }],
    borderRadius: 2,
  },
  routeLine2: {
    position: 'absolute',
    top: 160,
    left: 40,
    width: 200,
    height: 2,
    backgroundColor: Colors.indigo400,
    opacity: 0.35,
    transform: [{ rotate: '-8deg' }],
    borderRadius: 2,
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinA: {
    top: 100,
    left: 50,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Colors.white,
    backgroundColor: Colors.primary,
  },
  pinDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  pinB: {
    top: 130,
    right: 70,
  },
  gridDot1: {
    position: 'absolute',
    bottom: 40,
    left: 100,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  gridDot2: {
    position: 'absolute',
    bottom: 60,
    right: 120,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  gridDot3: {
    position: 'absolute',
    top: 80,
    right: 40,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
});
