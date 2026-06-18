import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, formatTaka, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useDriverStore } from '@/store/driver.store';

// ─── Sample earnings data ───────────────────────────────────────────────────

const WEEKLY_DATA = [
  { label: 'Mon', amount: 1200 },
  { label: 'Tue', amount: 2800 },
  { label: 'Wed', amount: 1800 },
  { label: 'Thu', amount: 3400 },
  { label: 'Fri', amount: 4200 },
  { label: 'Sat', amount: 5100 },
  { label: 'Sun', amount: 2600 },
];

const MONTHLY_DATA = [
  { label: 'W1',  amount: 12400 },
  { label: 'W2',  amount: 18700 },
  { label: 'W3',  amount: 15200 },
  { label: 'W4',  amount: 22100 },
];

const CHART_HEIGHT = 160;

// ─── Bar chart component ────────────────────────────────────────────────────

function EarningsBarChart({ data }: { data: { label: string; amount: number }[] }) {
  const max = Math.max(...data.map((d) => d.amount));
  const total = data.reduce((s, d) => s + d.amount, 0);
  const avg = Math.round(total / data.length);

  return (
    <View>
      {/* Summary row */}
      <View style={chart.summaryRow}>
        <View style={chart.summaryItem}>
          <Text style={chart.summaryValue}>{formatTaka(total)}</Text>
          <Text style={chart.summaryLabel}>Total</Text>
        </View>
        <View style={chart.summaryDivider} />
        <View style={chart.summaryItem}>
          <Text style={chart.summaryValue}>{formatTaka(avg)}</Text>
          <Text style={chart.summaryLabel}>Average</Text>
        </View>
        <View style={chart.summaryDivider} />
        <View style={chart.summaryItem}>
          <Text style={chart.summaryValue}>{formatTaka(Math.max(...data.map((d) => d.amount)))}</Text>
          <Text style={chart.summaryLabel}>Peak</Text>
        </View>
      </View>

      {/* Y-axis guides */}
      <View style={chart.chartArea}>
        {/* Horizontal guide lines */}
        {[1, 0.66, 0.33].map((ratio) => (
          <View key={ratio} style={[chart.guideLine, { bottom: ratio * CHART_HEIGHT }]}>
            <Text style={chart.guideLabel}>{formatTaka(Math.round(max * ratio))}</Text>
            <View style={chart.guideLineRule} />
          </View>
        ))}

        {/* Bars */}
        <View style={chart.barsRow}>
          {data.map((item) => {
            const heightPct = item.amount / max;
            const barH = Math.max(8, heightPct * CHART_HEIGHT);
            const isMax = item.amount === max;
            return (
              <View key={item.label} style={chart.barCol}>
                <Text style={chart.barValue}>{formatTaka(item.amount)}</Text>
                <View style={[chart.barTrack, { height: CHART_HEIGHT }]}>
                  <LinearGradient
                    colors={isMax ? ['#6366F1', '#4F46E5'] : ['#A5B4FC', '#818CF8']}
                    style={[chart.bar, { height: barH }]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />
                </View>
                <Text style={chart.barLabel}>{item.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// ─── Main screen ────────────────────────────────────────────────────────────

export default function FinancialHubScreen() {
  const payout = useDriverStore((s) => s.payout);
  const pending = useDriverStore((s) => s.pending);
  const transactions = useDriverStore((s) => s.transactions);

  const [chartVisible, setChartVisible] = useState(false);
  const [chartTab, setChartTab] = useState<'weekly' | 'monthly'>('weekly');

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Text style={styles.title}>Financial Hub</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View earnings chart"
            onPress={() => setChartVisible(true)}
            style={styles.iconBtn}
          >
            <Ionicons name="bar-chart-outline" size={22} color={Colors.primary} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={[...Gradients.navyHeader]} style={styles.payoutCard}>
          <Text style={styles.payoutLabel}>AVAILABLE FOR PAYOUT</Text>
          <Text style={styles.payoutValue}>{formatTaka(payout)}</Text>
          <View style={styles.payoutActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cash out"
              onPress={() => router.push('/captain/modals/withdraw-funds')}
              style={styles.cashOutBtn}
            >
              <Text style={styles.cashOutText}>↗ CASH OUT</Text>
            </Pressable>
            <View style={styles.pendingChip}>
              <Text style={styles.pendingText}>PENDING {formatTaka(pending)}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.bonusCard, Shadows.card]}>
          <Ionicons name="trophy" size={24} color={Colors.primary} />
          <View style={styles.bonusText}>
            <Text style={styles.bonusTitle}>On Track for Bonus</Text>
            <Text style={styles.bonusSub}>Complete more confirmed rides to unlock weekly bonuses.</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.viewAll}>VIEW HISTORY</Text>
        </View>

        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>Booking payments will appear here after riders book your routes.</Text>
        ) : (
          transactions.map((t) => (
            <View key={t.id} style={[styles.txRow, Shadows.card]}>
              <View style={[styles.txIcon, { backgroundColor: t.type === 'credit' ? '#ECFDF5' : Colors.surfaceMuted }]}>
                <Ionicons
                  name={t.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                  size={18}
                  color={t.type === 'credit' ? Colors.accentEmerald : Colors.textSecondary}
                />
              </View>
              <View style={styles.txInfo}>
                <Text style={styles.txTitle}>{t.title}</Text>
                <Text style={styles.txSub}>{t.subtitle}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, { color: Colors.accentEmerald }]}>
                  {t.type === 'credit' ? '+' : ''}{formatTaka(Math.abs(t.amount))}
                </Text>
                <Text style={styles.txStatus}>{t.type === 'credit' ? 'Completed' : 'Pending'}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ── Earnings Chart Modal ─────────────────────────────────── */}
      <Modal
        visible={chartVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setChartVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setChartVisible(false)}>
          <View style={modal.backdrop} />
        </TouchableWithoutFeedback>

        <View style={modal.sheet}>
          {/* Handle */}
          <View style={modal.handle} />

          {/* Header */}
          <View style={modal.header}>
            <View>
              <Text style={modal.headerTitle}>Earnings Overview</Text>
              <Text style={modal.headerSub}>Your performance at a glance</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close chart"
              onPress={() => setChartVisible(false)}
              style={modal.closeBtn}
            >
              <Ionicons name="close" size={20} color={Colors.textPrimary} />
            </Pressable>
          </View>

          {/* Tab toggle */}
          <View style={modal.tabRow}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setChartTab('weekly')}
              style={[modal.tab, chartTab === 'weekly' && modal.tabActive]}
            >
              <Text style={[modal.tabText, chartTab === 'weekly' && modal.tabTextActive]}>
                This Week
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => setChartTab('monthly')}
              style={[modal.tab, chartTab === 'monthly' && modal.tabActive]}
            >
              <Text style={[modal.tabText, chartTab === 'monthly' && modal.tabTextActive]}>
                This Month
              </Text>
            </Pressable>
          </View>

          {/* Chart */}
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: Spacing.xxl }}>
            <EarningsBarChart data={chartTab === 'weekly' ? WEEKLY_DATA : MONTHLY_DATA} />

            {/* Quick stats */}
            <View style={modal.statsGrid}>
              {[
                { icon: 'car-outline' as const, label: 'Rides', value: chartTab === 'weekly' ? '24' : '98' },
                { icon: 'star-outline' as const, label: 'Rating', value: '4.9 ★' },
                { icon: 'time-outline' as const, label: 'Hrs Online', value: chartTab === 'weekly' ? '42h' : '168h' },
                { icon: 'trending-up-outline' as const, label: 'vs Last', value: '+14%' },
              ].map((s) => (
                <View key={s.label} style={[modal.statCard, Shadows.card]}>
                  <View style={modal.statIconWrap}>
                    <Ionicons name={s.icon} size={18} color={Colors.primary} />
                  </View>
                  <Text style={modal.statValue}>{s.value}</Text>
                  <Text style={modal.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  scroll: { padding: Spacing.xl, paddingBottom: 100, gap: Spacing.base },
  payoutCard: { borderRadius: Radius.card, padding: Spacing.xl },
  payoutLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  payoutValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xxl, color: Colors.white, marginVertical: Spacing.sm },
  payoutActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginTop: Spacing.sm },
  cashOutBtn: { backgroundColor: Colors.white, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: Radius.lg },
  cashOutText: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  pendingChip: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.full },
  pendingText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.white },
  bonusCard: { flexDirection: 'row', backgroundColor: Colors.surfaceIndigo, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.md, alignItems: 'center' },
  bonusText: { flex: 1 },
  bonusTitle: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.primary },
  bonusSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.md },
  sectionTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  viewAll: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.primary },
  emptyText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.md },
  txIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txTitle: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  txSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base },
  txStatus: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
});

const modal = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    maxHeight: '85%',
    flex: 1,
  },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginBottom: Spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  headerTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  headerSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: Colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surfaceMuted, borderRadius: Radius.lg, padding: 4, marginBottom: Spacing.xl, gap: 4 },
  tab: { flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.white, ...Shadows.card },
  tabText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textMuted },
  tabTextActive: { color: Colors.primary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.xl },
  statCard: { width: '47%', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, alignItems: 'center', gap: Spacing.xs, borderWidth: 1, borderColor: Colors.border },
  statIconWrap: { width: 36, height: 36, borderRadius: Radius.md, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  statLabel: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textSecondary },
});

const chart = StyleSheet.create({
  summaryRow: { flexDirection: 'row', backgroundColor: Colors.surfaceIndigo, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.xl, alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.primary },
  summaryLabel: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, height: 36, backgroundColor: Colors.borderMid },
  chartArea: { position: 'relative', paddingLeft: 40, paddingBottom: Spacing.lg },
  guideLine: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', alignItems: 'center' },
  guideLabel: { fontFamily: Typography.fonts.medium, fontSize: 9, color: Colors.textMuted, width: 36, textAlign: 'right' },
  guideLineRule: { flex: 1, height: 1, backgroundColor: Colors.border, marginLeft: 4 },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, paddingTop: Spacing.xs },
  barCol: { flex: 1, alignItems: 'center', gap: 4 },
  barValue: { fontFamily: Typography.fonts.bold, fontSize: 8, color: Colors.primary, textAlign: 'center' },
  barTrack: { width: '100%', justifyContent: 'flex-end', borderRadius: 4, overflow: 'hidden', backgroundColor: Colors.surfaceMuted },
  bar: { width: '100%', borderRadius: 4 },
  barLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textSecondary },
});
