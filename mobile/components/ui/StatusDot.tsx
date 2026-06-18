import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius } from '@/constants/theme';

interface StatusDotProps {
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export function StatusDot({ color = Colors.accentEmerald, size = 8, style }: StatusDotProps) {
  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    borderRadius: Radius.full,
  },
});
