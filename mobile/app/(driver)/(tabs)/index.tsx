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
            <StatusDot size={10} style={styles.presence} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.captainLabel}>CAPTAIN ★{user?.rating ?? 4.9}</Text>
            <Text style={styles.hello}>Hello, {(user?.name ?? 'Karim').split(' ')[0]}</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Messages" onPress={() => router.push('/(driver)/messages')} style={styles.iconBtn}>
              <Ionicons name="chatbubble-outline" size={20} color={Colors.white} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Notifications" onPress={() => router.push('/(driver)/notifications')} style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={20} color={Colors.white} />
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <LinearGradient colors={[Colors.primary, Colors.primaryDeep]} style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
        <Text style={styles.balanceValue}>{formatTaka(DRIVER_BALANCE)}</Text>
        <View style={styles.growthPill}>
          <Text style={styles.growthText}>This Month +12% Growth →</Text>
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, Shadows.card]}>
          <Text style={styles.statValue}>18</Text>
          <Text style={styles.statLabel}>Active Rider</Text>
        </View>
        <View style={[styles.statCard, Shadows.card]}>
          <Text style={styles.statValue}>★ 4.9</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel="Post new route" onPress={() => router.push(ROUTES.driverPostRoute)} style={[styles.postCard, Shadows.card]}>
        <View style={styles.postIcon}>
          <Ionicons name="add" size={28} color={Colors.white} />
        </View>
        <View>
          <Text style={styles.postTitle}>Post New Route</Text>
          <Text style={styles.postSub}>CREATE SCHEDULE</Text>
        </View>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Active Commitments</Text>
        <Text style={styles.viewAll}>VIEW ALL</Text>
      </View>

      {DRIVER_SCHEDULES.map((s) => (
        <Pressable key={s.id} accessibilityRole="button" accessibilityLabel={s.name} onPress={() => router.push('/(driver)/modals/management-console')} style={[styles.scheduleCard, Shadows.card]}>
          <View style={styles.scheduleBadge}>
            <Text style={styles.scheduleBadgeText}>SCHEDULE</Text>
          </View>
          <Text style={styles.scheduleName}>{s.name}</Text>
          <Text style={styles.scheduleTime}>{s.time} • {s.days}</Text>
          <Text style={styles.scheduleRoute}>{s.origin} → {s.destination}</Text>
          <View style={styles.seatsRow}>
            {s.riders.map((r, i) => (
              <View key={i} style={styles.seatAvatar}><Text style={styles.seatText}>{r}</Text></View>
            ))}
            <View style={styles.seatPlus}><Text style={styles.seatPlusText}>+</Text></View>
          </View>
          <Text style={styles.seatsFilled}>{s.seatsFilled}/{s.totalSeats} SEATS FILLED</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  header: { paddingTop: 60, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatarWrap: { position: 'relative' },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: Typography.fonts.black, color: Colors.white, fontSize: Typography.fontSizes.lg },
  presence: { position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: Colors.darkBgNavy },
  headerText: { flex: 1 },
  captainLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  hello: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.white },
  headerActions: { flexDirection: 'row', gap: Spacing.sm },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  balanceCard: { marginHorizontal: Spacing.xl, marginTop: -Spacing.lg, borderRadius: Radius.card, padding: Spacing.xl },
  balanceLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  balanceValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xxl, color: Colors.white },
  growthPill: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.full, marginTop: Spacing.sm },
  growthText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.white },
  statsRow: { flexDirection: 'row', gap: Spacing.md, paddingHorizontal: Spacing.xl, marginTop: Spacing.base },
  statCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, alignItems: 'center' },
  statValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary },
  statLabel: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  postCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing.base, backgroundColor: Colors.darkBgNavy, marginHorizontal: Spacing.xl, marginTop: Spacing.base, borderRadius: Radius.card, padding: Spacing.base },
  postIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  postTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.white },
  postSub: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, marginTop: Spacing.xl, marginBottom: Spacing.md },
  sectionTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  viewAll: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.primary },
  scheduleCard: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.base, marginHorizontal: Spacing.xl, marginBottom: Spacing.sm },
  scheduleBadge: { alignSelf: 'flex-start', backgroundColor: '#ECFDF5', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full, marginBottom: Spacing.sm },
  scheduleBadgeText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.accentEmerald },
  scheduleName: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  scheduleTime: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  scheduleRoute: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textMuted, marginVertical: Spacing.sm },
  seatsRow: { flexDirection: 'row', gap: Spacing.xs },
  seatAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  seatText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.primary },
  seatPlus: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: Colors.borderMid, alignItems: 'center', justifyContent: 'center' },
  seatPlusText: { color: Colors.textMuted },
  seatsFilled: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 0.5, marginTop: Spacing.sm },
});
