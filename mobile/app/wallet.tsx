import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, formatTaka, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { PAYMENT_METHODS, WALLET_BALANCE, WALLET_TRANSACTIONS } from '@/constants/mock-data';

export default function WalletScreen() {
  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']}>
        <View style={styles.nav}>
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>Wallet</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Transaction history" style={styles.back}>
            <Ionicons name="time-outline" size={22} color={Colors.textPrimary} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll}>
        <LinearGradient colors={[...Gradients.navyHeader]} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>AVAILABLE BALANCE</Text>
          <Text style={styles.balanceValue}>{formatTaka(WALLET_BALANCE, 1)}</Text>
          <View style={styles.actionTiles}>
            {[
              { icon: 'add-circle', label: 'Add Money' },
              { icon: 'phone-portrait', label: 'To bKash' },
              { icon: 'business', label: 'Bank Transfer' },
            ].map((a) => (
              <Pressable key={a.label} accessibilityRole="button" accessibilityLabel={a.label} style={styles.tile}>
                <View style={styles.tileIcon}>
                  <Ionicons name={a.icon as keyof typeof Ionicons.glyphMap} size={20} color={Colors.white} />
                </View>
                <Text style={styles.tileLabel}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </LinearGradient>

        <Text style={styles.sectionLabel}>PAYMENT METHODS</Text>
        <View style={styles.methodsRow}>
          {PAYMENT_METHODS.map((m) => (
            <View key={m.id} style={[styles.methodCard, Shadows.card]}>
              <Ionicons name={m.type === 'wallet' ? 'wallet' : m.type === 'bkash' ? 'phone-portrait' : 'card'} size={24} color={Colors.primary} />
              <Text style={styles.methodLabel}>{m.label}</Text>
              <Text style={styles.methodDetail}>{m.detail}</Text>
            </View>
          ))}
          <Pressable accessibilityRole="button" accessibilityLabel="Add payment method" style={styles.addMethod}>
            <Ionicons name="add" size={28} color={Colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>Recent Activity</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        {WALLET_TRANSACTIONS.map((t) => (
          <View key={t.id} style={[styles.txRow, Shadows.card]}>
            <View style={[styles.txIcon, { backgroundColor: t.type === 'credit' ? '#ECFDF5' : '#FEF2F2' }]}>
              <Ionicons name={t.type === 'credit' ? 'arrow-down' : 'arrow-up'} size={18} color={t.type === 'credit' ? Colors.accentEmerald : Colors.danger} />
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txTitle}>{t.title}</Text>
              <Text style={styles.txSub}>{t.subtitle}</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={[styles.txAmount, { color: t.type === 'credit' ? Colors.accentEmerald : Colors.textPrimary }]}>
                {t.type === 'credit' ? '+' : ''}{formatTaka(Math.abs(t.amount))}
              </Text>
              <Text style={styles.txTime}>{t.timestamp}</Text>
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
  back: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary },
  scroll: { padding: Spacing.xl, paddingBottom: 40 },
  balanceCard: { borderRadius: Radius.card, padding: Spacing.xl, marginBottom: Spacing.xl },
  balanceLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  balanceValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xxl, color: Colors.white, marginVertical: Spacing.sm },
  actionTiles: { flexDirection: 'row', justifyContent: 'space-around', marginTop: Spacing.base },
  tile: { alignItems: 'center', gap: Spacing.xs },
  tileIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  tileLabel: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.white },
  sectionLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1, marginBottom: Spacing.md },
  methodsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xl },
  methodCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, alignItems: 'center', gap: 4 },
  methodLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textPrimary },
  methodDetail: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
  addMethod: { width: 80, backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.borderMid, alignItems: 'center', justifyContent: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.md },
  seeAll: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, marginBottom: Spacing.sm, gap: Spacing.md },
  txIcon: { width: 40, height: 40, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txTitle: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  txSub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base },
  txTime: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted },
});
