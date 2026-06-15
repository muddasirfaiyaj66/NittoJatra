import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { StatusDot } from '@/components/ui';
import { Colors, formatTaka, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useBookingStore } from '@/store/booking.store';

function formatHistoryDate(dateStr: string) {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function driverInitial(name: string) {
  return name.trim().charAt(0).toUpperCase();
}

export default function MyRidesScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState(0);
  const bookings = useBookingStore((s) => s.bookings);
  const isLoading = useBookingStore((s) => s.isLoading);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const upcoming = bookings.filter((b) => b.status === 'upcoming' || b.status === 'ongoing');
  const history = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
  const activeBooking = upcoming[0];

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  const headerContent = (
    <>
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>My Journey</Text>
          <Text style={styles.overline}>HISTORY & SCHEDULES</Text>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Calendar" style={styles.calBtn}>
          <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
        </Pressable>
      </View>
      <SegmentedControl options={['Active Plans', 'History']} selected={tab} onChange={setTab} />
    </>
  );

  return (
    <View style={styles.root}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={40} tint="light" style={[styles.header, { paddingTop: insets.top + 16 }]}>
          {headerContent}
        </BlurView>
      ) : (
        <View style={[styles.header, styles.headerAndroid, { paddingTop: insets.top + 16 }]}>
          {headerContent}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === 0 ? (
          activeBooking ? (
            <View style={[styles.planCard, Shadows.card]}>
              <View style={styles.planHeader}>
                <View style={styles.activeRow}>
                  <StatusDot />
                  <Text style={styles.activeLabel}>UPCOMING RIDE</Text>
                </View>
                <LinearGradient colors={[...Gradients.successBadge]} style={styles.ongoingBadge}>
                  <Text style={styles.ongoingText}>BOOKED</Text>
                </LinearGradient>
              </View>
              <Text style={styles.routeName}>{activeBooking.route.from} → {activeBooking.route.to}</Text>
              <Text style={styles.schedule}>{formatHistoryDate(activeBooking.date)} • {activeBooking.departureTime}</Text>
              <View style={styles.footerRow}>
                <View style={styles.footerItem}>
                  <Text style={styles.footerLabel}>Operator</Text>
                  <Text style={styles.footerValue}>{activeBooking.operator.toUpperCase()}</Text>
                </View>
                <View style={styles.footerItem}>
                  <Text style={styles.footerLabel}>SEATS</Text>
                  <Text style={[styles.footerValue, { color: Colors.primary }]}>{activeBooking.seatCount}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.planCard, Shadows.card]}>
              <View style={styles.planHeader}>
                <View style={styles.activeRow}>
                  <StatusDot />
                  <Text style={styles.activeLabel}>NO ACTIVE PLAN</Text>
                </View>
              </View>
              <Text style={styles.routeName}>Search and book your next ride</Text>
              <Text style={styles.schedule}>Upcoming bookings will appear here after payment.</Text>
            </View>
          )
        ) : isLoading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.xl }} />
        ) : history.length === 0 ? (
          <Text style={styles.emptyText}>No ride history yet.</Text>
        ) : (
          history.map((b) => {
            const driverName = b.driver ?? b.operator;
            const completed = b.status === 'completed';
            return (
              <Pressable
                key={b.id}
                accessibilityRole="button"
                accessibilityLabel={`${b.route.from} to ${b.route.to}`}
                style={[styles.historyCard, Shadows.card]}
              >
                <View style={styles.historyTop}>
                  <View style={styles.carIconBox}>
                    <Ionicons name="car" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.historyMain}>
                    <View style={styles.historyHeader}>
                      <Text style={styles.historyRoute}>
                        {b.route.from} → {b.route.to}
                      </Text>
                      <View style={[styles.statusBadge, !completed && styles.statusCancelled]}>
                        <Text style={[styles.statusText, !completed && styles.statusTextCancelled]}>
                          {completed ? 'Completed' : 'Canceled'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.historyDate}>{formatHistoryDate(b.date)}</Text>
                  </View>
                </View>
                <View style={styles.historyDivider} />
                <View style={styles.historyFooter}>
                  <LinearGradient colors={[...Gradients.avatar]} style={styles.driverAvatar}>
                    <Text style={styles.driverInitial}>{driverInitial(driverName)}</Text>
                  </LinearGradient>
                  <Text style={styles.historyOperator}>{driverName}</Text>
                  <Text style={styles.historyAmount}>{formatTaka(b.amount)}</Text>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(243,244,246,0.8)',
    overflow: 'hidden',
  },
  headerAndroid: { backgroundColor: 'rgba(255,255,255,0.95)' },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.base,
  },
  titleBlock: { gap: 4 },
  title: {
    fontFamily: Typography.fonts.black,
    fontSize: 24,
    color: Colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  overline: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: 1.2,
    lineHeight: 16,
  },
  calBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { padding: Spacing.xl, paddingBottom: 100, gap: Spacing.base },
  planCard: { backgroundColor: Colors.surface, borderRadius: 32, padding: Spacing.xl },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  activeLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.accentEmerald,
    letterSpacing: 1,
  },
  ongoingBadge: { paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.full },
  ongoingText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.white,
    letterSpacing: 1,
  },
  routeName: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  schedule: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.base,
  },
  progressCard: {
    backgroundColor: Colors.surfaceMuted,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.base,
  },
  progressLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  progressValue: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    marginVertical: Spacing.xs,
  },
  progressTrack: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  footerItem: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  miniAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  miniAvatarText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.white },
  footerLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.xs,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  footerValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xs, color: Colors.textPrimary },
  trackerLink: { marginTop: Spacing.base, alignItems: 'center' },
  trackerText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  historyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
  },
  historyTop: { flexDirection: 'row', gap: 12 },
  carIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyMain: { flex: 1, gap: 4 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  historyRoute: {
    flex: 1,
    fontFamily: Typography.fonts.bold,
    fontSize: 15,
    color: '#111827',
    letterSpacing: -0.375,
    lineHeight: 22.5,
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  statusCancelled: { backgroundColor: '#FEF2F2' },
  statusText: {
    fontFamily: Typography.fonts.bold,
    fontSize: 10,
    color: Colors.accentEmerald,
    letterSpacing: 0.5,
    lineHeight: 15,
  },
  statusTextCancelled: { color: '#DC2626' },
  historyDate: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: '#6B7280',
    letterSpacing: -0.3,
    lineHeight: 16,
  },
  historyDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 12 },
  historyFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  driverAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInitial: { fontFamily: Typography.fonts.bold, fontSize: 13, color: Colors.white },
  historyOperator: {
    flex: 1,
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: '#374151',
    letterSpacing: -0.3,
  },
  historyAmount: {
    fontFamily: Typography.fonts.black,
    fontSize: 15,
    color: '#111827',
    letterSpacing: -0.375,
  },
  emptyText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
