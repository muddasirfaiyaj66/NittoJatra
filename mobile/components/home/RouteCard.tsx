import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';
import { RouteItem } from '@/types';

const GRADIENTS: [string, string][] = [
  ['#4F46E5', '#7C3AED'],
  ['#EC4899', '#F472B6'],
  ['#0EA5E9', '#2563EB'],
  ['#059669', '#10B981'],
  ['#D97706', '#F59E0B'],
  ['#7C3AED', '#4F46E5'],
];

interface RouteCardProps {
  route: RouteItem;
  index: number;
  onBook: (route: RouteItem) => void;
}

export function RouteCard({ route, index, onBook }: RouteCardProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const gradient = GRADIENTS[index % GRADIENTS.length];

  return (
    <View style={styles.card}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.image}>
        <View style={styles.durationPill}>
          <Ionicons name="time-outline" size={12} color="#FFFFFF" />
          <Text style={styles.durationText}>{route.duration}</Text>
        </View>
        <Ionicons name="bus" size={36} color="rgba(255,255,255,0.85)" style={styles.busIcon} />
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.routeRow}>
          <Text style={styles.city} numberOfLines={1}>
            {route.fromEn}
          </Text>
          <Ionicons name="arrow-forward" size={14} color={colors.textMuted} />
          <Text style={styles.city} numberOfLines={1}>
            {route.toEn}
          </Text>
        </View>
        <Text style={styles.cityBn} numberOfLines={1}>
          {route.from} → {route.to}
        </Text>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>from</Text>
            <Text style={styles.price}>৳ {route.priceFrom}</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Book ${route.fromEn} to ${route.toEn}`}
            onPress={() => onBook(route)}
            style={({ pressed }) => [styles.bookBtn, pressed && styles.pressed]}
          >
            <Text style={styles.bookText}>BOOK NOW</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      width: 240,
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      ...Shadows.card,
    },
    image: {
      height: 96,
      padding: Spacing.md,
      justifyContent: 'space-between',
    },
    durationPill: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(0,0,0,0.25)',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: Radius.full,
    },
    durationText: {
      color: '#FFFFFF',
      fontFamily: Typography.fonts.semibold,
      fontSize: Typography.fontSizes.xs,
    },
    busIcon: {
      alignSelf: 'flex-end',
    },
    body: {
      padding: Spacing.base,
    },
    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    city: {
      fontFamily: Typography.fonts.bold,
      fontSize: Typography.fontSizes.base,
      color: colors.textPrimary,
      maxWidth: 90,
    },
    cityBn: {
      fontFamily: Typography.fonts.bengali,
      fontSize: Typography.fontSizes.xs,
      color: colors.textMuted,
      marginTop: 2,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: Spacing.base,
    },
    priceLabel: {
      fontFamily: Typography.fonts.regular,
      fontSize: Typography.fontSizes.xs,
      color: colors.textMuted,
    },
    price: {
      fontFamily: Typography.fonts.extrabold,
      fontSize: Typography.fontSizes.lg,
      color: colors.primary,
    },
    bookBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.md,
    },
    pressed: {
      opacity: 0.85,
    },
    bookText: {
      color: colors.white,
      fontFamily: Typography.fonts.bold,
      fontSize: Typography.fontSizes.xs,
      letterSpacing: 0.5,
    },
  });
