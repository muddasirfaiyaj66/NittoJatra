import type { Href } from 'expo-router';
import { UserRole } from '@/types';

/** Unique URL segments — rider/captain must not share the same collapsed path (expo-router maps groups to `/`). */
export const ROUTES = {
  riderHome: '/rider/(tabs)' as Href,
  driverHome: '/driver/(tabs)' as Href,
  riderTabs: '/rider/(tabs)' as Href,
  driverTabs: '/driver/(tabs)' as Href,
  driverPostRoute: '/driver/post-route' as Href,
  welcome: '/(auth)/welcome' as Href,
} as const;

export function homeRouteForRole(role: UserRole): Href {
  return role === 'driver' ? ROUTES.driverHome : ROUTES.riderHome;
}

export function chatRoute(conversationId: string, name?: string): Href {
  return {
    pathname: '/messages/[id]',
    params: name ? { id: conversationId, name } : { id: conversationId },
  } as unknown as Href;
}
