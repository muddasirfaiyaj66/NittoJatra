import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RiderScheduleCard } from '@/components/home/RiderScheduleCard';
import { GradientText } from '@/components/ui';
import { Colors, formatTaka, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { getGreeting } from '@/hooks/useGreeting';
import { mapBookingToUpcomingRide } from '@/services/mappers';
import { useBookingStore } from '@/store/booking.store';

export default function RiderHomeScreen() {
  const { user } = useAuth();
  const bookings = useBookingStore((s) => s.bookings);
  const isLoading = useBookingStore((s) => s.isLoading);
  const greeting = getGreeting();
  const firstName = (user?.name ?? 'Rider').split(' ')[0];

  const upcoming = useMemo(
    () => bookings.filter((b) => b.status === 'upcoming' || b.status === 'ongoing'),
    [bookings],
  );
  const upcomingRides = useMemo(() => upcoming.map(mapBookingToUpcomingRide), [upcoming]);
  const activePlan = upcoming[0];
  const planProgress = activePlan
    ? Math.min(100, Math.round(((user?.totalTrips ?? 0) % 20) / 20 * 100) || 15)
    : 0;

  const stats = [
    { label: 'TOTAL RIDES', value: String(user?.totalTrips ?? 0), icon: 'car', color: '#EEF2FF', iconColor: Colors.primary },
    { label: 'SAVINGS', value: formatTaka(user?.totalSpent ?? 0), icon: 'wallet', color: '#ECFDF5', iconColor: Colors.accentEmerald },
    { label: 'REDEMPTION COINS', value: String(user?.points ?? 0), icon: 'sparkles', color: '#FEF3C7', iconColor: '#D97706' },
    { label: 'MONTHLY ROUTINGS', value: String(user?.activePlans ?? 2), icon: 'git-route', color: '#FDF2F8', iconColor: Colors.accent },
  ];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerOrbIndigo} />
          <View style={styles.headerOrbPurple} />
          <SafeAreaView edges={['top']}>
            <View style={styles.headerInner}>
              <View style={styles.headerTop}>
                <View style={styles.headerLeft}>
                  <View style={styles.greetingPill}>
                    <Text style={styles.greetingEmoji}>{greeting.emoji}</Text>
                    <Text style={styles.greetingText}>{greeting.en.toUpperCase()}, {firstName.toUpperCase()}</Text>
                  </View>
                  <View style={styles.headlineBlock}>
                    <Text style={styles.headline}>Where to</Text>
                    <GradientText style={styles.headlineAccent} colors={Gradients.headlineAccent}>
                      today?
                    </GradientText>
                  </View>
                </View>
                <View style={styles.headerActions}>
                  <Pressable accessibilityRole="button" accessibilityLabel="Messages" onPress={() => router.push('/messages')} style={styles.iconBtn}>
                    <Ionicons name="chatbubble-outline" size={20} color={Colors.white} />
                    <View style={styles.notifDotGreen} />
                  </Pressable>
                  <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => router.push('/notifications')} style={styles.iconBtn}>
                    <Ionicons name="notifications-outline" size={20} color={Colors.white} />
                    {upcoming.length > 0 && <View style={styles.notifDotRed} />}
                  </Pressable>
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Search for rides"
                onPress={() => router.push('/rider/(tabs)/search')}
                style={[styles.searchBar, Shadows.glass]}
              >
                <View style={styles.searchIconWrap}>
                  <Ionicons name="search" size={20} color={Colors.white} />
                </View>
                <View style={styles.searchText}>
                  <Text style={styles.searchOverline}>CURRENT LOCATION</Text>
                  <Text style={styles.searchValue}>{user?.savedLocation ?? 'Dhaka, Bangladesh'}</Text>
                </View>
                <View style={styles.findBtn}>
                  <Text style={styles.findBtnText}>Find Ride</Text>
                </View>
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.body}>
          <View style={styles.statsGrid}>
            {stats.map((s) => (
              <View key={s.label} style={[styles.statCard, Shadows.card]}>
                <View style={[styles.statIcon, { backgroundColor: s.color }]}>
                  <Ionicons name={s.icon as keyof typeof Ionicons.glyphMap} size={20} color={s.iconColor} />
                </View>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          {activePlan ? (
            <View style={styles.premiumCard}>
              <View style={styles.premiumOrbRight} />
              <View style={styles.premiumOrbLeft} />
              <View style={styles.premiumTop}>
                <View style={styles.premiumCopy}>
                  <View style={styles.premiumPill}>
                    <Text style={styles.premiumPillText}>Upcoming Ride</Text>
                  </View>
                  <Text style={styles.premiumTitle}>{activePlan.operator}</Text>
                  <Text style={styles.premiumRoute}>
                    {activePlan.route.from} <Text style={styles.premiumArrow}>→</Text> {activePlan.route.to}
                  </Text>
                </View>
              </View>
              <View style={styles.usageBlock}>
                <View style={styles.usageLabels}>
                  <Text style={styles.usageLabel}>DEPARTURE</Text>
                  <Text style={styles.usageValue}>{activePlan.departureTime}</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${planProgress}%` }]} />
                </View>
              </View>
            </View>
          ) : null}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>On Schedule</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="View all schedules" onPress={() => router.push('/rider/(tabs)/my-rides')}>
              <Text style={styles.viewAll}>VIEW ALL</Text>
            </Pressable>
          </View>

          <View style={styles.scheduleList}>
            {isLoading && upcomingRides.length === 0 ? (
              <ActivityIndicator color={Colors.primary} />
            ) : upcomingRides.length === 0 ? (
              <Text style={styles.emptySchedule}>Book a ride to see your upcoming schedule here.</Text>
            ) : (
              upcomingRides.slice(0, 3).map((ride) => (
                <RiderScheduleCard
                  key={ride.id}
                  ride={ride}
                  onTrackLive={() =>
                    router.push({ pathname: '/ride/live-tracking', params: { bookingId: ride.id } })
                  }
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  header: {
    backgroundColor: Colors.darkDeep,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 128,
    paddingTop: 48,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    overflow: 'hidden',
    shadowColor: '#E2E8F0',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 8,
  },
  headerOrbIndigo: {
    position: 'absolute',
    top: -128,
    right: -128,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(79,70,229,0.3)',
  },
  headerOrbPurple: {
    position: 'absolute',
    bottom: -80,
    left: -128,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(147,51,234,0.2)',
  },
  headerInner: { gap: 40 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft: { flex: 1, gap: 11 },
  greetingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 13,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  greetingEmoji: { fontSize: 10 },
  greetingText: {
    fontFamily: Typography.fonts.bold,
    fontSize: 10,
    color: '#C7D2FE',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headlineBlock: { gap: 0 },
  headline: {
    fontFamily: Typography.fonts.black,
    fontSize: 36,
    color: Colors.white,
    letterSpacing: -0.9,
    lineHeight: 40,
  },
  headlineAccent: {
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -0.9,
  },
  headerActions: { flexDirection: 'row', gap: 12 },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glass,
  },
  notifDotGreen: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentEmerald,
    borderWidth: 2,
    borderColor: Colors.darkDeep,
  },
  notifDotRed: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
    borderWidth: 2,
    borderColor: Colors.darkDeep,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 8,
    gap: 16,
  },
  searchIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.darkDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchText: { flex: 1 },
  searchOverline: {
    fontFamily: Typography.fonts.bold,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    lineHeight: 15,
  },
  searchValue: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    lineHeight: 24,
  },
  findBtn: {
    backgroundColor: Colors.surfaceMuted,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  findBtnText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textFaint,
    letterSpacing: Typography.letterSpacing.stat,
  },
  body: { paddingHorizontal: Spacing.xl, paddingTop: 32, gap: 32 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  statCard: {
    width: '47%',
    minHeight: 128,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 17,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-between',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontFamily: Typography.fonts.black,
    fontSize: Typography.fontSizes.xl,
    color: Colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 32,
  },
  statLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  premiumCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    overflow: 'hidden',
    shadowColor: '#C7D2FE',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 8,
    gap: 24,
  },
  premiumOrbRight: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  premiumOrbLeft: {
    position: 'absolute',
    bottom: -40,
    left: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  premiumTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  premiumCopy: { flex: 1, gap: 4 },
  premiumPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginBottom: 4,
  },
  premiumPillText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.white,
    letterSpacing: Typography.letterSpacing.stat,
  },
  premiumTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: 20,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  premiumRoute: {
    fontFamily: Typography.fonts.regular,
    fontSize: Typography.fontSizes.base,
    color: '#C7D2FE',
    letterSpacing: Typography.letterSpacing.stat,
    lineHeight: 20,
  },
  premiumArrow: { color: '#C7D2FE' },
  ringWrap: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.lg,
    padding: 8,
  },
  ring: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringText: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.base,
    color: Colors.white,
    letterSpacing: Typography.letterSpacing.stat,
  },
  usageBlock: { gap: 8 },
  usageLabels: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  usageLabel: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.sm,
    color: '#C7D2FE',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  usageValue: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.sm,
    color: Colors.white,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: { height: 8, backgroundColor: Colors.white, borderRadius: Radius.full },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.sm,
  },
  sectionTitle: {
    fontFamily: Typography.fonts.black,
    fontSize: 20,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  viewAll: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.sm,
    color: Colors.primary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  scheduleList: { gap: 16 },
  emptySchedule: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: Spacing.lg,
  },
});
