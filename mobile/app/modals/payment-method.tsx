import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, formatTaka, Radius, Spacing, Typography } from '@/constants/theme';
import { usePaymentStore } from '@/store/payment.store';
import { useAuth } from '@/hooks/useAuth';

const PAYMENT_METHODS = [
  { id: 'wallet', type: 'wallet', label: 'Wallet', detail: 'Pay from balance' },
  { id: 'bkash', type: 'bkash', label: 'bKash', detail: 'Mobile wallet' },
  { id: 'bank', type: 'bank', label: 'Bank', detail: 'Card / bank transfer' },
  { id: 'visa', type: 'visa', label: 'Visa', detail: 'Debit / credit card' },
];

export default function PaymentMethodModal() {
  const { user } = useAuth();
  const {
    total,
    originalTotal,
    claimedCoins,
    promoCode,
    promoDiscount,
    setTotal,
    setStep,
    setPaymentMethod,
    setClaimedCoins,
    setPromoCode,
  } = usePaymentStore();

  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [redeemAll, setRedeemAll] = useState(claimedCoins > 0);

  const applyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    let discount = 0;
    if (code === 'NITTO10') {
      discount = Math.min(Math.round(originalTotal * 0.1), 50);
    } else if (code === 'SAVE20') {
      discount = Math.min(Math.round(originalTotal * 0.2), 100);
    } else if (code === 'WELCOME50') {
      discount = Math.min(50, originalTotal);
    } else {
      setPromoError('Invalid promo code');
      return;
    }
    setPromoError(null);
    setPromoCode(code, discount);
  };

  const removePromo = () => {
    setPromoInput('');
    setPromoError(null);
    setPromoCode('', 0);
  };

  const maxRedeemableCoins = Math.min(user?.points ?? 0, Math.floor((originalTotal - promoDiscount) * 10));
  const calculatedCoinDiscount = redeemAll ? Math.floor(maxRedeemableCoins / 10) : 0;
  const finalTotal = Math.max(0, originalTotal - promoDiscount - calculatedCoinDiscount);

  useEffect(() => {
    setTotal(finalTotal);
    setClaimedCoins(redeemAll ? maxRedeemableCoins : 0, calculatedCoinDiscount);
  }, [redeemAll, promoDiscount, finalTotal, calculatedCoinDiscount, maxRedeemableCoins, setClaimedCoins, setTotal]);

  const select = (type: string) => {
    const methodMap: Record<string, 'bkash' | 'card' | 'cash'> = {
      wallet: 'cash',
      bkash: 'bkash',
      bank: 'card',
      visa: 'card',
    };
    setPaymentMethod(methodMap[type] ?? 'bkash');
    if (type === 'wallet') {
      setStep('pin');
      router.push('/modals/security-pin');
    } else if (type === 'bkash') {
      setStep('details');
      router.push('/modals/payment-details');
    } else {
      setStep('transfer');
      router.push('/modals/mobile-transfer');
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Payment Method</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.totalPill}>
          <Text style={styles.totalText}>Total to Pay: {formatTaka(total)}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {/* Coin Redemption Section */}
          {user && user.points !== undefined && user.points > 0 && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Ionicons name="sparkles" size={18} color="#F59E0B" />
                <Text style={styles.sectionTitle}>Redeem Coins</Text>
              </View>
              <View style={styles.coinRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.coinBalance}>
                    Balance: {user.points} coins (Value: {formatTaka(user.points / 10)})
                  </Text>
                  {redeemAll && (
                    <Text style={styles.coinRedemptionMsg}>
                      Claiming {maxRedeemableCoins} coins for {formatTaka(calculatedCoinDiscount)} off
                    </Text>
                  )}
                </View>
                <Switch
                  value={redeemAll}
                  onValueChange={setRedeemAll}
                  trackColor={{ false: Colors.borderMid, true: '#F59E0B' }}
                  thumbColor={Colors.white}
                />
              </View>
            </View>
          )}

          {/* Promo Code Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="ticket-outline" size={18} color={Colors.primary} />
              <Text style={styles.sectionTitle}>Promo Code</Text>
            </View>
            {promoCode ? (
              <View style={styles.promoAppliedRow}>
                <Text style={styles.promoAppliedText}>
                  Code <Text style={{ fontFamily: Typography.fonts.bold }}>{promoCode}</Text> applied (-{formatTaka(promoDiscount)})
                </Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Remove Promo" onPress={removePromo} style={styles.removePromoBtn}>
                  <Text style={styles.removePromoText}>Remove</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.promoInputRow}>
                <TextInput
                  accessibilityLabel="Promo code input"
                  placeholder="Enter Promo Code"
                  placeholderTextColor={Colors.textMuted}
                  value={promoInput}
                  onChangeText={(v) => { setPromoInput(v); setPromoError(null); }}
                  autoCapitalize="characters"
                  style={styles.promoInput}
                />
                <Pressable accessibilityRole="button" accessibilityLabel="Apply Promo" onPress={applyPromo} style={styles.applyPromoBtn}>
                  <Text style={styles.applyPromoText}>Apply</Text>
                </Pressable>
              </View>
            )}
            {promoError && <Text style={styles.promoErrorText}>{promoError}</Text>}
          </View>

          {/* Pricing Breakdown */}
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Base Fare</Text>
              <Text style={styles.breakdownValue}>{formatTaka(originalTotal)}</Text>
            </View>
            {promoDiscount > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Promo Discount ({promoCode})</Text>
                <Text style={[styles.breakdownValue, { color: Colors.danger }]}>-{formatTaka(promoDiscount)}</Text>
              </View>
            )}
            {calculatedCoinDiscount > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Coin Redemption</Text>
                <Text style={[styles.breakdownValue, { color: Colors.danger }]}>-{formatTaka(calculatedCoinDiscount)}</Text>
              </View>
            )}
            <View style={[styles.breakdownRow, styles.breakdownDivider]}>
              <Text style={styles.breakdownTotalLabel}>Final Amount</Text>
              <Text style={styles.breakdownTotalValue}>{formatTaka(total)}</Text>
            </View>
          </View>

          <Text style={styles.paymentMethodsHeading}>SELECT PAYMENT METHOD</Text>

          {PAYMENT_METHODS.map((m) => (
            <Pressable
              key={m.id}
              accessibilityRole="button"
              accessibilityLabel={`Pay with ${m.label}`}
              onPress={() => select(m.type)}
              style={styles.option}
            >
              <View style={styles.optionIcon}>
                <Ionicons name={m.type === 'wallet' ? 'wallet' : m.type === 'bkash' ? 'phone-portrait' : 'card'} size={22} color={Colors.primary} />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>{m.label}</Text>
                <Text style={styles.optionDetail}>{m.detail}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.base },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  totalPill: { alignSelf: 'center', backgroundColor: Colors.surfaceIndigo, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs, borderRadius: Radius.full, marginBottom: Spacing.base },
  totalText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  sectionCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, marginBottom: Spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  sectionTitle: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  coinRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  coinBalance: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  coinRedemptionMsg: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: '#F59E0B', marginTop: 4 },
  promoInputRow: { flexDirection: 'row', gap: Spacing.sm, height: 44 },
  promoInput: { flex: 1, borderWidth: 1, borderColor: Colors.borderMid, borderRadius: Radius.md, paddingHorizontal: Spacing.base, fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  applyPromoBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.lg, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  applyPromoText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.white },
  promoAppliedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  promoAppliedText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  removePromoBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  removePromoText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.danger },
  promoErrorText: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.xs, color: Colors.danger, marginTop: 4 },
  breakdownCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, marginBottom: Spacing.lg },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  breakdownLabel: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  breakdownValue: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  breakdownDivider: { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm, marginTop: Spacing.sm, marginBottom: 0 },
  breakdownTotalLabel: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.sm, color: Colors.textPrimary },
  breakdownTotalValue: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.md, color: Colors.primary },
  paymentMethodsHeading: { fontFamily: Typography.fonts.black, fontSize: 10, color: Colors.textMuted, letterSpacing: 1.5, marginBottom: Spacing.xs, marginTop: Spacing.xs },
  option: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border },
  optionIcon: { width: 44, height: 44, borderRadius: Radius.md, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  optionText: { flex: 1 },
  optionLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  optionDetail: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
});
