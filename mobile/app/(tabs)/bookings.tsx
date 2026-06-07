import { FlashList } from '@shopify/flash-list';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingCard } from '@/components/booking/BookingCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { useBookings } from '@/hooks/useBookings';
import { Booking, BookingStatus } from '@/types';

const TABS: { key: BookingStatus; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const EMPTY_COPY: Record<BookingStatus, { title: string; message: string }> = {
  upcoming: { title: 'No upcoming trips', message: 'Book a ride and it will appear here.' },
  completed: { title: 'No completed trips', message: 'Your past journeys will show up here.' },
  cancelled: { title: 'No cancelled trips', message: 'Cancelled bookings will be listed here.' },
};

export default function BookingsScreen() {
  const [tab, setTab] = useState<BookingStatus>('upcoming');
  const { allBookings, cancelBooking } = useBookings();

  const filtered = useMemo(
    () => allBookings.filter((b) => b.status === tab),
    [allBookings, tab],
  );

  const handleViewTicket = (booking: Booking) => {
    Alert.alert(
      'Ticket',
      `Booking ${booking.id}\n${booking.route.from} → ${booking.route.to}\n${booking.date} at ${booking.departureTime}\nSeats: ${booking.seats.join(', ')}`,
    );
  };

  const handleCancel = (booking: Booking) => {
    Alert.alert('Cancel booking', `Cancel booking ${booking.id}?`, [
      { text: 'Keep', style: 'cancel' },
      { text: 'Cancel booking', style: 'destructive', onPress: () => cancelBooking(booking.id) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => {
          const active = tab === t.key;
          const count = allBookings.filter((b) => b.status === t.key).length;
          return (
            <Pressable
              key={t.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={`${t.label} bookings`}
              onPress={() => setTab(t.key)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t.label}
                {count > 0 ? ` (${count})` : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="ticket-outline"
          title={EMPTY_COPY[tab].title}
          message={EMPTY_COPY[tab].message}
        />
      ) : (
        <FlashList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onViewTicket={handleViewTicket}
              onCancel={handleCancel}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.base,
  },
  title: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xxl,
    color: Colors.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.border,
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: Spacing.base,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primary,
    fontFamily: Typography.fonts.semibold,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.section,
  },
});
