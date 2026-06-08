import { Redirect, Stack } from 'expo-router';
import { AuthLoading } from '@/components/auth/AuthLoading';
import { homeRouteForRole, ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { resolveActiveRole } from '@/utils/auth-routing';

export default function AuthLayout() {
  const { isAuthenticated, hasHydrated, user, role } = useAuth();

  if (!hasHydrated) {
    return <AuthLoading />;
  }

  if (isAuthenticated) {
    const activeRole = resolveActiveRole(user?.role, role);
    return <Redirect href={homeRouteForRole(activeRole)} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
