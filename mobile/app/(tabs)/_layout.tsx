import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router';
import { AuthLoading } from '@/components/auth/AuthLoading';
import { TabBarWithDot } from '@/components/shared/TabBarWithDot';
import { ROUTES, homeRouteForRole } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { resolveActiveRole } from '@/utils/auth-routing';

const RIDER_TABS = {
  index: { active: 'home' as const, inactive: 'home-outline' as const, label: 'Home' },
  search: { active: 'search' as const, inactive: 'search-outline' as const, label: 'Find' },
  'my-rides': { active: 'ticket' as const, inactive: 'ticket-outline' as const, label: 'My Rides' },
  safety: { active: 'shield' as const, inactive: 'shield-outline' as const, label: 'Safety' },
  profile: { active: 'person' as const, inactive: 'person-outline' as const, label: 'Profile' },
};

export default function TabsLayout() {
  const { isAuthenticated, hasHydrated, user, role } = useAuth();

  if (!hasHydrated) {
    return <AuthLoading />;
  }

  if (!isAuthenticated) {
    return <Redirect href={ROUTES.welcome} />;
  }

  const activeRole = resolveActiveRole(user?.role, role);
  if (activeRole === 'driver') {
    return <Redirect href={homeRouteForRole('driver')} />;
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBarWithDot {...props} icons={RIDER_TABS} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Find' }} />
      <Tabs.Screen name="my-rides" options={{ title: 'My Rides' }} />
      <Tabs.Screen name="safety" options={{ title: 'Safety' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
