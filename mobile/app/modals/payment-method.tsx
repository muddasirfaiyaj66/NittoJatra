import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, formatTaka, Radius, Spacing, Typography } from '@/constants/theme';
import { PAYMENT_METHODS } from '@/constants/mock-data';
import { usePaymentStore } from '@/store/payment.store';

export default function PaymentMethodModal() {
  const { total, setStep } = usePaymentStore();

  const select = (type: string) => {
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
      <SafeAreaView edges={['bottom']}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Payment Method</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.totalPill}>
          <Text style={styles.totalText}>Total: {formatTaka(total)}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.list}>
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
  root: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.base },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  totalPill: { alignSelf: 'center', backgroundColor: Colors.surfaceIndigo, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.xs, borderRadius: Radius.full, marginBottom: Spacing.base },
  totalText: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  option: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border },
  optionIcon: { width: 44, height: 44, borderRadius: Radius.md, backgroundColor: Colors.surfaceIndigo, alignItems: 'center', justifyContent: 'center' },
  optionText: { flex: 1 },
  optionLabel: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.base, color: Colors.textPrimary },
  optionDetail: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
});
