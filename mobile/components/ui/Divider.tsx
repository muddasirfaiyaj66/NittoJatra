import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';

interface DividerProps {
  vertical?: boolean;
  spacing?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Divider({ vertical = false, spacing = Spacing.base, color, style }: DividerProps) {
  return (
    <View
      style={[
        vertical
          ? { width: StyleSheet.hairlineWidth, marginHorizontal: spacing, alignSelf: 'stretch' }
          : { height: StyleSheet.hairlineWidth, marginVertical: spacing, alignSelf: 'stretch' },
        { backgroundColor: color ?? Colors.borderMid },
        style,
      ]}
    />
  );
}
