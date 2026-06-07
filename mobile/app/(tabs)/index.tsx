import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DarkHeader } from '@/components/shared/DarkHeader';
import { Colors, formatTaka, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { MOCK_BOOKINGS } from '@/constants/mock-data';

const STATS = [
  { label: 'Total Rides', value: '45', icon: 'car', color: '#EEF2FF' },
  { label: 'Savings', value: formatTaka(3240), icon: 'wallet', color: '#ECFDF5' },
  { label: 'CO₂ Saved', value: '125.5kg', icon: 'leaf', color: '#F0FDF4' },
  { label: 'Active Plans', value: '2', icon: 'calendar', color: '#FDF4FF' },
];

export default function HomeScreen() {
  const upcoming = MOCK_BOOKINGS.filter((b) => b.status === 'ongoing' || b.status === 'upcoming');

  return (
    <View style={styles.root}>
      <DarkHeader>
        <View style={styles.headerRow}>
          <View style={styles.greetingPill}>
            <Text style={styles.greetingText}>GOOD EVENING</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Messages" onPress={() => router.push('/messages')} style={styles.iconBtn}>
              <Ionicons name="chatbubble-outline" size={20} color={Colors.white} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => router.push('/notifications')} style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color={Colors.white} />
            </Pressable>
          </View>
        </View>
        <Text style={styles.headline}>
          Where to <Text style={styles.headlineAccent}>today?</Text>
        </Text>
      </DarkHeader>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable accessibilityRole="button" accessibilityLabel="Search for rides" onPress={() => router.push('/(tabs)/search')} style={styles.searchBar}>
          <Ionicons name="location" size={20} color={Colors.primary} />
          <View style={styles.searchText}>
            <Text style={styles.searchOverline}>CURRENT LOCATION</Text>
            <Text style={styles.searchValue}>Shahbag, Dhaka</Text>
          </View>
          <LinearGradient colors={[...Gradients.ctaPrimary]} style={styles.findBtn}>
            <Text style={styles.findBtnText}>Find Ride</Text>
          </LinearGradient>
        </Pressable>

        <View style={styles.statsGrid}>
          {STATS.map((s) => (
            <View key={s.label} style={[styles.statCard, Shadows.card]}>
              <View style={[styles.statIcon, { backgroundColor: s.color }]}>
                <Ionicons name={s.icon as keyof typeof Ionicons.glyphMap} size={18} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        <LinearGradient colors={[Colors.primary, Colors.primaryDeep]} style={styles.premiumCard}>
          <View style={styles.premiumPill}>
            <Text style={styles.premiumPillText}>Monthly Premium</Text>
          </View>
          <Text style={styles.premiumTitle}>Office Route</Text>
          <Text style={styles.premiumRoute}>Shahbag → Motijheel</Text>
          <View style={styles.usageRow}>
            <View style={styles.usageLeft}>
              <Text style={styles.usageLabel}>USAGE</Text>
              <Text style={styles.usageValue}>8 / 20 RIDES</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: '40%' }]} />
              </View>
            </View>
            <View style={styles.ring}>
              <Text style={styles.ringText}>40%</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>On Schedule</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="View all schedules" onPress={() => router.push('/(tabs)/my-rides')}>
            <Text style={styles.viewAll}>VIEW ALL</Text>
          </Pressable>
        </View>

        {upcoming.map((b) => (
          <View key={b.id} style={[styles.rideCard, Shadows.card]}>
            <View style={styles.rideHeader}>
              <LinearGradient colors={[...Gradients.avatar]} style={styles.avatar}>
                <Text style={styles.avatarText}>K</Text>
              </LinearGradient>
              <View style={styles.rideInfo}>
                <Text style={styles.driverName}>{b.operator}</Text>
                <Text style={styles.carModel}>Toyota Corolla • ★ 4.9</Text>
              </View>
            </View>
            <View style={styles.routeRow}>
              <View style={styles.routeDot} />
              <Text style={styles.routeText}>{b.route.from}</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.textMuted} />
              <Text style={styles.routeText}>{b.route.to}</Text>
            </View>
            <View style={styles.rideFooter}>
              <Text style={styles.arriving}>Arriving in 2h 30m</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Track live" onPress={() => router.push('/ride/live-tracking')} style={styles.trackBtn}>
                <Text style={styles.trackText}>TRACK LIVE</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greetingPill: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  greetingText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.white, letterSpacing: 1 },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  headline: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.white, marginTop: Spacing.lg },
  headlineAccent: { color: Colors.indigo400 },
  scroll: { padding: Spacing.xl, paddingBottom: 100, gap: Spacing.base },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.full, padding: Spacing.md, gap: Spacing.md, ...Shadows.card },
  searchText: { flex: 1 },
  searchOverline: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  searchValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  findBtn: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, borderRadius: Radius.full },
  findBtnText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xs, color: Colors.white },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md },
  statCard: { width: '47%', backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.base },
  statIcon: { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  statValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  statLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 0.5, marginTop: 2 },
  premiumCard: { borderRadius: Radius.card, padding: Spacing.xl },
  premiumPill: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.full, marginBottom: Spacing.sm },
  premiumPillText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.white },
  premiumTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.white },
  premiumRoute: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: 'rgba(255,255,255,0.8)', marginBottom: Spacing.base },
  usageRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  usageLeft: { flex: 1 },
  usageLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: 'rgba(255,255,255,0.6)', letterSpacing: 1 },
  usageValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.white },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: Spacing.sm },
  progressFill: { height: 4, backgroundColor: Colors.white, borderRadius: 2 },
  ring: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
  ringText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.white },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md },
  sectionTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  viewAll: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.primary, letterSpacing: 1 },
  rideCard: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.base },
  rideHeader: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fonts.black, color: Colors.white },
  rideInfo: { flex: 1 },
  driverName: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  carModel: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.md },
  routeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  routeText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  rideFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  arriving: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.accentEmerald },
  trackBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, backgroundColor: Colors.surfaceIndigo, borderRadius: Radius.md },
  trackText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.primary, letterSpacing: 1 },
});
