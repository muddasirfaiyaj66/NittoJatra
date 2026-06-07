import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientButton } from '@/components/ui';
import { Colors, Radius, Spacing, Typography } from '@/constants/theme';
import { usePaymentStore } from '@/store/payment.store';

export default function VerifyOtpModal() {
  const [otp, setOtp] = useState('');
  const { reset } = usePaymentStore();

  const confirm = () => {
    reset();
    router.dismissAll();
    router.push('/notifications');
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['bottom']}>
        <View style={styles.handle} />
        <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={() => router.back()} style={styles.close}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.content}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.sub}>We sent a 6-digit code to 011****5678</Text>
          <View style={styles.otpRow}>
            {Array.from({ length: 6 }).map((_, i) => (
              <TextInput
                key={i}
                accessibilityLabel={`OTP digit ${i + 1}`}
                style={styles.otpBox}
                maxLength={1}
                keyboardType="number-pad"
                value={otp[i] ?? ''}
                onChangeText={(v) => {
                  const next = otp.split('');
                  next[i] = v;
                  setOtp(next.join('').slice(0, 6));
                }}
              />
            ))}
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Resend OTP">
            <Text style={styles.resend}>Resend OTP</Text>
          </Pressable>
          <GradientButton title="Confirm Payment" variant="primary" onPress={confirm} />
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
  title: { fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary, textAlign: 'center' },
  sub: { fontFamily: Typography.fonts.medium, fontSize: Typography.fontSizes.sm, color: Colors.textSecondary, textAlign: 'center' },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm },
  otpBox: { width: 44, height: 52, borderWidth: 1, borderColor: Colors.borderMid, borderRadius: Radius.md, textAlign: 'center', fontFamily: Typography.fonts.black, fontSize: Typography.fontSizes.lg, color: Colors.textPrimary },
  resend: { fontFamily: Typography.fonts.bold, fontSize: Typography.fontSizes.sm, color: Colors.primary, textAlign: 'center' },
});
