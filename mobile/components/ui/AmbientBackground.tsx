import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface AmbientBackgroundProps {
  children: ReactNode;
}

export function AmbientBackground({ children }: AmbientBackgroundProps) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[Colors.darkBgNavy, Colors.darkBg, Colors.darkBg]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.orb, styles.orbIndigo]} />
      <View style={[styles.orb, styles.orbPurple]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  orb: {
    position: 'absolute',
    width: 500,
    height: 500,
    borderRadius: 250,
  },
  orbIndigo: {
    top: -100,
    right: -150,
    backgroundColor: Colors.orbIndigo,
  },
  orbPurple: {
    bottom: -100,
    left: -150,
    backgroundColor: Colors.orbPurple,
  },
});
