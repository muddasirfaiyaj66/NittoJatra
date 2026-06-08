import { Stack } from 'expo-router';

export default function DriverModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <Stack.Screen name="management-console" />
      <Stack.Screen name="withdraw-funds" />
      <Stack.Screen name="vehicle-management" />
    </Stack>
  );
}
