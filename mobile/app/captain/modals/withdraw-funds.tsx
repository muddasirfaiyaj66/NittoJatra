import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '@/components/ui';
import { SegmentedControl } from '@/components/shared/SegmentedControl';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';

export default function WithdrawFundsModal() {
  const [amount, setAmount] = useState('0');
  const [method, setMethod] = useState(0);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']}>
        <View style={styles.handle} />
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.content}>
          <Text style={styles.label}>AMOUNT TO WITHDRAW</Text>
          <TextInput accessibilityLabel="Withdrawal amount" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.amountInput} />
          <SegmentedControl options={['BANK', 'BKASH']} selected={method} onChange={setMethod} />
          <GradientButton title="CONFIRM WITHDRAWAL" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md },
  close: { alignSelf: 'flex-end', paddingHorizontal: Spacing.xl },
  content: { padding: Spacing.xl, gap: Spacing.lg },
  label: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.xs, color: Colors.textMuted, letterSpacing: 1 },
  amountInput: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.xxl, color: Colors.textPrimary, borderBottomWidth: 1, borderBottomColor: Colors.borderMid, paddingVertical: Spacing.sm },
});
