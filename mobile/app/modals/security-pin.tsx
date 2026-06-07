import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '@/components/ui';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { usePaymentStore } from '@/store/payment.store';

export default function SecurityPinModal() {
  const [pin, setPin] = useState('');
  const { setStep } = usePaymentStore();

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']}>
        <View style={styles.handle} />
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.content}>
          <Ionicons name="shield-checkmark" size={48} color={Colors.primary} />
          <Text style={styles.title}>Enter your secret PIN to authorize</Text>
          <TextInput
            accessibilityLabel="Security PIN"
            value={pin}
            onChangeText={(v) => setPin(v.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            secureTextEntry
            maxLength={6}
            style={styles.pinInput}
          />
          <View style={styles.dots}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
            ))}
          </View>
          <GradientButton title="Continue" onPress={() => { setStep('otp'); router.push('/modals/verify-otp'); }} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.surface, borderTopLeftRadius: Radius.card, borderTopRightRadius: Radius.card },
  handle: { width: 40, height: 4, backgroundColor: Colors.borderMid, borderRadius: 2, alignSelf: 'center', marginTop: Spacing.md },
  close: { alignSelf: 'flex-end', padding: Spacing.xl },
  content: { alignItems: 'center', padding: Spacing.xl, gap: Spacing.lg },
  title: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.base, color: Colors.textSecondary, textAlign: 'center' },
  pinInput: { position: 'absolute', opacity: 0, height: 0 },
  dots: { flexDirection: 'row', gap: Spacing.md },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: Colors.borderMid },
  dotFilled: { backgroundColor: Colors.primary, borderColor: Colors.primary },
});
