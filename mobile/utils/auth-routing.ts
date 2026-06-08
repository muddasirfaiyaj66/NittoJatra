import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { ROUTES, homeRouteForRole } from '@/constants/routes';
import { UserRole } from '@/types';

export function roleHomeHref(role: UserRole): Href {
  return homeRouteForRole(role);
}

export function navigateToRoleHome(role: UserRole) {
  router.replace(homeRouteForRole(role));
}

export function resolveActiveRole(userRole: UserRole | undefined, storeRole: UserRole): UserRole {
  return userRole ?? storeRole;
}

export { ROUTES };
