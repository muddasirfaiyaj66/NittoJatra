import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/theme/ThemeContext';

interface DividerProps {
  vertical?: boolean;
  spacing?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function Divider({ vertical = false, spacing = Spacing.base, color, style }: DividerProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        vertical
          ? { width: StyleSheet.hairlineWidth, marginHorizontal: spacing, alignSelf: 'stretch' }
          : { height: StyleSheet.hairlineWidth, marginVertical: spacing, alignSelf: 'stretch' },
        { backgroundColor: color ?? colors.borderMid },
        style,
      ]}
    />
  );
}
