import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { TabBarWithDot } from '@/components/shared/TabBarWithDot';
import { homeRouteForRole, ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

const RIDER_TABS = {
  index: { active: 'home' as const, inactive: 'home-outline' as const, label: 'Home' },
  search: { active: 'search' as const, inactive: 'search-outline' as const, label: 'Find' },
  'my-rides': { active: 'car' as const, inactive: 'car-outline' as const, label: 'My Rides' },
  safety: { active: 'shield' as const, inactive: 'shield-outline' as const, label: 'Safety' },
  profile: { active: 'person' as const, inactive: 'person-outline' as const, label: 'Profile' },
};

export default function TabsLayout() {
  const { role, isAuthenticated, hasHydrated } = useAuth();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace(ROUTES.welcome);
      return;
    }
    if (role === 'driver') {
      router.replace(homeRouteForRole('driver'));
    }
  }, [hasHydrated, isAuthenticated, role]);

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
