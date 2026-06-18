import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState, useEffect } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  const { user, updateUser } = useAuth();
  const bookings = useBookingStore((s) => s.bookings);

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.walletBalance === undefined) {
      void updateUser({ walletBalance: 2540.5, walletTransactions: [] });
    }
  }, [user, updateUser]);

  const balance = user?.walletBalance ?? 2540.5;

  const redeemCoins = async (amount: number) => {
    if (!user) return;
    const currentPoints = user.points ?? 0;
    if (currentPoints < amount) {
      Alert.alert('Insufficient Coins', `You only have ${currentPoints} coins.`);
      return;
    }
    const currentBalance = user.walletBalance ?? 2540.5;
    const currentTransactions = user.walletTransactions ?? [];

    const tx = {
      id: `tx-coin-${Date.now()}`,
      label: `Redeemed ${amount} Coins`,
      amount: amount,
      date: new Date().toISOString().slice(0, 10),
      status: 'completed',
    };

    try {
      await updateUser({
        points: currentPoints - amount,
        walletBalance: currentBalance + amount,
        walletTransactions: [tx, ...currentTransactions],
      });
      Alert.alert('Success', `Successfully redeemed ${amount} coins for ${formatTaka(amount)} wallet balance!`);
    } catch {
      Alert.alert('Error', 'Failed to redeem coins.');
    }
  };

  const applyPromo = async () => {
    const code = promoCodeInput.trim().toUpperCase();
    let bonus = 0;
    if (code === 'WALLET100') {
      bonus = 100;
    } else if (code === 'NITTO50') {
      bonus = 50;
    } else {
      setPromoError('Invalid wallet promo code');
      return;
    }

    const currentBalance = user?.walletBalance ?? 2540.5;
    const currentTransactions = user?.walletTransactions ?? [];

    const tx = {
      id: `tx-promo-${Date.now()}`,
      label: `Promo ${code} Applied`,
      amount: bonus,
      date: new Date().toISOString().slice(0, 10),
      status: 'completed',
    };

    try {
      await updateUser({
        walletBalance: currentBalance + bonus,
        walletTransactions: [tx, ...currentTransactions],
      });
      setPromoCodeInput('');
      setPromoError(null);
      Alert.alert('Promo Applied', `Credited ${formatTaka(bonus)} to your wallet balance!`);
    } catch {
      Alert.alert('Error', 'Failed to apply promo code.');
    }
  };

  const transactions = useMemo(() => {
    const bookingTx = bookings.map((booking) => ({
      id: booking.id,
      label: `${booking.route.from} → ${booking.route.to}`,
      amount: -booking.amount,
      date: booking.date,
      status: booking.status,
    }));
    const localTx = user?.walletTransactions ?? [];
    return [...localTx, ...bookingTx]
      .sort((a, b) => b.id.localeCompare(a.id))
      .slice(0, 8);
  }, [bookings, user?.walletTransactions]);

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

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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

        <Text style={styles.sectionLabel}>REDEEM & OFFERS</Text>
        <View style={styles.offersRow}>
          {/* Redeem Coins Card */}
          <View style={[styles.offerCard, Shadows.card]}>
            <View style={styles.offerHeader}>
              <Ionicons name="sparkles" size={18} color="#F59E0B" />
              <Text style={styles.offerTitle}>Redeem Coins</Text>
            </View>
            <Text style={styles.offerDesc}>1 coin = ৳1 credit</Text>
            <View style={styles.quickRedeemRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Redeem 100 coins"
                onPress={() => void redeemCoins(100)}
                style={[styles.quickRedeemBtn, (user?.points ?? 0) < 100 && styles.disabledBtn]}
              >
                <Text style={styles.quickRedeemText}>Redeem 100</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Redeem 500 coins"
                onPress={() => void redeemCoins(500)}
                style={[styles.quickRedeemBtn, (user?.points ?? 0) < 500 && styles.disabledBtn]}
              >
                <Text style={styles.quickRedeemText}>Redeem 500</Text>
              </Pressable>
            </View>
          </View>

          {/* Promo Code Card */}
          <View style={[styles.offerCard, Shadows.card]}>
            <View style={styles.offerHeader}>
              <Ionicons name="ticket" size={18} color={Colors.primary} />
              <Text style={styles.offerTitle}>Apply Promo</Text>
            </View>
            <View style={styles.promoInputGroup}>
              <TextInput
                accessibilityLabel="Wallet promo code input"
                placeholder="WALLET100 / NITTO50"
                placeholderTextColor={Colors.textMuted}
                value={promoCodeInput}
                onChangeText={(v) => { setPromoCodeInput(v); setPromoError(null); }}
                autoCapitalize="characters"
                style={styles.promoInput}
              />
              <Pressable accessibilityRole="button" accessibilityLabel="Claim promo" onPress={() => void applyPromo()} style={styles.claimBtn}>
                <Text style={styles.claimBtnText}>Claim</Text>
              </Pressable>
            </View>
            {promoError ? <Text style={styles.promoError}>{promoError}</Text> : null}
          </View>
        </View>

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
              <View style={{ flex: 1 }}>
                <Text style={styles.txLabel}>{tx.label}</Text>
                <Text style={styles.txDate}>{tx.date} • {tx.status}</Text>
              </View>
              <Text style={[styles.txAmount, tx.amount > 0 && styles.txAmountPositive]}>
                {tx.amount > 0 ? `+${formatTaka(tx.amount)}` : formatTaka(Math.abs(tx.amount))}
              </Text>
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
  offersRow: { flexDirection: 'row', gap: Spacing.md },
  offerCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: Spacing.xs, justifyContent: 'space-between' },
  offerHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  offerTitle: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  offerDesc: { fontFamily: Typography.fonts.medium, fontSize: 10, color: Colors.textMuted },
  quickRedeemRow: { gap: Spacing.xs, marginTop: Spacing.xs },
  quickRedeemBtn: { backgroundColor: Colors.surfaceIndigo, paddingVertical: 6, borderRadius: Radius.md, alignItems: 'center' },
  quickRedeemText: { fontFamily: Typography.fonts.bold, fontSize: 10, color: Colors.primary },
  disabledBtn: { opacity: 0.5 },
  promoInputGroup: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.xs, height: 36 },
  promoInput: { flex: 1, borderWidth: 1, borderColor: Colors.borderMid, borderRadius: Radius.md, paddingHorizontal: Spacing.sm, fontFamily: Typography.fonts.bold, fontSize: 10, color: Colors.textPrimary },
  claimBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  claimBtnText: { fontFamily: Typography.fonts.bold, fontSize: 10, color: Colors.white },
  promoError: { fontFamily: Typography.fonts.medium, fontSize: 9, color: Colors.danger, marginTop: 2 },
  methodsRow: { flexDirection: 'row', gap: Spacing.md },
  methodCard: { flex: 1, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base, gap: 4, alignItems: 'center' },
  methodLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  methodDetail: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, textAlign: 'center' },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.base },
  txLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  txDate: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  txAmount: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.base, color: Colors.primary },
  txAmountPositive: { color: Colors.success },
  emptyText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
});
