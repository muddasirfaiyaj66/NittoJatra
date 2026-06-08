import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors, formatTaka, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { ROUTES } from '@/constants/routes';
import { DRIVER_SCHEDULES } from '@/constants/mock-data';
import { useAuth } from '@/hooks/useAuth';

const DRIVER_AVATAR = require('../../../assets/figma/avatar-driver.png');

export default function DriverDashboardScreen() {
  const { user } = useAuth();
  const firstName = (user?.name ?? 'Karim').split(' ')[0];
  const balance = user?.driverBalance ?? 15240;
  const activeRiders = user?.activeRiders ?? 18;
  const rating = user?.rating ?? 4.9;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[Colors.darkDeep, Colors.darkDeep]} style={styles.header}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerOrbIndigo} />
            <View style={styles.headerOrbEmerald} />

            <View style={styles.headerRow}>
              <View style={styles.profileCol}>
                <View style={styles.avatarWrap}>
                  <LinearGradient colors={[...Gradients.appIcon]} style={styles.avatarGradient}>
                    <Image source={DRIVER_AVATAR} style={styles.avatarImage} contentFit="cover" />
                  </LinearGradient>
                  <View style={styles.onlineDot} />
                </View>
                <View style={styles.headerText}>
                  <View style={styles.captainRow}>
                    <View style={styles.captainBadge}>
                      <Text style={styles.captainLabel}>CAPTAIN</Text>
                    </View>
                    <Ionicons name="star" size={10} color={Colors.gold} />
                    <Text style={styles.ratingInline}>{rating.toFixed(1)}</Text>
                  </View>
                  <Text style={styles.hello}>Hello, {firstName}</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                <Pressable accessibilityRole="button" accessibilityLabel="Messages" onPress={() => router.push('/(driver)/messages')} style={styles.iconBtn}>
                  <Ionicons name="chatbubble-outline" size={20} color={Colors.white} />
                  <View style={styles.notifDotGreen} />
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => router.push('/(driver)/notifications')} style={styles.iconBtn}>
                  <Ionicons name="notifications-outline" size={20} color={Colors.white} />
                  <View style={styles.notifDotRed} />
                </Pressable>
              </View>
            </View>

            <LinearGradient colors={['#4F46E5', '#7E22CE']} style={styles.balanceCard}>
              <View style={styles.balanceOrb} />
              <View style={styles.balanceTop}>
                <View>
                  <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
                  <Text style={styles.balanceValue}>{formatTaka(balance)}</Text>
                </View>
                <View style={styles.walletIcon}>
                  <Ionicons name="wallet" size={20} color={Colors.white} />
                </View>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="View earnings" onPress={() => router.push('/(driver)/(tabs)/earnings')} style={styles.growthBar}>
                <View style={styles.growthIconWrap}>
                  <Ionicons name="trending-up" size={16} color={Colors.accentEmerald} />
                </View>
                <View style={styles.growthTextCol}>
                  <Text style={styles.growthSub}>This Month</Text>
                  <Text style={styles.growthMain}>+12% Growth</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.white} />
              </Pressable>
            </LinearGradient>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, Shadows.card]}>
              <View style={styles.statIconWrap}>
                <Ionicons name="people" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{activeRiders}</Text>
              <Text style={styles.statLabel}>ACTIVE RIDER</Text>
            </View>
            <View style={[styles.statCard, Shadows.card]}>
              <View style={styles.statIconWrap}>
                <Ionicons name="star" size={20} color={Colors.gold} />
              </View>
              <Text style={styles.statValue}>{rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>RATING</Text>
            </View>
          </View>

          <Pressable accessibilityRole="button" accessibilityLabel="Post new route" onPress={() => router.push(ROUTES.driverPostRoute)} style={[styles.postCard, Shadows.card]}>
            <View style={styles.postLeft}>
              <View style={styles.postIcon}>
                <Ionicons name="add" size={24} color={Colors.white} />
              </View>
              <View>
                <Text style={styles.postTitle}>Post New Route</Text>
                <Text style={styles.postSub}>CREATE SCHEDULE</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
          </Pressable>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Commitments</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="View all routes" onPress={() => router.push('/(driver)/(tabs)/schedule')}>
              <Text style={styles.viewAll}>VIEW ALL</Text>
            </Pressable>
          </View>

          {DRIVER_SCHEDULES.map((s) => (
            <Pressable
              key={s.id}
              accessibilityRole="button"
              accessibilityLabel={s.name}
              onPress={() => router.push('/(driver)/modals/management-console')}
              style={[styles.scheduleCard, Shadows.card]}
            >
              <View style={styles.scheduleTop}>
                <View>
                  <View style={styles.scheduleBadge}>
                    <Text style={styles.scheduleBadgeText}>SCHEDULE</Text>
                  </View>
                  <Text style={styles.scheduleName}>{s.name}</Text>
                </View>
                <View style={styles.scheduleTimeCol}>
                  <Text style={styles.scheduleTime}>{s.time}</Text>
                  <Text style={styles.scheduleDays}>{s.days}</Text>
                </View>
              </View>
              <View style={styles.routeDetail}>
                <View>
                  <Text style={styles.routePoint}>{s.origin}</Text>
                  <Text style={styles.routeMeta}>Origin</Text>
                </View>
                <Ionicons name="arrow-forward" size={14} color={Colors.textMuted} />
                <View style={styles.routeEnd}>
                  <Text style={styles.routePoint}>{s.destination}</Text>
                  <Text style={styles.routeMeta}>Destination</Text>
                </View>
              </View>
              <View style={styles.scheduleFooter}>
                <View style={styles.seatsRow}>
                  {s.riders.map((r, i) => (
                    <View key={i} style={styles.seatAvatar}>
                      <Text style={styles.seatText}>{r}</Text>
                    </View>
                  ))}
                  <View style={styles.seatPlus}>
                    <Text style={styles.seatPlusText}>+</Text>
                  </View>
                </View>
                <Text style={styles.seatsFilled}>
                  {s.seatsFilled}/{s.totalSeats} SEATS FILLED
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 48,
    paddingBottom: 64,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    ...Shadows.glass,
  },
  headerOrbIndigo: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(79,70,229,0.2)',
    opacity: 0.6,
  },
  headerOrbEmerald: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(5,150,105,0.1)',
    opacity: 0.6,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.sm, marginBottom: 40 },
  profileCol: { flexDirection: 'row', alignItems: 'center', gap: Spacing.base, flex: 1 },
  avatarWrap: { position: 'relative' },
  avatarGradient: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: { width: 48, height: 48, borderRadius: 24 },
  onlineDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accentEmerald,
    borderWidth: 2,
    borderColor: Colors.darkDeep,
  },
  headerText: { flex: 1 },
  captainRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  captainBadge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  captainLabel: { fontFamily: Typography.fonts.medium, fontSize: 10, color: Colors.white, letterSpacing: Typography.letterSpacing.stat },
  ratingInline: { fontFamily: Typography.fonts.bold, fontSize: 10, color: Colors.gold },
  hello: { fontFamily: Typography.fonts.black, fontSize: 20, color: Colors.white, letterSpacing: -0.5, lineHeight: 28 },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
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
  balanceCard: {
    borderRadius: Radius.card,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 8,
  },
  balanceOrb: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.xl },
  balanceLabel: { fontFamily: Typography.fonts.black, fontSize: 10, color: '#C7D2FE', letterSpacing: 1, textTransform: 'uppercase' },
  balanceValue: { fontFamily: Typography.fonts.black, fontSize: 30, color: Colors.white, letterSpacing: -0.75, lineHeight: 36, marginTop: 4 },
  walletIcon: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  growthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: Radius.md,
    padding: 17,
  },
  growthIconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: 'rgba(16,185,129,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  growthTextCol: { flex: 1 },
  growthSub: { fontFamily: Typography.fonts.bold, fontSize: 10, color: '#C7D2FE', letterSpacing: Typography.letterSpacing.stat },
  growthMain: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.white, letterSpacing: Typography.letterSpacing.stat },
  body: { paddingHorizontal: Spacing.xl, paddingTop: 32, gap: 32 },
  statsRow: { flexDirection: 'row', gap: Spacing.md },
  statCard: {
    flex: 1,
    minHeight: 128,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 21,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'space-between',
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary, letterSpacing: Typography.letterSpacing.heading, lineHeight: 32 },
  statLabel: { fontFamily: Typography.fonts.bold, fontSize: 10, color: Colors.textMuted, letterSpacing: 1, textTransform: 'uppercase' },
  postCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    padding: 5,
    paddingRight: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.white,
    ...Shadows.card,
  },
  postLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.base, paddingVertical: Spacing.md, paddingLeft: Spacing.base },
  postIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.darkDeep,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.float,
  },
  postTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, letterSpacing: -0.4 },
  postSub: { fontFamily: Typography.fonts.bold, fontSize: 10, color: Colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: Spacing.sm },
  sectionTitle: { fontFamily: Typography.fonts.black, fontSize: 18, color: Colors.textPrimary, letterSpacing: -0.45, lineHeight: 28 },
  viewAll: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary, letterSpacing: 0.6, textTransform: 'uppercase' },
  scheduleCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: 21, borderWidth: 1, borderColor: Colors.border, gap: 16, marginBottom: 0 },
  scheduleTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  scheduleBadge: { alignSelf: 'flex-start', backgroundColor: '#ECFDF5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full, marginBottom: Spacing.sm },
  scheduleBadgeText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: '#047857', letterSpacing: 0.6, textTransform: 'uppercase' },
  scheduleName: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, letterSpacing: -0.4 },
  scheduleTimeCol: { alignItems: 'flex-end' },
  scheduleTime: { fontFamily: Typography.fonts.black, fontSize: 18, color: Colors.textPrimary, letterSpacing: Typography.letterSpacing.stat },
  scheduleDays: { fontFamily: Typography.fonts.bold, fontSize: 9, color: Colors.textMuted, letterSpacing: 0.9, textTransform: 'uppercase' },
  routeDetail: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  routeEnd: { alignItems: 'flex-end' },
  routePoint: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  routeMeta: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
  scheduleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seatsRow: { flexDirection: 'row' },
  seatAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -6,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  seatText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textSecondary },
  seatPlus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceIndigo,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  seatPlusText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  seatsFilled: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' },
});
