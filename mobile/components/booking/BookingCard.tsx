import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Badge, statusToBadge } from '@/components/ui';
import { Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';
import { Booking } from '@/types';

interface BookingCardProps {
  booking: Booking;
  onViewTicket: (booking: Booking) => void;
  onCancel: (booking: Booking) => void;
}

const STATUS_LABEL: Record<Booking['status'], string> = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export function BookingCard({ booking, onViewTicket, onCancel }: BookingCardProps) {
  const styles = useThemedStyles(makeStyles);
  const isUpcoming = booking.status === 'upcoming';

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.bookingId}>{booking.id}</Text>
        <Badge label={STATUS_LABEL[booking.status]} variant={statusToBadge(booking.status)} small />
      </View>

      <View style={styles.routeRow}>
        <Text style={styles.city}>{booking.route.from}</Text>
        <ArrowIcon />
        <Text style={styles.city}>{booking.route.to}</Text>
      </View>

      <View style={styles.metaGrid}>
        <Meta icon="calendar-outline" label={booking.date} />
        <Meta icon="time-outline" label={`${booking.departureTime} - ${booking.arrivalTime}`} />
        <Meta icon="ticket-outline" label={`${booking.seatCount} seat${booking.seatCount > 1 ? 's' : ''}`} />
        <Meta icon="business-outline" label={booking.operator} />
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.amountLabel}>Amount paid</Text>
          <Text style={styles.amount}>৳ {booking.amount}</Text>
        </View>
        <View style={styles.actions}>
          {isUpcoming ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Cancel booking ${booking.id}`}
              onPress={() => onCancel(booking)}
              style={[styles.actionBtn, styles.cancelBtn]}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View ticket ${booking.id}`}
            onPress={() => onViewTicket(booking)}
            style={[styles.actionBtn, styles.ticketBtn]}
          >
            <Text style={styles.ticketText}>View Ticket</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function ArrowIcon() {
  const { colors } = useTheme();
  return <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />;
}

function Meta({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={14} color={colors.textMuted} />
      <Text style={styles.metaText} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: Spacing.base,
      marginBottom: Spacing.base,
      ...Shadows.card,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    bookingId: {
      fontFamily: Typography.fonts.medium,
      fontSize: Typography.fontSizes.xs,
      color: colors.textMuted,
    },
    routeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginTop: Spacing.md,
    },
    city: {
      fontFamily: Typography.fonts.bold,
      fontSize: Typography.fontSizes.md,
      color: colors.textPrimary,
    },
    metaGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: Spacing.md,
    },
    metaItem: {
      width: '50%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 4,
    },
    metaText: {
      fontFamily: Typography.fonts.medium,
      fontSize: Typography.fontSizes.xs,
      color: colors.textSecondary,
      flex: 1,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.borderMid,
      marginVertical: Spacing.base,
    },
    bottomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    amountLabel: {
      fontFamily: Typography.fonts.regular,
      fontSize: Typography.fontSizes.xs,
      color: colors.textMuted,
    },
    amount: {
      fontFamily: Typography.fonts.extrabold,
      fontSize: Typography.fontSizes.lg,
      color: colors.textPrimary,
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    actionBtn: {
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.sm,
      borderRadius: Radius.md,
    },
    cancelBtn: {
      borderWidth: 1.5,
      borderColor: colors.danger,
    },
    cancelText: {
      fontFamily: Typography.fonts.semibold,
      fontSize: Typography.fontSizes.sm,
      color: colors.danger,
    },
    ticketBtn: {
      backgroundColor: colors.primary,
    },
    ticketText: {
      fontFamily: Typography.fonts.semibold,
      fontSize: Typography.fontSizes.sm,
      color: colors.white,
    },
  });
