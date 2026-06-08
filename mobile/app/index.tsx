import { Redirect } from 'expo-router';
import { AuthLoading } from '@/components/auth/AuthLoading';
import { homeRouteForRole } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { isAuthenticated, hasHydrated, role, user } = useAuth();
  const homeRole = user?.role ?? role;

  if (!hasHydrated) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Redirect href={homeRouteForRole(homeRole)} />;
}
