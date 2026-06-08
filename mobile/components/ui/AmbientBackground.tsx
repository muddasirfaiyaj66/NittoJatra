import { BlurView } from 'expo-blur';
import { ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

interface AmbientBackgroundProps {
  children: ReactNode;
}

/** Figma auth background — #020617 + indigo/purple blur orbs (500px, blur 60) */
export function AmbientBackground({ children }: AmbientBackgroundProps) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[Colors.darkBg, Colors.darkBg, Colors.darkBgNavy]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orbWrap, styles.orbIndigoWrap]}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={80} tint="dark" style={styles.orbBlur}>
            <View style={styles.orbIndigoFill} />
          </BlurView>
        ) : (
          <View style={[styles.orb, styles.orbIndigoFill]} />
        )}
      </View>
      <View style={[styles.orbWrap, styles.orbPurpleWrap]}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={80} tint="dark" style={styles.orbBlur}>
            <View style={styles.orbPurpleFill} />
          </BlurView>
        ) : (
          <View style={[styles.orb, styles.orbPurpleFill]} />
        )}
      </View>
      {children}
    </View>
  );
}

const ORB = 500;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  orbWrap: {
    position: 'absolute',
    width: ORB,
    height: ORB,
    borderRadius: ORB / 2,
    overflow: 'hidden',
  },
  orbBlur: {
    width: ORB,
    height: ORB,
    borderRadius: ORB / 2,
    overflow: 'hidden',
  },
  orb: {
    width: ORB,
    height: ORB,
    borderRadius: ORB / 2,
  },
  orbIndigoWrap: {
    top: -128,
    right: -128,
  },
  orbPurpleWrap: {
    bottom: -128,
    left: -128,
  },
  orbIndigoFill: {
    flex: 1,
    backgroundColor: Colors.orbIndigo,
  },
  orbPurpleFill: {
    flex: 1,
    backgroundColor: Colors.orbPurple,
  },
});
