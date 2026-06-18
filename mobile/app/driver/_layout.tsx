import { Stack, router } from 'expo-router';
import { useEffect } from 'react';
import { homeRouteForRole, ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

export default function DriverLayout() {
  const { role, isAuthenticated, hasHydrated } = useAuth();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace(ROUTES.welcome);
      return;
    }
    if (role !== 'driver') {
      router.replace(homeRouteForRole('rider'));
    }
  }, [hasHydrated, isAuthenticated, role]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="post-route" options={{ presentation: 'card' }} />
      <Stack.Screen name="messages" options={{ presentation: 'card' }} />
      <Stack.Screen name="notifications" options={{ presentation: 'card' }} />
      <Stack.Screen name="modals" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
