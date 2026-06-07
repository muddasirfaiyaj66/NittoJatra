import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '@/components/ui';
import { Colors, formatTaka, Radius, Spacing, Typography } from '@/constants/theme';
import { WALLET_BALANCE } from '@/constants/mock-data';
import { usePaymentStore } from '@/store/payment.store';

export default function MobileTransferModal() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const { total, reset } = usePaymentStore();

  const confirm = () => {
    reset();
    router.dismissAll();
    router.push('/notifications');
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text style={styles.title}>Mobile Transfer</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>
        <Text style={styles.available}>AVAILABLE {formatTaka(WALLET_BALANCE, 1)}</Text>
        <View style={styles.form}>
          {[
            { label: 'Mobile Number', value: phone, set: setPhone, keyboard: 'phone-pad' as const },
            { label: 'Amount', value: amount, set: setAmount, keyboard: 'numeric' as const, placeholder: formatTaka(total) },
            { label: 'Reference', value: reference, set: setReference, keyboard: 'default' as const },
          ].map((f) => (
            <View key={f.label}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput accessibilityLabel={f.label} placeholder={f.placeholder ?? f.label} placeholderTextColor={Colors.textMuted} value={f.value} onChangeText={f.set} keyboardType={f.keyboard} style={styles.input} />
            </View>
          ))}
          <GradientButton title="Confirm Transfer" onPress={confirm} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.base },
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  available: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textMuted, textAlign: 'center', letterSpacing: 1, marginBottom: Spacing.base },
  form: { padding: Spacing.xl, gap: Spacing.md },
  label: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary },
  input: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.base, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.borderMid, borderRadius: Radius.lg, paddingHorizontal: Spacing.base, height: 52 },
});
