import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { format } from 'date-fns';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MiniBookingCard } from '@/components/home/MiniBookingCard';
import { QuickAction, QuickActionChip } from '@/components/home/QuickActionChip';
import { RouteCard } from '@/components/home/RouteCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button, Input } from '@/components/ui';
import { MOCK_ROUTES } from '@/constants/mock-data';
import { Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { getGreeting } from '@/hooks/useGreeting';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { ThemeColors, useTheme, useThemedStyles } from '@/theme/ThemeContext';
import { RouteItem } from '@/types';

export { ErrorBoundary } from '@/components/shared/RouteError';

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'bus', emoji: '🚌', label: 'Bus' },
  { id: 'train', emoji: '🚂', label: 'Train' },
  { id: 'minibus', emoji: '🚐', label: 'Minibus' },
  { id: 'car', emoji: '🚗', label: 'Car' },
  { id: 'women', emoji: '👩', label: 'Women Only' },
  { id: 'express', emoji: '⚡', label: 'Express' },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const greeting = useMemo(() => getGreeting(), []);
  const now = useMemo(() => new Date(), []);

  const [from, setFrom] = useState('Mirpur');
  const [to, setTo] = useState('Motijheel');
  const [activeAction, setActiveAction] = useState('bus');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const firstName = (user?.name ?? 'Traveller').split(' ')[0];
  const { bookings: upcoming } = useBookings('upcoming');

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const goToSearch = () => router.push('/(tabs)/search');
  const handleBookRoute = (route: RouteItem) => router.push(`/ride/${route.id}`);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>
              {greeting.bn}, {firstName}! {greeting.emoji}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Current location Dhaka"
              style={styles.locationPill}
            >
              <Ionicons name="location" size={14} color={colors.primary} />
              <Text style={styles.locationText}>Dhaka</Text>
              <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications, 2 unread"
            style={styles.bell}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </Pressable>
        </View>

        {/* Search card */}
        <View style={styles.searchCard}>
          <View style={styles.searchInputs}>
            <Input
              value={from}
              onChangeText={setFrom}
              placeholder="From"
              containerStyle={styles.searchField}
              leftIcon={<Ionicons name="radio-button-on" size={18} color={colors.primary} />}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Swap locations"
              onPress={handleSwap}
              style={styles.swapBtn}
            >
              <Ionicons name="swap-vertical" size={18} color={colors.white} />
            </Pressable>
            <Input
              value={to}
              onChangeText={setTo}
              placeholder="To"
              containerStyle={styles.searchField}
              leftIcon={<Ionicons name="location" size={18} color={colors.accent} />}
            />
          </View>

          <View style={styles.dateTimeRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Select date"
              style={styles.dateTimePill}
            >
              <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.dateTimeText}>{format(now, 'EEE, dd MMM')}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Select time"
              style={styles.dateTimePill}
            >
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.dateTimeText}>{format(now, 'hh:mm a')}</Text>
            </Pressable>
          </View>

          <Button title="Search Rides" size="lg" onPress={goToSearch} style={styles.searchBtn} />
        </View>

        {/* Quick actions */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {QUICK_ACTIONS.map((action) => (
            <QuickActionChip
              key={action.id}
              action={action}
              active={activeAction === action.id}
              onPress={(a) => setActiveAction(a.id)}
            />
          ))}
        </ScrollView>

        {/* Popular routes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Routes</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="See all routes" onPress={goToSearch}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>
        <View style={styles.routesList}>
          <FlashList
            data={MOCK_ROUTES}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <RouteCard route={item} index={index} onBook={handleBookRoute} />
            )}
            ItemSeparatorComponent={() => <View style={styles.hGap} />}
            contentContainerStyle={styles.routesContent}
          />
        </View>

        {/* Upcoming bookings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Trips</Text>
          {upcoming.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="See all bookings"
              onPress={() => router.push('/(tabs)/bookings')}
            >
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          ) : null}
        </View>

        {upcoming.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bookingsRow}
          >
            {upcoming.map((booking) => (
              <MiniBookingCard
                key={booking.id}
                booking={booking}
                onPress={() => router.push('/(tabs)/bookings')}
              />
            ))}
          </ScrollView>
        ) : (
          <EmptyState
            compact
            icon="bus-outline"
            title="No upcoming trips"
            message="Search and book a ride to see it here."
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: Spacing.section,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.base,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontFamily: Typography.fonts.bengaliBold,
    fontSize: Typography.fontSizes.lg,
    color: colors.textPrimary,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  bell: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...Shadows.card,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.white,
    fontFamily: Typography.fonts.bold,
    fontSize: 10,
  },
  searchCard: {
    marginHorizontal: Spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: Spacing.base,
    ...Shadows.card,
  },
  searchInputs: {
    position: 'relative',
    gap: Spacing.md,
  },
  searchField: {
    flex: 0,
  },
  swapBtn: {
    position: 'absolute',
    right: Spacing.base,
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...Shadows.float,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.base,
  },
  dateTimePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateTimeText: {
    fontFamily: Typography.fonts.medium,
    fontSize: Typography.fontSizes.sm,
    color: colors.textSecondary,
  },
  searchBtn: {
    marginTop: Spacing.base,
  },
  chipsRow: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    fontFamily: Typography.fonts.bold,
    fontSize: Typography.fontSizes.lg,
    color: colors.textPrimary,
  },
  seeAll: {
    fontFamily: Typography.fonts.semibold,
    fontSize: Typography.fontSizes.sm,
    color: colors.primary,
  },
  routesList: {
    height: 244,
  },
  routesContent: {
    paddingHorizontal: Spacing.lg,
  },
  hGap: {
    width: Spacing.base,
  },
  bookingsRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.base,
  },
});
