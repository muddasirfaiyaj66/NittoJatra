import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, formatTaka, Gradients, Radius, Shadows, Spacing, Typography } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';
import { useBookingStore } from '@/store/booking.store';

const PAYMENT_METHODS = [
  { id: 'wallet', type: 'wallet', label: 'Wallet', detail: 'Primary balance' },
  { id: 'bkash', type: 'bkash', label: 'bKash', detail: 'Linked account' },
  { id: 'card', type: 'card', label: 'Card', detail: 'Visa ending 4242' },
];

export default function WalletScreen() {
  const { user } = useAuth();
  const bookings = useBookingStore((s) => s.bookings);

  const balance = Math.max(0, (user?.points ?? 0) * 10);
  const transactions = useMemo(
    () =>
      bookings.slice(0, 8).map((booking) => ({
        id: booking.id,
        label: `${booking.route.from} → ${booking.route.to}`,
        amount: -booking.amount,
        date: booking.date,
        status: booking.status,
      })),
    [bookings],
  );

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
          <Text style={styles.balanceValue}>{formatTaka(balance, 1)}</Text>
          <Text style={styles.balanceMeta}>{user?.points ?? 0} loyalty points • {formatTaka(user?.totalSpent ?? 0)} spent</Text>
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
        </View>

        <Text style={styles.sectionLabel}>RECENT TRANSACTIONS</Text>
        {transactions.length === 0 ? (
          <Text style={styles.emptyText}>Ride payments will appear here after booking.</Text>
        ) : (
          transactions.map((tx) => (
            <View key={tx.id} style={[styles.txRow, Shadows.card]}>
              <View>
                <Text style={styles.txLabel}>{tx.label}</Text>
                <Text style={styles.txDate}>{tx.date} • {tx.status}</Text>
              </View>
              <Text style={styles.txAmount}>{formatTaka(Math.abs(tx.amount))}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  back: { width: 40, height: 40, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xl, color: Colors.textPrimary },
  scroll: { padding: Spacing.xl, gap: Spacing.lg, paddingBottom: 40 },
  balanceCard: { borderRadius: Radius.xl, padding: Spacing.xl, gap: Spacing.sm },
  balanceLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: '#C7D2FE', letterSpacing: 1 },
  balanceValue: { fontFamily: Typography.fonts.black, fontSize: 36, color: Colors.white },
  balanceMeta: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: '#C7D2FE' },
  actionTiles: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
  tile: { flex: 1, alignItems: 'center', gap: Spacing.sm },
  tileIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  tileLabel: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.white, textAlign: 'center' },
  sectionLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  methodsRow: { flexDirection: 'row', gap: Spacing.md },
  methodCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: 4, alignItems: 'center' },
  methodLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  methodDetail: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, textAlign: 'center' },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base },
  txLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  txDate: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  txAmount: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.primary },
  emptyText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
});
