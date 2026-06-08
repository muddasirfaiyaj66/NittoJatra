import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, formatTaka, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { DRIVER_PENDING, DRIVER_PAYOUT, WALLET_TRANSACTIONS } from '@/constants/mock-data';

export default function FinancialHubScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Text style={styles.title}>Financial Hub</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="View earnings chart" style={styles.iconBtn}>
            <Ionicons name="bar-chart-outline" size={22} color={Colors.textPrimary} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={[...Gradients.navyHeader]} style={styles.payoutCard}>
          <Text style={styles.payoutLabel}>AVAILABLE FOR PAYOUT</Text>
          <Text style={styles.payoutValue}>{formatTaka(DRIVER_PAYOUT)}</Text>
          <View style={styles.payoutActions}>
            <Pressable accessibilityRole="button" accessibilityLabel="Cash out" onPress={() => router.push('/(driver)/modals/withdraw-funds')} style={styles.cashOutBtn}>
              <Text style={styles.cashOutText}>↗ CASH OUT</Text>
            </Pressable>
            <View style={styles.pendingChip}>
              <Text style={styles.pendingText}>PENDING {formatTaka(DRIVER_PENDING)}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.bonusCard, Shadows.card]}>
          <Ionicons name="trophy" size={24} color={Colors.primary} />
          <View style={styles.bonusText}>
            <Text style={styles.bonusTitle}>On Track for Bonus</Text>
            <Text style={styles.bonusSub}>Complete 5 more rides this week to unlock ৳500 bonus.</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.viewAll}>VIEW HISTORY</Text>
        </View>

        {WALLET_TRANSACTIONS.map((t) => (
          <View key={t.id} style={[styles.txRow, Shadows.card]}>
            <View style={[styles.txIcon, { backgroundColor: t.type === 'credit' ? '#ECFDF5' : Colors.surfaceMuted }]}>
              <Ionicons name={t.type === 'credit' ? 'arrow-down' : 'arrow-up'} size={18} color={t.type === 'credit' ? Colors.accentEmerald : Colors.textSecondary} />
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
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  iconBtn: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
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
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.md },
  txIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txTitle: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  txSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base },
  txStatus: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
});
