import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="payment-method" />
      <Stack.Screen name="payment-details" />
      <Stack.Screen name="security-pin" />
      <Stack.Screen name="verify-otp" />
      <Stack.Screen name="mobile-transfer" />
      <Stack.Screen name="saved-places" />
      <Stack.Screen name="add-trusted-contact" />
      <Stack.Screen name="verification-info" />
      <Stack.Screen name="rate-driver" />
      <Stack.Screen name="report-issue" />
    </Stack>
  );
}
