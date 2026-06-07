import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { Gradients, Typography } from '@/constants/theme';

interface GradientTextProps {
  children: string;
  style?: StyleProp<TextStyle>;
  colors?: readonly [string, string];
}

/** Figma headline accent text — gradient clipped to glyphs (#818CF8 → #C084FC) */
export function GradientText({
  children,
  style,
  colors = Gradients.headlineAccent,
}: GradientTextProps) {
  const baseStyle: TextStyle = {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.display,
    letterSpacing: Typography.letterSpacing.tight,
    lineHeight: 40,
  };

  return (
    <MaskedView
      maskElement={
        <Text style={[baseStyle, style]} accessibilityRole="text">
          {children}
        </Text>
      }
    >
      <LinearGradient colors={[colors[0], colors[1]]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}>
        <Text style={[baseStyle, style, styles.hidden]}>{children}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

const styles = StyleSheet.create({
  hidden: {
    opacity: 0,
  },
});
