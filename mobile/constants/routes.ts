import type { Href } from 'expo-router';
import { UserRole } from '@/types';

/** Unique URL segments — rider/captain must not share the same collapsed path (expo-router maps groups to `/`). */
export const ROUTES = {
  riderHome: '/rider/(tabs)' as Href,
  driverHome: '/captain/(tabs)' as Href,
  riderTabs: '/rider/(tabs)' as Href,
  driverTabs: '/captain/(tabs)' as Href,
  driverPostRoute: '/captain/post-route' as Href,
  welcome: '/(auth)/welcome' as Href,
} as const;

export function homeRouteForRole(role: UserRole): Href {
  return role === 'driver' ? ROUTES.driverHome : ROUTES.riderHome;
}
