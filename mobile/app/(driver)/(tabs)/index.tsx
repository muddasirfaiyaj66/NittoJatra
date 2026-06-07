import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusDot } from '@/components/ui';
import { Colors, formatTaka, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { ROUTES } from '@/constants/routes';
import { DRIVER_BALANCE, DRIVER_SCHEDULES } from '@/constants/mock-data';
import { useAuth } from '@/hooks/useAuth';

export default function DriverDashboardScreen() {
  const { user } = useAuth();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>
      <LinearGradient colors={[...Gradients.navyHeader]} style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.avatarWrap}>
            <LinearGradient colors={[...Gradients.avatar]} style={styles.avatar}>
              <Text style={styles.avatarText}>{(user?.name ?? 'K')[0]}</Text>
            </LinearGradient>
            <View style={styles.shield}>
              <Ionicons name="shield-checkmark" size={12} color={Colors.accentEmerald} />
            </View>
          </View>
          <View style={styles.headerText}>
            <View style={styles.captainRow}>
              <View style={styles.captainBadge}>
                <Text style={styles.captainLabel}>CAPTAIN</Text>
              </View>
              <Text style={styles.ratingInline}>★ {user?.rating ?? 4.9}</Text>
            </View>
            <Text style={styles.hello}>Hello, {(user?.name ?? 'Karim').split(' ')[0]}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Messages" onPress={() => router.push('/(driver)/messages')} style={styles.iconBtn}>
              <Ionicons name="chatbubble-outline" size={20} color={Colors.white} />
              <View style={styles.notifDot} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => router.push('/(driver)/notifications')} style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color={Colors.white} />
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <LinearGradient colors={[Colors.primaryGradStart, Colors.primaryDeep]} style={styles.balanceCard}>
        <View style={styles.balanceTop}>
          <View>
            <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
            <Text style={styles.balanceValue}>{formatTaka(DRIVER_BALANCE)}</Text>
          </View>
          <View style={styles.walletIcon}>
            <Ionicons name="wallet" size={20} color={Colors.white} />
          </View>
        </View>
        <View style={styles.growthBar}>
          <Ionicons name="trending-up" size={16} color={Colors.accentEmerald} />
          <Text style={styles.growthText}>This Month +12% Growth</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.white} />
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, Shadows.card]}>
          <View style={[styles.statIcon, { backgroundColor: Colors.surfaceIndigo }]}>
            <Ionicons name="people" size={18} color={Colors.primary} />
          </View>
          <Text style={styles.statValue}>18</Text>
          <Text style={styles.statLabel}>ACTIVE RIDER</Text>
        </View>
        <View style={[styles.statCard, Shadows.card]}>
          <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="star-outline" size={18} color={Colors.gold} />
          </View>
          <Text style={styles.statValue}>4.9</Text>
          <Text style={styles.statLabel}>RATING</Text>
        </View>
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="Post new route" onPress={() => router.push(ROUTES.driverPostRoute)} style={[styles.postCard, Shadows.card]}>
        <View style={styles.postIcon}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </View>
        <View style={styles.postText}>
          <Text style={styles.postTitle}>Post New Route</Text>
          <Text style={styles.postSub}>CREATE SCHEDULE</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Commitments</Text>
        <Text style={styles.viewAll}>VIEW ALL</Text>
      </View>

      {DRIVER_SCHEDULES.map((s) => (
        <Pressable key={s.id} accessibilityRole="button" accessibilityLabel={s.name} onPress={() => router.push('/(driver)/modals/management-console')} style={[styles.scheduleCard, Shadows.card]}>
          <View style={styles.scheduleTop}>
            <View style={styles.scheduleBadge}>
              <Text style={styles.scheduleBadgeText}>SCHEDULE</Text>
            </View>
            <View style={styles.scheduleTimeCol}>
              <Text style={styles.scheduleTime}>{s.time}</Text>
              <Text style={styles.scheduleDays}>{s.days}</Text>
            </View>
          </View>
          <Text style={styles.scheduleName}>{s.name}</Text>
          <View style={styles.routeDetail}>
            <View>
              <Text style={styles.routePoint}>{s.origin}</Text>
              <Text style={styles.routeMeta}>Origin</Text>
            </View>
            <Ionicons name="arrow-forward" size={14} color={Colors.textMuted} />
            <View>
              <Text style={styles.routePoint}>{s.destination}</Text>
              <Text style={styles.routeMeta}>Destination</Text>
            </View>
          </View>
          <View style={styles.scheduleFooter}>
            <View style={styles.seatsRow}>
              {s.riders.map((r, i) => (
                <View key={i} style={styles.seatAvatar}><Text style={styles.seatText}>{r}</Text></View>
              ))}
              <View style={styles.seatPlus}><Text style={styles.seatPlusText}>+</Text></View>
            </View>
            <Text style={styles.seatsFilled}>{s.seatsFilled}/{s.totalSeats} SEATS FILLED</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  header: { paddingTop: 60, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxxl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatarText: { fontFamily: Typography.fonts.black, color: Colors.white, fontSize: Typography.fontSizes.lg },
  shield: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 2,
  },
  headerText: { flex: 1 },
  captainRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 },
  captainBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full },
  captainLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  ratingInline: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.gold },
  hello: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.white, letterSpacing: Typography.letterSpacing.h2 },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentEmerald,
  },
  balanceCard: { marginHorizontal: Spacing.xl, marginTop: -Spacing.xl, borderRadius: Radius.card, padding: Spacing.xl },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  balanceLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase' },
  balanceValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xxl, color: Colors.white, marginTop: 4 },
  walletIcon: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  growthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginTop: Spacing.base,
  },
  growthText: { flex: 1, fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.white },
  statsRow: { flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.xl, marginTop: Spacing.base },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.border },
  statIcon: { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  statValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary },
  statLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 2 },
  postCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.base,
    borderRadius: Radius.card,
    padding: Spacing.base,
    gap: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  postIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.darkDeep, alignItems: 'center', justifyContent: 'center' },
  postText: { flex: 1 },
  postTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  postSub: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, marginTop: Spacing.xl, marginBottom: Spacing.md, alignItems: 'center' },
  sectionTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary, letterSpacing: Typography.letterSpacing.h2 },
  viewAll: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.primary, letterSpacing: 1, textTransform: 'uppercase' },
  scheduleCard: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.base, marginHorizontal: Spacing.xl, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  scheduleTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  scheduleBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  scheduleBadgeText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.accentEmerald, letterSpacing: 0.5, textTransform: 'uppercase' },
  scheduleTimeCol: { alignItems: 'flex-end' },
  scheduleTime: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  scheduleDays: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: Typography.letterSpacing.stat },
  scheduleName: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, marginBottom: Spacing.sm },
  routeDetail: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  routePoint: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  routeMeta: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
  scheduleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seatsRow: { flexDirection: 'row', gap: Spacing.xs },
  seatAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  seatText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textSecondary },
  seatPlus: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  seatPlusText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  seatsFilled: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' },
});
