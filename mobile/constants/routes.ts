import type { Href } from 'expo-router';
import { UserRole } from '@/types';

export const ROUTES = {
  riderTabs: '/(tabs)' as Href,
  driverTabs: '/(driver)/(tabs)' as Href,
  driverPostRoute: '/(driver)/post-route' as Href,
  welcome: '/(auth)/welcome' as Href,
} as const;

export function homeRouteForRole(role: UserRole): Href {
  return (role === 'driver' ? ROUTES.driverTabs : ROUTES.riderTabs) as Href;
}
