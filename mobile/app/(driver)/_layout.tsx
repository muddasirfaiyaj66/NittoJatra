import { Redirect, Stack } from 'expo-router';
import { AuthLoading } from '@/components/auth/AuthLoading';
import { ROUTES, homeRouteForRole } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { resolveActiveRole } from '@/utils/auth-routing';

export default function DriverLayout() {
  const { isAuthenticated, hasHydrated, user, role } = useAuth();

  if (!hasHydrated) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <Redirect href={ROUTES.welcome} />;
  }

  const activeRole = resolveActiveRole(user?.role, role);
  if (activeRole !== 'driver') {
    return <Redirect href={homeRouteForRole('rider')} />;
  }

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
