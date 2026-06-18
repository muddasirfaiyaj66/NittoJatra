import { Tabs, router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { TabBarWithDot } from '@/components/shared/TabBarWithDot';
import { ROUTES } from '@/constants/routes';
import { useAuthStore } from '@/store/auth.store';
import { useDriverStore } from '@/store/driver.store';

const DRIVER_TABS = {
  index: { active: 'home' as const, inactive: 'home-outline' as const, label: 'Dashboard' },
  post: { active: 'add-circle' as const, inactive: 'add-circle-outline' as const, label: 'Post' },
  schedule: { active: 'map' as const, inactive: 'map-outline' as const, label: 'Routes' },
  earnings: { active: 'logo-usd' as const, inactive: 'logo-usd' as const, label: 'Earnings' },
  profile: { active: 'person' as const, inactive: 'person-outline' as const, label: 'Profile' },
};

export default function DriverTabsLayout() {
  const fetchDashboard = useDriverStore((state) => state.fetchDashboard);
  const refreshProfile = useAuthStore((state) => state.refreshProfile);

  useFocusEffect(
    useCallback(() => {
      void fetchDashboard();
      void refreshProfile();
    }, [fetchDashboard, refreshProfile]),
  );

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => (
        <TabBarWithDot
          {...props}
          icons={DRIVER_TABS}
          centerAction={{
            routeName: 'post',
            onPress: () => router.push(ROUTES.driverPostRoute),
          }}
        />
      )}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="post" options={{ title: 'Post' }} />
      <Tabs.Screen name="schedule" options={{ title: 'Routes' }} />
      <Tabs.Screen name="earnings" options={{ title: 'Earnings' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
