import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Spacing } from '@/constants/theme';

interface DarkHeaderProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function DarkHeader({ children, style }: DarkHeaderProps) {
  return (
    <LinearGradient colors={[...Gradients.navyHeader]} style={[styles.header, style]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 73,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
});
