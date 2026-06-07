import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { StatusDot } from '@/components/ui';
import { Colors, formatTaka, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { MOCK_ACTIVE_PLAN, MOCK_BOOKINGS } from '@/constants/mock-data';

export default function MyRidesScreen() {
  const [tab, setTab] = useState(0);
  const history = MOCK_BOOKINGS.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.overline}>HISTORY & SCHEDULES</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>My Journey</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Calendar" style={styles.calBtn}>
            <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
          </Pressable>
        </View>
        <SegmentedControl options={['Active Plans', 'History']} selected={tab} onChange={setTab} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {tab === 0 ? (
          <View style={[styles.planCard, Shadows.card]}>
            <View style={styles.planHeader}>
              <View style={styles.activeRow}>
                <StatusDot />
                <Text style={styles.activeLabel}>ACTIVE PLAN</Text>
              </View>
              <LinearGradient colors={[...Gradients.successBadge]} style={styles.ongoingBadge}>
                <Text style={styles.ongoingText}>ONGOING</Text>
              </LinearGradient>
            </View>
            <Text style={styles.routeName}>{MOCK_ACTIVE_PLAN.route}</Text>
            <Text style={styles.schedule}>{MOCK_ACTIVE_PLAN.schedule}</Text>
            <View style={styles.progressCard}>
              <Text style={styles.progressLabel}>MONTHLY PROGRESS</Text>
              <Text style={styles.progressValue}>
                {MOCK_ACTIVE_PLAN.progress.current} / {MOCK_ACTIVE_PLAN.progress.total} Rides
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${(MOCK_ACTIVE_PLAN.progress.current / MOCK_ACTIVE_PLAN.progress.total) * 100}%` }]} />
              </View>
            </View>
            <View style={styles.footerRow}>
              <View style={styles.footerItem}>
                <LinearGradient colors={[...Gradients.avatar]} style={styles.miniAvatar}>
                  <Text style={styles.miniAvatarText}>{MOCK_ACTIVE_PLAN.driver.initial}</Text>
                </LinearGradient>
                <View>
                  <Text style={styles.footerLabel}>Assigned Driver</Text>
                  <Text style={styles.footerValue}>{MOCK_ACTIVE_PLAN.driver.name.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.footerItem}>
                <Text style={styles.footerLabel}>NEXT TRIP</Text>
                <Text style={[styles.footerValue, { color: Colors.primary }]}>{MOCK_ACTIVE_PLAN.nextTrip}</Text>
              </View>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Subscription tracker" onPress={() => router.push('/ride/subscription-tracker')} style={styles.trackerLink}>
              <Text style={styles.trackerText}>View Subscription Tracker →</Text>
            </Pressable>
          </View>
        ) : (
          history.map((b) => (
            <Pressable key={b.id} accessibilityRole="button" accessibilityLabel={`${b.route.from} to ${b.route.to}`} style={[styles.historyCard, Shadows.card]}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyRoute}>{b.route.from} → {b.route.to}</Text>
                <View style={[styles.statusBadge, b.status === 'cancelled' && styles.statusCancelled]}>
                  <Text style={[styles.statusText, b.status === 'cancelled' && styles.statusTextCancelled]}>
                    {b.status === 'completed' ? 'Completed' : 'Canceled'}
                  </Text>
                </View>
              </View>
              <Text style={styles.historyDate}>{b.date} • {b.departureTime}</Text>
              <View style={styles.historyFooter}>
                <Text style={styles.historyOperator}>{b.operator}</Text>
                <Text style={styles.historyAmount}>{formatTaka(b.amount)}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: 60, paddingBottom: Spacing.base, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  overline: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textMuted, letterSpacing: Typography.letterSpacing.eyebrow },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: Spacing.sm },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary },
  calBtn: { width: 48, height: 48, borderRadius: Radius.lg, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: Spacing.xl, paddingBottom: 100, gap: Spacing.base },
  planCard: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.xl },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  activeLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.accentEmerald, letterSpacing: 1 },
  ongoingBadge: { paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: Radius.full },
  ongoingText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.white, letterSpacing: 1 },
  routeName: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  schedule: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.base, color: Colors.textSecondary, marginBottom: Spacing.base },
  progressCard: { backgroundColor: Colors.surfaceMuted, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.base },
  progressLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  progressValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, marginVertical: Spacing.xs },
  progressTrack: { height: 6, backgroundColor: Colors.track, borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  footerItem: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  miniAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  miniAvatarText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.white },
  footerLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 0.5 },
  footerValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xs, color: Colors.textPrimary },
  trackerLink: { marginTop: Spacing.base, alignItems: 'center' },
  trackerText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  historyCard: { backgroundColor: Colors.surface, borderRadius: Radius.card, padding: Spacing.base },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyRoute: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, flex: 1 },
  statusBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full },
  statusCancelled: { backgroundColor: '#FEF2F2' },
  statusText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.accentEmerald },
  statusTextCancelled: { color: Colors.danger },
  historyDate: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, marginVertical: Spacing.xs },
  historyFooter: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  historyOperator: { flex: 1, fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  historyAmount: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
});
