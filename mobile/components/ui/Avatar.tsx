import { Image, ImageStyle } from 'expo-image';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Typography } from '@/constants/theme';
import { ThemeColors, useThemedStyles } from '@/theme/ThemeContext';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ uri, name, size = 48, style }: AvatarProps) {
  const styles = useThemedStyles(makeStyles);
  const dimensions = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, dimensions, style as StyleProp<ImageStyle>]}
        contentFit="cover"
        transition={150}
      />
    );
  }

  return (
    <View style={[styles.fallback, dimensions, style]}>
      <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{getInitials(name)}</Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    image: {
      backgroundColor: colors.border,
    },
    fallback: {
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    initials: {
      color: colors.white,
      fontFamily: Typography.fonts.bold,
      fontWeight: '700',
    },
  });
