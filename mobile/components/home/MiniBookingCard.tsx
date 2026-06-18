import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';
import { Booking } from '@/types';

interface MiniBookingCardProps {
  booking: Booking;
  onPress?: (booking: Booking) => void;
}

export function MiniBookingCard({ booking, onPress }: MiniBookingCardProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Booking ${booking.route.from} to ${booking.route.to}`}
      onPress={() => onPress?.(booking)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.dateBadge}>
          <Ionicons name="calendar-outline" size={12} color={colors.primary} />
          <Text style={styles.dateText}>{booking.date}</Text>
        </View>
        <Text style={styles.amount}>৳ {booking.amount}</Text>
      </View>

      <View style={styles.routeRow}>
        <Text style={styles.city}>{booking.route.from}</Text>
        <Ionicons name="arrow-forward" size={14} color={colors.textMuted} />
        <Text style={styles.city}>{booking.route.to}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{booking.departureTime}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="ticket-outline" size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{booking.seatCount} seat{booking.seatCount > 1 ? 's' : ''}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      width: 220,
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: Spacing.base,
      ...Shadows.card,
    },
    pressed: {
      opacity: 0.92,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.accentLight,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: Radius.full,
    },
    dateText: {
      fontFamily: Typography.fonts.semibold,
      fontSize: Typography.fontSizes.xs,
      color: colors.primary,
    },
    amount: {
      fontFamily: Typography.fonts.bold,
      fontSize: Typography.fontSizes.base,
      color: colors.textPrimary,
    },
    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginTop: Spacing.md,
    },
    city: {
      fontFamily: Typography.fonts.bold,
      fontSize: Typography.fontSizes.base,
      color: colors.textPrimary,
    },
    bottomRow: {
      flexDirection: 'row',
      gap: Spacing.lg,
      marginTop: Spacing.md,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontFamily: Typography.fonts.medium,
      fontSize: Typography.fontSizes.xs,
      color: colors.textSecondary,
    },
  });
