import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/theme';

interface AmbientBackgroundProps {
  children: ReactNode;
}

export function AmbientBackground({ children }: AmbientBackgroundProps) {
  return (
    <View style={styles.root}>
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
    opacity: 0.8,
  },
  orbPurple: {
    bottom: -100,
    left: -150,
    backgroundColor: Colors.orbPurple,
    opacity: 0.8,
  },
});
